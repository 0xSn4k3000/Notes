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