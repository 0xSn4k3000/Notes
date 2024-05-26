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