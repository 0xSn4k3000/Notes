# Passive:

## responder

```bash
sudo responder -I ens224 -A 
```

# Active:

## fping

ICMP sweep of the subnet using fping
```bash
fping -asgq 172.16.5.0/23
```