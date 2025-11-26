## NOTES

NFS uses RPC which doesn't work well through SOCKS proxies

```bash
sudo systemctl stop rpcbind # (111)
ssh -L 111:192.168.100.2:111 -L 2049:192.168.100.2:2049 user@pivot-host
```

## Enum shares

```bash
$ nxc nfs DC01.mirage.htb --enum-shares
```

CHECK ippsec mirage machine for more info
