# NetExec

# Important

If smb is not working with the domain like example.com, try to add the dc sub like dc.example.com

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

## With a ticket

if you have a ticket then you can use impacket-smbclient.py

```
smbclient.py -k dc.example.com
```
