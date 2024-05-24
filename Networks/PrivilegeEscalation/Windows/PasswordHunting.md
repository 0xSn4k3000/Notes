# winpeas

## Search for autologon passwords

# Powershell history
Search for hidden directorys with
```powershell
dir -force
```
It may contains PS Transcripts.

# Decrypt Secure String
```powershell
$password = ConvertTo-SecureString 'P@ssw0rd' -AsPlainText -Force

$Ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password)
$result = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($Ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeCoTaskMemUnicode($Ptr)
$result 
```