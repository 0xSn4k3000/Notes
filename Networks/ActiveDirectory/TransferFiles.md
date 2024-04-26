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