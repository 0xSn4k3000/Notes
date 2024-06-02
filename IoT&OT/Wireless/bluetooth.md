# Attack types

| Attack | Dis  |
|--------|------|
| Bluesnarfing | A cyber-attack involving unauthorised access to information from wireless devices through Bluetooth. |
| Bluejacking | An attack that sends unsolicited messages to Bluetooth-enabled devices. |
| BlueSmacking | A Denial-of-Service attack that overwhelms a device's Bluetooth connection. |
| Bluebugging | A technique used to gain control over a device via Bluetooth. |
| BlueBorne | A set of vulnerabilities that allow attackers to take control of devices, spread malware, or perform other malicious activities via Bluetooth. | 
| KNOB (Key Negotiation of Bluetooth) | An attack that manipulates the data encryption process during Bluetooth connection establishment, weakening security. | 
| BIAS (Bluetooth Impersonation AttackS) | This attack exploits a vulnerability in the pairing process, allowing an attacker to impersonate a trusted device. |

## Cryptanalysis Side-Channel Attacks

Cryptanalysis side-channel attacks are an intriguing topic in cybersecurity. These attacks utilise information gained from implementing and running a computer system rather than brute force or theoretical weaknesses in algorithms.

### Side-channel attacks
### Timing Attacks
These exploit the correlation between the computation time of cryptographic algorithms and the secrets they process.

### Power-Monitoring Attacks
These monitor the power consumption of a device to determine what data it is processing.


## Microprocessor Vulnerabilities



# Bluetooth

Bluetooth functionality is based on several key concepts, including device pairing, piconets, and data transfer protocols. The first step in establishing a Bluetooth connection is the pairing process. This involves two devices **discovering** each other and establishing a connection:

1. **Discovery**: One device makes itself discoverable, broadcasting its presence to other Bluetooth devices within range.
2. **Pairing Request**: A second device finds the discoverable device and sends a pairing request.
3. **Authentication**: The devices authenticate each other through a process involving a shared secret, known as a link key or long-term key. This may involve entering a PIN on one or both devices.

# Bluetooth data links types:

1. **Synchronous Connection-Oriented (SCO) links**: Primarily used for audio communication, these links reserve slots at regular intervals for data transmission, guaranteeing steady, uninterrupted communication ideal for audio data.
2. **Asynchronous Connection-Less (ACL) links**: These links cater to transmitting all other types of data. Unlike SCO links, ACL links do not reserve slots but transmit data whenever bandwidth allows.

# Bluetooth Attacks

| Bluetooth attack | Description |
| ---------------- | ----------- |
|Bluejacking |	Bluejacking is a relatively harmless type of Bluetooth hacking where an attacker sends unsolicited messages or business cards to a device. Although it doesn't pose a direct threat, it can infringe on privacy and be a nuisance to the device owner.|
| Bluesnarfing |	Bluesnarfing entails unauthorised access to a Bluetooth-enabled device's data, such as contacts, messages, or calendar entries. Attackers exploit vulnerabilities to retrieve sensitive information without the device owner's knowledge or consent. This could lead to privacy violations and potential misuse of personal data.|
| Bluebugging |	Bluebugging enables an attacker to control a Bluetooth device, including making calls, sending messages, and accessing data. By exploiting security weaknesses, attackers can gain unauthorised access and manipulate the device's functionalities, posing a significant risk to user privacy and device security.|
| Car Whisperer | 	Car Whisperer is a Bluetooth hack that specifically targets vehicles. Attackers exploit Bluetooth vulnerabilities to remotely unlock car doors or even start the engine without physical access. This poses a serious security threat as it can lead to car theft and compromise the safety of vehicle owners.|
| Bluesmacking & Denial of Service | 	Denial of Service (DoS) attacks leverage vulnerabilities in Bluetooth protocols to disrupt or disable the connection between devices. Bluesmacking, a specific type of DoS attack, involves sending excessive Bluetooth connection requests, overwhelming the target device and rendering it unusable. These attacks can disrupt normal device operations and cause inconvenience to users.|
| Man-in-the-Middle |	Man-in-the-Middle (MitM) attacks intercept and manipulate data exchanged between Bluetooth devices. By positioning themselves between the communicating devices, attackers can eavesdrop on sensitive information or alter the transmitted data. MitM attacks compromise the confidentiality and integrity of Bluetooth communications, posing a significant risk to data security.|
| BlueBorne | 	Discovered in 2017, BlueBorne is a critical Bluetooth vulnerability that allows an attacker to take control of a device without requiring any user interaction or device pairing. Exploiting multiple zero-day vulnerabilities, BlueBorne presents a severe threat to device security and user privacy. Its pervasive nature makes it a significant concern across numerous Bluetooth-enabled devices.|
| Key Extraction | Key extraction attacks aim to retrieve encryption keys used in Bluetooth connections. By obtaining these keys, attackers can decrypt and access sensitive data transmitted between devices. Key extraction attacks undermine the confidentiality of Bluetooth communications and can result in exposure of sensitive information. |
| Eavesdropping | 	Eavesdropping attacks involve intercepting and listening to Bluetooth communications. Attackers capture and analyse data transmitted between devices, potentially gaining sensitive information such as passwords, financial details, or personal conversations. Eavesdropping attacks compromise the confidentiality of Bluetooth communications and can lead to severe privacy violations. |
| Bluetooth Impersonation Attack |	In this attack type, an attacker impersonates a trusted Bluetooth device to gain unauthorised access or deceive the user. By exploiting security vulnerabilities, attackers can trick users into connecting to a malicious device, resulting in data theft, unauthorised access, or other malicious activities. Bluetooth impersonation attacks undermine trust and integrity in Bluetooth connections, posing a significant risk to device security and user trust.|

# Legacy Attacks