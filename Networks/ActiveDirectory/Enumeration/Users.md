## Wordlists:
https://github.com/insidetrust/statistically-likely-usernames

https://github.com/w0Tx/generate-ad-username
https://github.com/urbanadventurer/username-anarchy
https://github.com/initstring/linkedin2username

## kerbrute

### If available first search for names from the internet and convert them to a list using:
-> https://github.com/urbanadventurer/username-anarchy
```bash
~/tools/active_directory/username-anarchy/username-anarchy -i ./users.txt
```

```bash
kerbrute userenum -d INLANEFREIGHT.LOCAL --dc 172.16.5.5 jsmith.txt -o valid_ad_users
```

# Domain Admins

## windapsearch

```bash
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 --da
```

---
---

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