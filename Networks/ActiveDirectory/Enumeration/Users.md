## Wordlists:
https://github.com/insidetrust/statistically-likely-usernames

## kerbrute
```bash
kerbrute userenum -d INLANEFREIGHT.LOCAL --dc 172.16.5.5 jsmith.txt -o valid_ad_users
```


# SMB Null session

## enum4linux
```bash
enum4linux -U 172.16.5.5  | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"
```

## rpcclient
```bash
rpcclient -U "" -N 172.16.5.5
rpcclient $> enumdomusers
```

## crackmapexec
```bash
crackmapexec smb 172.16.5.5 --users
```

# LDAP Anonymous
```bash
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))"  | grep sAMAccountName: | cut -f2 -d" "
```

# Credentialed Enumeration to Build our User List

## crackmapexec

```bash
crackmapexec smb 172.16.5.5 -u htb-student -p Academy_student_AD! --users
```