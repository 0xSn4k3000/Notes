## Creating a PSCredential Object

```powershell
$SecPassword = ConvertTo-SecureString '<PASSWORD HERE>' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\wley', $SecPassword)
```

## Changing the User's Password

```powershell
Import-Module .\PowerView.ps1
Set-DomainUserPassword -Identity USER_TO_CHANGE_PASS -AccountPassword $PASS_OBJECT -Credential $Cred -Verbose
```

### From linux

#### rpc
```bash
rpcclient> setuserinfo UserName 23 password
                                ^
```

## Shadow Credentials