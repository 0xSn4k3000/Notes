# Enumerating the Password Policy - from Linux - SMB NULL Sessions

Without credentials, we may be able to obtain the password policy via an SMB NULL session or LDAP anonymous bind.

## rpcclient
```bash
rpcclient -U "" -N 172.16.5.5

rpcclient $> querydominfo
rpcclient $> getdompwinfo
```

# Enumerating the Password Policy - from Linux - LDAP Anonymous Bind

## ldapsearch
```bash
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength
```

# Enumerating the Password Policy - from Linux - Credentialed

## crackmapexec
```bash
crackmapexec smb 172.16.5.5 -u avazquez -p Password123 --pass-pol
```


# Enumerating Null Session - from Windows

```powershell
net use \\DC01\ipc$ "" /u:""
```