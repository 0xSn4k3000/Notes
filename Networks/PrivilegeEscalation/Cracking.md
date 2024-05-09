# Windows

## Kerberos ticket TGT
```bash
kirbi2john.py file.kirbi > john.txt
john --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5tgs john.txt 
```
```bash
hashcat -m 13100 svc_backup.hash ~/wordlists/rockyou.txt
```


# Linux