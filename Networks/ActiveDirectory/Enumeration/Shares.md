# NetExec


## Null Session
```bash
nxc smb 10.10.10.161 -u '' -p '' --shares
```

## smbclient

```bash
smbclient -N -L \\\\10.10.10.103
```

## mount a share local

```bash
mount -t cifs -o rw,username=guest,password= '//10.10.10.103/DepartmentShares' /mnt
```

