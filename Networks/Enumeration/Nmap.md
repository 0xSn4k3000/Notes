### TCP-SYN scan (-sS)
```
If our target sends an SYN-ACK flagged packet back to the scanned port, Nmap detects that the port is open.

If the packet receives an RST flag, it is an indicator that the port is closed.

If Nmap does not receive a packet back, it will display it as filtered. Depending on the firewall configuration, certain packets may be dropped or ignored by the firewall.
```

## Host Discovery:
https://nmap.org/book/host-discovery-strategies.html

### Scan Network Range:
```terminal
$ sudo nmap 10.129.2.0/24 -sn -oA tnet | grep for | cut -d" " -f5
```
| Scanning Options      | Description   |
| -------------         |:-------------:| 
| `10.129.2.0/24`       | Target network range | 
| `-sn`                 | Disables port scanning | 
| `-oA tnet`            |  Stores the results in all formats starting with the name 'tnet'|
| `--packet-trace`      | Shows all packets sent and received |
| `-PE` 	            | Performs the ping scan by using 'ICMP Echo requests' against the targ|
| `--disable-arp-ping`  | Disable ARP pings |



## Host and Port Scanning
https://nmap.org/book/man-port-scanning-techniques.html


| State         | Description   |
| ------------- |:-------------:| 
| open 	| This indicates that the connection to the scanned port has been established. These connections can be TCP connections, UDP datagrams as well as SCTP associations.
closed |	When the port is shown as closed, the TCP protocol indicates that the packet we received back contains an RST flag. This scanning method can also be used to determine if our target is alive or not.
filtered |	Nmap cannot correctly identify whether the scanned port is open or closed because either no response is returned from the target for the port or we get an error code from the target.
unfiltered | 	This state of a port only occurs during the TCP-ACK scan and means that the port is accessible, but it cannot be determined whether it is open or closed.
open \| filtered | If we do not get a response for a specific port, Nmap will set it to that state. This indicates that a firewall or packet filter may protect the port.
closed \| filtered |	This state only occurs in the IP ID idle scans and indicates that it was impossible to determine if the scanned port is closed or filtered by a firewall.

## Saving the Results (Reporting):

With the XML output, we can easily create HTML reports that are easy to read, even for non-technical people. This is later very useful for documentation, as it presents our results in a detailed and clear way. To convert the stored results from XML format to HTML, we can use the tool xsltproc.
```
$ xsltproc target.xml -o target.html
```

## Service Enumeration

Remember that nmap doesn't recognize all ports information by default.
Sometimes port can respond after a long time so use netcat to connect to the port and wait for the banner.

## NSE

| Category      | Description   |
| ------------- |:-------------:|
| auth      |	Determination of authentication credentials. |
| broadcast |	Scripts, which are used for host discovery by broadcasting and the discovered hosts, can be automatically added to the remaining scans. |
| brute     | 	Executes scripts that try to log in to the respective service by brute-forcing with credentials.|
| default   | 	Default scripts executed by using the -sC option. |
| discovery |	Evaluation of accessible services. |
| dos       |	These scripts are used to check services for denial of service vulnerabilities and are used less as it harms the services. |
| exploit   | 	This category of scripts tries to exploit known vulnerabilities for the scanned port. |
| external  |	Scripts that use external services for further processing. |
| fuzzer    | 	This uses scripts to identify vulnerabilities and unexpected packet handling by sending different fields, which can take much time. |
| intrusive | 	Intrusive scripts that could negatively affect the target system. |
| malware   | 	Checks if some malware infects the target system. | 
| safe      | 	Defensive scripts that do not perform intrusive and destructive access. |
| version   | 	Extension for service detection. |
| vuln      | 	Identification of specific vulnerabilities |

# Firewall and IDS/IPS Evasion

Nmap's TCP ACK scan (`-sA`) method is much harder to filter for firewalls and IDS/IPS systems than regular SYN (`-sS`) or Connect scans (`-sT`) because they only send a TCP packet with only the ACK flag. When a port is closed or open, the host must respond with an RST flag. Unlike outgoing connections, all connection attempts (with the SYN flag) from external networks are usually blocked by firewalls. However, the packets with the ACK flag are often passed by the firewall because the firewall cannot determine whether the connection was first established from the external network or the internal network.

## Decoys
There are cases in which administrators block specific subnets from different regions in principle. This prevents any access to the target network. Another example is when IPS should block us. For this reason, the Decoy scanning method (-D) is the right choice. With this method, Nmap generates various random IP addresses inserted into the IP header to disguise the origin of the packet sent. With this method, we can generate random (RND) a specific number (for example: 5) of IP addresses separated by a colon (:). Our real IP address is then randomly placed between the generated IP addresses. In the next example, our real IP address is therefore placed in the second position. Another critical point is that the decoys must be alive. Otherwise, **the service on the target may be unreachable due to SYN-flooding security mechanisms**.

```
$ sudo nmap 10.129.2.28 -p 80 -sS -Pn -n --disable-arp-ping --packet-trace -D RND:5
```

Another scenario would be that only individual subnets would not have access to the server's specific services. So we can also manually specify the source IP address (`-S`) to test if we get better results with this one. Decoys can be used for SYN, ACK, ICMP scans, and OS detection scans. So let us look at such an example and determine which operating system it is most likely to be.

```
$ sudo nmap 10.129.2.28 -n -Pn -p 445 -O -S 10.129.2.200 -e tun0
```

## DNS Proxying

By default, Nmap performs a reverse DNS resolution unless otherwise specified to find more important information about our target. These DNS queries are also passed in most cases because the given web server is supposed to be found and visited. The DNS queries are made over the UDP port 53. The TCP port 53 was previously only used for the so-called "Zone transfers" between the DNS servers or data transfer larger than 512 bytes. More and more, this is changing due to IPv6 and DNSSEC expansions. These changes cause many DNS requests to be made via TCP port 53.

However, Nmap still gives us a way to specify DNS servers ourselves (`--dns-server <ns>,<ns>`). This method could be fundamental to us if we are in a demilitarized zone (`DMZ`). The company's DNS servers are usually more trusted than those from the Internet. So, for example, we could use them to interact with the hosts of the internal network. As another example, we can use TCP port 53 as a source port (`--source-port`) for our scans. If the administrator uses the firewall to control this port and does not filter IDS/IPS properly, our TCP packets will be trusted and passed through.



