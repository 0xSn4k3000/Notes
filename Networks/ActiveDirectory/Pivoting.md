## Socks5

```bash
./chisel server --auth "user:pass" --port 8080 --reverse

# socks
./chisel client --auth "user:pass" server.mydomain.com:8080 R:socks

# port forwarding
./chisel client --auth "user:pass" server.mydomain.com:8080 R:2222:10.0.5.25:22 R:8888:192.168.1.100:8080
```

## VPN

```bash
sshuttle -r user@pivot-host 10.10.0.0/24
```

Now, you can directly access 10.10.x.x IPs from your box as if you were inside the network.
Perfect when full port forwarding is needed and not just SOCKS proxying.

## Scanning

```bash
proxychains nmap -sT 10.10.0.0/24
```
