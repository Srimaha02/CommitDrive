// Computer Networks Curriculum — 10 Topics (Calibrated Beginner -> Intermediate -> Advanced)
// Review Candidate: Draft v1.0 — Structured for editorial fact-checking against standard references

export const cnTopics = [
  {
    id: 'cn-1',
    subjectId: 'cn',
    order: 1,
    title: 'Network Topologies, Switching & Delay Fundamentals',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine two different ways to communicate across a continent. Circuit Switching is like renting a private dedicated telephone landline from New York to Los Angeles: as long as the call is connected, that copper line is 100% reserved exclusively for you; even if you sit in complete silence for 20 minutes, nobody else in the world can send data through that wire. Packet Switching is like sending letters through the postal mail: your long letter is cut into small standardized postcards (Packets), stamped with destination addresses, and mixed into mail delivery trucks traveling along public highways alongside millions of other citizens\' postcards. If one highway has a traffic jam, the trucks take alternate detour roads.',
    what: 'A Computer Network is a collection of autonomous computing devices interconnected by transmission media to share data and hardware resources. Network architecture begins with Network Topologies—the physical and logical arrangement of nodes: Star (all nodes connect to a central switch/hub; failure of one cable affects only that device, making it standard for home/office LANs), Mesh (devices are interconnected with redundant links for extreme fault-tolerance, standard in core Internet backbones), Bus (all devices share a single backbone cable; vulnerable to cable breaks), and Ring.\n\nModern data networks operate via Packet Switching rather than legacy Circuit Switching. Long messages are fragmented into small units called Packets. Routers inspect each packet\'s header and forward it hop-by-hop across links using Statistical Multiplexing (sharing transmission link bandwidth on-demand). When a user is idle, other users utilize the full link capacity, achieving vastly higher efficiency than pre-allocated circuits.\n\nAs a packet travels from source to destination, it experiences Four Fundamental Delays across every intermediate router:\n1. Transmission Delay ($d_{\\text{trans}} = L / R$): The time required for the sender\'s network interface to push (serialize) all bits of a packet of length $L$ onto a transmission link of bandwidth rate $R$.\n2. Propagation Delay ($d_{\\text{prop}} = d / s$): The physical time it takes for an electromagnetic or optical signal to travel distance $d$ through the transmission medium at signal speed $s$ (approximately $2 \\times 10^8$ m/s in fiber).\n3. Queuing Delay: The time a packet sits in router memory buffers waiting for the transmission link to become available.\n4. Processing Delay: The time the router CPU takes to inspect the packet header, check for bit errors, and consult the routing table.',
    why: 'The global Internet grew into the world\'s largest distributed infrastructure because Packet Switching allows millions of heterogeneous computers to share transmission lines efficiently without needing trillions of dedicated circuits.\n\nUnderstanding the four delay components is essential for network engineering: while transmission delay can be minimized by upgrading to faster 10 Gbps / 100 Gbps network cards, propagation delay is fundamentally bounded by the physical speed of light in optical fiber. A packet traveling between London and Sydney will always take at least 80–100 milliseconds purely due to planetary geography, explaining why Content Delivery Networks (CDNs) cache content physically close to users.',
    useCase: 'Traditional landline phone networks used Circuit Switching, requiring massive call-setup delays and charging per minute because dedicated copper circuits sat reserved. In contrast, modern Voice-over-IP (VoIP) platforms like Zoom, Discord, and WhatsApp operate entirely over Packet Switching: your voice audio is encoded into small 20-millisecond UDP packets that navigate the Internet independently and are reassembled smoothly on your friend\'s smartphone.\n\nIn cloud computing data centers (like AWS and Google Cloud), engineers design Leaf-Spine star topologies where every leaf switch connects to every spine switch, ensuring deterministic sub-millisecond round-trip packet latency between thousands of server racks.',
    example: `+-----------------------------------------------------------------------------+
|               PACKET SWITCHING & THE 4 COMPONENT DELAYS                     |
+-----------------------------------------------------------------------------+

 [ Source Host A ]                                         [ Destination Host B ]
   |                                                                ^
   | 1. Transmission Delay (d_trans = L / R)                        |
   |    Time to push all L bits onto wire                           |
   v                                                                |
 [ Router Input Buffer ]                                            |
   |                                                                |
   | 2. Processing Delay (d_proc)                                   |
   |    Header inspection & routing lookup                          |
   v                                                                |
 [ Router Queue / Buffer ]                                          |
   |                                                                |
   | 3. Queuing Delay (d_queue)                                     |
   |    Waiting for link to become free (can drop if buffer full!)  |
   v                                                                |
 [ Router Output Port ] --------------------------------------------+
                            4. Propagation Delay (d_prop = d / s)
                            Physical transit time across fiber link (d)
                            at the speed of light in glass (s = 200,000 km/s)

===============================================================================
FORMULA SUMMARY:
  Total Nodal Delay = d_proc + d_queue + d_trans + d_prop
  Bandwidth-Delay Product (BDP) = Bandwidth (R) x Round-Trip Time (RTT)`,
    exampleExplanation: [
      'Stage 1 (Transmission Delay - L/R): The network card serializes packet bits onto the wire. If packet size L = 1000 bytes (8000 bits) and link speed R = 1 Gbps, transmission takes 8 microseconds.',
      'Stage 2 (Processing Delay): The router hardware inspects the IP header checksum and consults its forwarding table to find the destination interface (microseconds).',
      'Stage 3 (Queuing Delay): If another packet is currently being transmitted, this packet waits in the output buffer. If traffic surges and the buffer overflows, Packet Loss occurs.',
      'Stage 4 (Propagation Delay - d/s): The optical signal travels down the physical fiber cable. Traveling 3000 km across a continent takes 15 milliseconds, dominating total latency.',
      'Conclusion: Total delay is the cumulative sum of all 4 stages across every router hop along the path.'
    ],
    interviewQuestions: [
      {
        id: 'cn-1-q1',
        question: 'What is the exact difference between Transmission Delay and Propagation Delay?',
        companyTags: ['Cisco', 'Amazon', 'Qualcomm'],
        frequency: 'Very High',
        answer: '• Transmission Delay ($L/R$): The time required for the sender\'s network interface card (NIC) to push all bits of a packet of length $L$ onto the transmission medium with bandwidth $R$. It depends purely on packet size and link bandwidth.\n• Propagation Delay ($d/s$): The physical time it takes for a single bit to travel through the physical medium (fiber/copper) over distance $d$ at propagation speed $s$. It depends purely on physical distance and the speed of light in the medium.\n• Analogy: At a highway toll booth, transmission delay is the time it takes the toll collector to stamp tickets for a 10-car caravan; propagation delay is the time it takes the cars to drive 100 miles down the highway.'
      },
      {
        id: 'cn-1-q2',
        question: 'Why does the modern Internet rely on Packet Switching instead of Circuit Switching?',
        companyTags: ['Google', 'Microsoft', 'TCS'],
        frequency: 'Very High',
        answer: 'Internet and web application traffic is naturally bursty: a user clicks a webpage link, reads for 45 seconds (transmitting zero data), and clicks another link. In circuit switching, dedicated bandwidth is reserved and completely wasted during idle reading intervals.\n\nPacket switching uses Statistical Multiplexing: multiple users share channel capacity on-demand. When one user is idle, another user transmits at full link speed, allowing a network link to support 3-5x more simultaneous active users with lower infrastructure cost.'
      },
      {
        id: 'cn-1-q3',
        question: 'What is the Bandwidth-Delay Product (BDP), and what does it physically represent?',
        companyTags: ['Akamai', 'Cloudflare', 'Juniper'],
        frequency: 'High',
        answer: 'The Bandwidth-Delay Product is defined as $\\\\text{BDP} = \\\\text{Link Bandwidth} \\\\times \\\\text{Round-Trip Time (RTT)}$.\n\nPhysical Representation: It represents the volume or capacity of the network "pipe" in bits or bytes—the maximum amount of unacknowledged data that can be actively "in-flight" on the physical wire at any given instant. For TCP to saturate a high-speed, high-latency link (like satellite or transoceanic fiber), the TCP receive window must be at least as large as the BDP.'
      },
      {
        id: 'cn-1-q4',
        question: 'Why is Star Topology the universal standard for modern Local Area Networks (LANs)?',
        companyTags: ['Cisco', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: 'In a Star Topology, every client workstation connects independently to a central switch via dedicated twisted-pair Ethernet cables.\n\nKey Advantages:\n1. Fault Isolation: If a cable breaks or a computer fails, only that single device goes offline; the rest of the network remains 100% operational.\n2. Easy Expansion: Adding new computers requires only plugging a cable into an open switch port without interrupting ongoing traffic.\n3. Security & Full Duplex: Modern switches isolate traffic, preventing workstations from sniffing other computers\' packets.'
      },
      {
        id: 'cn-1-q5',
        question: 'What causes Queuing Delay and Packet Loss in internet routers?',
        companyTags: ['Amazon', 'Uber'],
        frequency: 'High',
        answer: 'Queuing delay occurs when packets arrive at a router\'s input interface faster than the output transmission link can serialize them. Packets accumulate in the router\'s finite hardware buffer (queue).\n\nIf traffic bursts persist and the router\'s buffer memory fills up completely (buffer overflow), incoming packets are discarded—this is Packet Loss (Drop). Protocols like TCP detect packet loss and throttle their sending rate.'
      }
    ],
    flashcards: [
      {
        id: 'cn-1-fc1',
        front: 'What is the formula for Transmission Delay vs Propagation Delay?',
        back: 'Transmission Delay = L / R (Packet length / Bandwidth); Propagation Delay = d / s (Distance / Signal speed).',
        keyTakeaway: 'Transmission depends on link speed; Propagation depends on physical distance.'
      },
      {
        id: 'cn-1-fc2',
        front: 'What does the Bandwidth-Delay Product (BDP) measure?',
        back: 'The maximum amount of unacknowledged data in transit on the physical link at any instant (BDP = Bandwidth x RTT).',
        keyTakeaway: 'BDP represents the data volume of the network pipe.'
      },
      {
        id: 'cn-1-fc3',
        front: 'What is Statistical Multiplexing in packet switching?',
        back: 'Dynamically allocating transmission link bandwidth on-demand among active users rather than reserving static circuits.',
        keyTakeaway: 'Statistical multiplexing enables efficient sharing of bursty internet traffic.'
      },
      {
        id: 'cn-1-fc4',
        front: 'What happens when router buffer memory overflows?',
        back: 'Incoming packets are dropped, resulting in Packet Loss that triggers TCP retransmissions.',
        keyTakeaway: 'Buffer overflow is the primary cause of packet loss on the Internet.'
      },
      {
        id: 'cn-1-fc5',
        front: 'Why does Star Topology prevent entire network outages during single cable breaks?',
        back: 'Each device has a dedicated point-to-point link to a central switch; individual cable cuts isolate only that single device.',
        keyTakeaway: 'Star topologies isolate hardware failures to individual endpoints.'
      }
    ]
  },
  {
    id: 'cn-2',
    subjectId: 'cn',
    order: 2,
    title: 'OSI 7-Layer Reference Model vs TCP/IP Protocol Suite',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine sending an international gift parcel to a friend in Tokyo. You write a letter (Application Layer). A translator translates the letter into Japanese (Presentation Layer). An assistant logs the tracking ID in an office ledger (Session Layer). A packing specialist packs the letter into a standardized sturdy cardboard box with port numbers (Transport Layer). The courier dispatcher slaps on destination city and postal codes (Network Layer). The delivery truck driver adds a local route manifest tag with truck vehicle IDs (Data Link Layer). The truck drives along physical asphalt roads (Physical Layer). Each layer wraps the parcel in its own protective packaging without caring what is written inside the letter.',
    what: 'Network architectures organize complex communication protocols into modular, hierarchical layers. Each layer provides a defined set of services to the layer above it, while hiding the implementation details of the layers below it.\n\nThe International Organization for Standardization (ISO) developed the theoretical OSI 7-Layer Reference Model:\n• Layer 7 - Application: User-facing interface (HTTP, DNS, SSH, SMTP).\n• Layer 6 - Presentation: Data formatting, encryption/decryption, and compression (JSON, TLS/SSL, ASCII, JPEG).\n• Layer 5 - Session: Managing, maintaining, and synchronizing long-lived communication dialogs (RPC, NetBIOS).\n• Layer 4 - Transport: End-to-end process-to-process delivery, flow control, and error recovery (TCP, UDP).\n• Layer 3 - Network: Host-to-host routing and logical addressing across multiple networks (IPv4, IPv6, ICMP).\n• Layer 2 - Data Link: Hop-to-hop framing and physical addressing on local broadcast domains (Ethernet, Wi-Fi, MAC, ARP).\n• Layer 1 - Physical: Transmission of raw, unformatted bitstreams over physical electrical cables, radio frequencies, or fiber optics.\n\nIn real-world engineering, the practical TCP/IP Protocol Suite (the Internet Protocol Suite) condensed this into 4 (or 5) layers by merging Application, Presentation, and Session into a unified Application Layer. As data moves down the stack at the sending host, each layer prepends a protocol header—a process called Encapsulation. When the receiving host gets the packet, each layer strips its header—a process called Decapsulation.',
    why: 'Modular layering is the architectural foundation of the Internet. Without modular abstraction, software developers would have to write custom web browsers for every specific network card, Wi-Fi chip, or Ethernet cable manufacturer.\n\nBecause of strict layer boundaries, technological evolution happens independently at each layer: upgrading your local home network from Wi-Fi 5 to Wi-Fi 6 (Data Link / Physical layers) requires zero changes to your computer\'s IP address (Network layer) and requires zero code updates to YouTube or Spotify (Application layer).',
    useCase: 'Network engineers and developers use protocol analyzers like Wireshark daily for production troubleshooting. When inspecting a captured network packet, Wireshark breaks down the packet by exact layer boundaries: Frame Header (Ethernet MAC addresses) $\\rightarrow$ IP Header (Source & Destination IP addresses) $\\rightarrow$ TCP Segment Header (Source & Destination Ports, SEQ/ACK numbers) $\\rightarrow$ Application Payload (HTTP GET request or JSON payload).\n\nSimilarly, network firewalls operate at different layer levels: Layer 3/4 firewalls filter packets by IP address and TCP port, while Layer 7 Web Application Firewalls (WAFs) inspect application payloads to block SQL injection and cross-site scripting attacks.',
    example: `+-----------------------------------------------------------------------------+
|              OSI vs TCP/IP MAPPING & PROTOCOL ENCAPSULATION                 |
+-----------------------------------------------------------------------------+

   OSI 7-LAYER MODEL           TCP/IP 5-LAYER STACK        PROTOCOL DATA UNIT (PDU)
 +--------------------+       +--------------------+       
 | 7. Application     | ----> |                    |       [ Application Data ]
 | 6. Presentation    | ----> | 5. Application     |       e.g. HTTP GET /index.html
 | 5. Session         | ----> |                    |       
 +--------------------+       +--------------------+       
 | 4. Transport       | ----> | 4. Transport (TCP) |       [ TCP Header ][ Data ]
 |                    |       |                    |       PDU: SEGMENT (Adds Ports)
 +--------------------+       +--------------------+       
 | 3. Network         | ----> | 3. Network (IP)    |       [ IP Hdr ][ TCP Hdr ][ Data ]
 |                    |       |                    |       PDU: PACKET (Adds IPs)
 +--------------------+       +--------------------+       
 | 2. Data Link       | ----> | 2. Data Link (Eth) |  +--  [ Eth Hdr ][ IP ][ TCP ][ Data ][ FCS ]
 |                    |       |                    |  |    PDU: FRAME (Adds MACs & CRC)
 +--------------------+       +--------------------+  |    
 | 1. Physical        | ----> | 1. Physical        |  v    01101001 01101110 01110100...
 +--------------------+       +--------------------+       PDU: BITS (Voltages / Light)`,
    exampleExplanation: [
      'Application Layer (PDU: Data): The browser creates the raw HTTP application request: `GET /index.html`.',
      'Transport Layer (PDU: Segment): TCP wraps the data with a 20-byte TCP header containing Source Port (e.g. 54321) and Destination Port (80) for process-to-process addressing.',
      'Network Layer (PDU: Packet): IP wraps the segment with a 20-byte IPv4 header containing Source IP and Destination IP for host-to-host global routing.',
      'Data Link Layer (PDU: Frame): Ethernet wraps the packet with a 14-byte frame header (Source & Destination MAC addresses) and a 4-byte Frame Check Sequence (FCS/CRC) trailer.',
      'Physical Layer (PDU: Bits): The network interface card encodes the complete frame into electrical voltages or laser light pulses transmitted across the physical medium.'
    ],
    interviewQuestions: [
      {
        id: 'cn-2-q1',
        question: 'What are the Protocol Data Unit (PDU) names at each layer of the TCP/IP stack?',
        companyTags: ['Cisco', 'Juniper', 'TCS'],
        frequency: 'Very High',
        answer: 'The official PDU names are:\n• Application Layer: Data or Message\n• Transport Layer: Segment (for TCP) or Datagram (for UDP)\n• Network Layer: Packet (or IP Datagram)\n• Data Link Layer: Frame\n• Physical Layer: Bits or Symbols'
      },
      {
        id: 'cn-2-q2',
        question: 'What is the exact difference between the Network Layer and the Transport Layer?',
        companyTags: ['Amazon', 'Google', 'Infosys'],
        frequency: 'Very High',
        answer: '• Network Layer: Provides Host-to-Host communication. It is responsible for routing packets from a source computer to a destination computer across global networks using IP addresses. It does not know which specific application program is running on that machine.\n• Transport Layer: Provides Process-to-Process (Port-to-Port) communication. It uses Port Numbers to deliver data to the exact application software (e.g. web server on port 443, SSH on port 22), while providing end-to-end reliability and flow control.'
      },
      {
        id: 'cn-2-q3',
        question: 'What are the functions of the Presentation and Session layers in the OSI model, and how are they handled in TCP/IP?',
        companyTags: ['Microsoft', 'Oracle', 'Cognizant'],
        frequency: 'High',
        answer: '• Presentation Layer: Data representation, translation (ASCII to EBCDIC), compression, and encryption/decryption (TLS/SSL).\n• Session Layer: Establishing, managing, and synchronizing communication sessions, checkpoints, and authentication dialogs.\n• In TCP/IP: These layers are not independent operating system layers; their functions are integrated directly into Application Layer protocols and libraries (e.g. OpenSSL handles encryption directly inside web applications).'
      },
      {
        id: 'cn-2-q4',
        question: 'Explain Protocol Encapsulation and Decapsulation.',
        companyTags: ['Apple', 'Qualcomm', 'Wipro'],
        frequency: 'High',
        answer: '• Encapsulation: The process at the sending host where each layer takes the PDU from the layer above, treats it as opaque data payload, and prepends its own protocol header (and sometimes a trailer) before passing it down the stack.\n• Decapsulation: The reverse process at the receiving host where each layer strips and processes its corresponding header, validates integrity, and passes the remaining payload up to the next layer.'
      },
      {
        id: 'cn-2-q5',
        question: 'At which layers do Hubs, Switches, and Routers operate?',
        companyTags: ['Cisco', 'Amazon', 'TCS'],
        frequency: 'Very High',
        answer: '• Hub (Legacy): Operates at Layer 1 (Physical). It is a dumb repeater that broadcasts incoming electrical bits out all other ports.\n• Switch: Operates at Layer 2 (Data Link). It inspects MAC addresses to forward frames specifically to the destination port, maintaining a MAC address learning table.\n• Router: Operates at Layer 3 (Network). It inspects IP addresses to route packets across different logical networks and subnets.'
      }
    ],
    flashcards: [
      {
        id: 'cn-2-fc1',
        front: 'What are the 7 layers of the OSI model from bottom to top?',
        back: '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application.',
        keyTakeaway: 'Mnemonic: "Please Do Not Throw Sausage Pizza Away".'
      },
      {
        id: 'cn-2-fc2',
        front: 'What is the PDU of the Transport Layer vs Network Layer?',
        back: 'Transport Layer PDU is a Segment (or Datagram); Network Layer PDU is a Packet.',
        keyTakeaway: 'Segments contain ports; Packets contain IP addresses.'
      },
      {
        id: 'cn-2-fc3',
        front: 'What addressing is used at the Data Link Layer vs Network Layer?',
        back: 'Data Link uses physical MAC addresses (48-bit); Network uses logical IP addresses (32-bit IPv4 / 128-bit IPv6).',
        keyTakeaway: 'MAC addresses operate within local LANs; IP addresses route globally.'
      },
      {
        id: 'cn-2-fc4',
        front: 'What is Protocol Encapsulation?',
        back: 'Wrapping higher-layer data with headers (and trailers) as it travels down the protocol stack.',
        keyTakeaway: 'Encapsulation adds metadata at each layer of transmission.'
      },
      {
        id: 'cn-2-fc5',
        front: 'Why did the practical TCP/IP model merge OSI layers 5, 6, and 7?',
        back: 'Session, presentation, and application functions are most cleanly handled directly by application software and user libraries.',
        keyTakeaway: 'TCP/IP combines presentation and session into the application layer.'
      }
    ]
  },
  {
    id: 'cn-3',
    subjectId: 'cn',
    order: 3,
    title: 'Data Link Layer: Framing, Flow Control & Error Detection (CRC)',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine shipping fragile glassware inside a wooden shipping crate. Framing is putting the glassware into a crate with clearly painted neon red boundary lines marked "[START OF CRATE]" and "[END OF CRATE]" so workers know where one crate ends and the next begins. If the glassware itself happens to have the words "[END OF CRATE]" printed on its logo, the worker puts a special sticker over it (Bit Stuffing) so freight handlers don\'t prematurely close the crate. Before nailing the lid shut, the supervisor weighs the crate, calculates a mathematical tamper-evident checksum seal, and prints it on the outside (CRC). When the crate arrives at its destination, the receiver re-calculates the checksum: if the numbers don\'t match exactly, the crate was damaged during transit and is discarded.',
    what: 'The Data Link Layer (Layer 2) is responsible for node-to-node (hop-to-hop) data transfer across a single physical link connecting two directly adjacent devices on a local network. Its core functions include Framing, Physical Addressing (MAC addresses), Flow Control, and Error Detection.\n\nFraming packages network-layer IP packets into manageable units called Frames by demarcating frame boundaries. Methods include Byte/Character Stuffing (inserting an escape character `ESC` before any accidental occurrence of flag bytes like `0x7E`) and Bit Stuffing (in protocols like HDLC, a flag byte is `01111110`; whenever the sender encounters five consecutive `1`s in user data, it automatically injects a `0` bit, which the receiver strips).\n\nBecause physical transmission links suffer from electromagnetic interference, electrical noise, and thermal jitter, bits can flip from 0 to 1 or 1 to 0 during transmission. The data link layer detects these errors using mathematical error-detection codes:\n• Parity Check (Single-bit or 2D parity, detects odd numbers of bit errors).\n• Checksum (used in IP and TCP, adds 16-bit words using 1\'s complement arithmetic).\n• Cyclic Redundancy Check (CRC): The most powerful error-detection technique, used universally in Ethernet, Wi-Fi, and storage media. The sender treats data bits as coefficients of a polynomial $D(x)$, divides it modulo-2 by an agreed generator polynomial $G(x)$, and appends the calculated remainder (the Frame Check Sequence - FCS) to the frame. The receiver divides the entire incoming frame by $G(x)$; if the remainder is non-zero, a transmission bit error is guaranteed to have occurred and the frame is silently discarded.',
    why: 'If networks allowed corrupted frames to propagate up to higher layers, operating systems and application programs would waste massive CPU and memory resources attempting to parse corrupted payloads, or worse, execute corrupted machine instructions.\n\nPerforming hardware CRC checks directly in the network card ASIC (NIC) allows invalid frames to be detected and dropped at wire speed (100 Gbps) in nanoseconds, shielding the computer\'s CPU from corrupted traffic.',
    useCase: 'Every single standard Ethernet cable and Wi-Fi transmission uses CRC-32 (a 32-bit generator polynomial, `0x04C11DB7`). When your Wi-Fi router transmits a frame to your laptop, interference from a microwave oven or wall can corrupt a few bits.\n\nThe Wi-Fi network card hardware computes the CRC-32 checksum upon receiving the frame: if a bit error is detected, the frame is dropped immediately without bothering the operating system kernel, and the data link ARQ layer requests an immediate Wi-Fi hardware retransmission.',
    example: `+-----------------------------------------------------------------------------+
|              ETHERNET FRAME STRUCTURE & CRC-32 ERROR DETECTION              |
+-----------------------------------------------------------------------------+

  0       7 8      13 14     19 20    21 22                       N  N+1     N+4
 +---------+---------+---------+--------+--------------------------+---------+
 | Preamble| Dest MAC| Src MAC |EtherTyp| IP Packet Payload        | Frame   |
 | & SFD   | Address | Address | (IPv4) | (46 to 1500 bytes)       | Check   |
 | (8 B)   | (6 B)   | (6 B)   | (2 B)  | Minimum Frame = 64 bytes | (CRC-32)|
 +---------+---------+---------+--------+--------------------------+---------+
                                                                        ^
                                                                        |
                       CYCLIC REDUNDANCY CHECK (CRC-32) MATHEMATICS:   |
                                                                        |
  [ Sender Side ]:                                                      |
    1. Data D(x) padded with 32 zeros: D(x) * 2^32                      |
    2. Divide padded data by Generator Polynomial G(x) using Modulo-2   |
       arithmetic (Bitwise XOR, no carries or borrows).                 |
    3. Remainder R(x) is the 32-bit Frame Check Sequence (FCS) ---------+
    4. Transmitted Frame = [ Data Payload ] + [ FCS Remainder ]

  [ Receiver Side ]:
    1. Receiver receives complete frame: [ Data ] + [ FCS ]
    2. Divides the entire frame by the exact same Generator G(x).
    3. If Remainder == 0: Frame is 100% VALID! Accepted.
    4. If Remainder != 0: Bit corruption detected! Frame silently DROPPED.`,
    exampleExplanation: [
      'Preamble & SFD (8 bytes): Alternating 10101010 pattern ending in 10101011 (Start Frame Delimiter) to synchronize receiver hardware clocks.',
      'MAC Addresses (6 bytes each): Destination and Source hardware addresses identifying local network cards.',
      'EtherType (2 bytes): Identifies the higher-layer protocol (e.g. `0x0800` for IPv4, `0x86DD` for IPv6).',
      'Payload (46 to 1500 bytes): The actual IP packet. If payload is less than 46 bytes, padding bytes are added to meet the minimum Ethernet frame size of 64 bytes.',
      'FCS / CRC-32 (4 bytes): The cyclic redundancy checksum remainder computed via modulo-2 binary polynomial division.',
      'Zero Remainder: At the receiver, dividing the entire received frame (data + FCS) by G(x) yields exactly zero if zero transmission bit flips occurred.'
    ],
    interviewQuestions: [
      {
        id: 'cn-3-q1',
        question: 'How does Cyclic Redundancy Check (CRC) detect transmission errors, and why is it superior to simple checksums?',
        companyTags: ['Cisco', 'Qualcomm', 'Amazon'],
        frequency: 'Very High',
        answer: 'CRC treats a bitstream as a binary polynomial $D(x)$ and divides it modulo-2 (using bitwise XOR) by a predefined generator polynomial $G(x)$. The remainder $R(x)$ is appended to the frame as the Frame Check Sequence (FCS).\n\nWhy Superior: Simple additive checksums fail to detect transposed bytes, swapped bits, or even numbers of bit inversions that sum to the same value. CRC-32 mathematically guarantees detection of all single-bit errors, all double-bit errors, any odd number of bit errors, and all burst errors up to 32 bits long.'
      },
      {
        id: 'cn-3-q2',
        question: 'What is Bit Stuffing, and why is it required in data link framing?',
        companyTags: ['Google', 'TCS', 'Infosys'],
        frequency: 'High',
        answer: 'In bit-oriented protocols (like HDLC), frames are bounded by a special flag sequence `01111110` (six consecutive 1s). If the user\'s data payload naturally contains `01111110`, the receiver would mistake it for the end of the frame.\n\nBit Stuffing Solution: The sender monitors the payload: whenever it sees five consecutive 1s (`11111`), it automatically stuffs a `0` bit immediately after. The receiver monitors the stream: after five 1s, if the next bit is `0`, it strips it; if the next bits are `10`, it recognizes the official frame boundary.'
      },
      {
        id: 'cn-3-q3',
        question: 'Why does Ethernet enforce a Minimum Frame Size of 64 bytes?',
        companyTags: ['Cisco', 'Broadcom', 'Apple'],
        frequency: 'High',
        answer: 'To guarantee Collision Detection in classic CSMA/CD. For a sender to reliably detect if another computer collided with its transmission, the sender must still be actively transmitting bits when the collision signal propagates back from the furthest cable end.\n\nFormula: Transmission time must be at least twice the propagation delay ($T_{\\\\text{trans}} \\\\ge 2 \\\\times T_{\\\\text{prop}}$). For a 10 Mbps network on a 2.5 km coaxial cable segment, the round-trip slot time is 51.2 microseconds, which requires a minimum of 512 bits (64 bytes).'
      },
      {
        id: 'cn-3-q4',
        question: 'What is the difference between Error Detection and Error Correction (e.g. Hamming Code)?',
        companyTags: ['Intel', 'Qualcomm', 'Wipro'],
        frequency: 'High',
        answer: '• Error Detection (e.g. CRC, Parity): Adds minimal redundant bits (FCS). Can determine whether bits were corrupted, but cannot pinpoint which bits flipped. The receiver must drop the frame and rely on retransmission (ARQ).\n• Error Correction (e.g. Hamming Codes, Reed-Solomon): Adds sufficient mathematical redundancy (Forward Error Correction - FEC) allowing the receiver to both detect AND reconstruct the original correct bits without requesting retransmission. Essential for deep-space and high-loss satellite links.'
      },
      {
        id: 'cn-3-q5',
        question: 'What is a MAC Address, and how is it structured?',
        companyTags: ['Amazon', 'Cisco', 'Cognizant'],
        frequency: 'Medium',
        answer: 'A MAC (Media Access Control) address is a globally unique 48-bit (6-byte) physical hardware address permanently burned into a Network Interface Card (NIC). Format: `00:1A:2B:3C:4D:5E`.\n\nStructure:\n• First 24 bits (3 bytes): Organizationally Unique Identifier (OUI), assigned by the IEEE to the manufacturer (e.g. Intel, Apple, Cisco).\n• Last 24 bits (3 bytes): Network Interface Controller specific identifier assigned uniquely by the vendor.'
      }
    ],
    flashcards: [
      {
        id: 'cn-3-fc1',
        front: 'What mathematical operation is used in CRC division?',
        back: 'Modulo-2 arithmetic, implemented in hardware using simple bitwise XOR (without carries or borrows).',
        keyTakeaway: 'Modulo-2 division uses XOR operations for ultra-fast hardware computation.'
      },
      {
        id: 'cn-3-fc2',
        front: 'What is the minimum frame size for standard Ethernet, and why?',
        back: '64 bytes; to guarantee that a transmitting station detects collisions before finishing transmission in CSMA/CD.',
        keyTakeaway: 'Minimum frame size ensures collision detection over maximum cable lengths.'
      },
      {
        id: 'cn-3-fc3',
        front: 'How does Bit Stuffing work in HDLC framing?',
        back: 'The sender automatically inserts a 0 after every five consecutive 1s to prevent false flag delimiter matches.',
        keyTakeaway: 'Bit stuffing ensures transparency of arbitrary binary payloads.'
      },
      {
        id: 'cn-3-fc4',
        front: 'How long is a standard MAC address in bytes and bits?',
        back: '6 bytes (48 bits), formatted as 12 hexadecimal characters (e.g. AA:BB:CC:DD:EE:FF).',
        keyTakeaway: '48-bit MAC addresses uniquely identify hardware on local networks.'
      },
      {
        id: 'cn-3-fc5',
        front: 'What is the difference between Error Detection and Forward Error Correction (FEC)?',
        back: 'Detection identifies corrupted frames and drops them; FEC adds enough redundancy to reconstruct flipped bits without retransmission.',
        keyTakeaway: 'FEC corrects bit errors on-the-fly; CRC detects errors for retransmission.'
      }
    ]
  },
  {
    id: 'cn-4',
    subjectId: 'cn',
    order: 4,
    title: 'MAC Protocols, CSMA/CD & Local Area Networks (LAN)',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine an open classroom discussion where 30 students share one microphone. Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is like a polite classroom rule: 1. Listen before speaking (Carrier Sense): if someone is already talking, wait. 2. If the room is quiet, begin speaking (Multiple Access). 3. While speaking, continue listening: if another student starts speaking at the exact same instant, both voices garble (Collision Detection). 4. Both students immediately stop, shout "Collision!" so the whole room knows (Jamming Signal), pick a random lottery number between 1 and 10 in their head (Binary Exponential Backoff), and wait that many seconds before trying to speak again. Because they picked random wait times, they won\'t collide a second time.',
    what: 'Medium Access Control (MAC) protocols coordinate access to a shared physical transmission medium in Local Area Networks (LANs) to prevent conflicting transmissions from corrupting each other. MAC protocols fall into three broad categories: Channel Partitioning (TDMA, FDMA, CDMA), Controlled Access (Polling, Token Ring), and Random Access (ALOHA, CSMA).\n\nIn Random Access protocols, nodes transmit at full channel rate without central coordination. Evolution of random access:\n• Pure ALOHA: Transmit immediately whenever data arrives. Vulnerable to collisions throughout a $2 \\times T_{\\text{frame}}$ vulnerable window; maximum channel efficiency is only 18.4%.\n• Slotted ALOHA: Time is divided into discrete slots; nodes transmit only at slot boundaries, cutting the collision window in half and doubling efficiency to 36.8%.\n• CSMA (Carrier Sense Multiple Access): "Listen Before Talk". A node senses the channel: if idle, transmit; if busy, defer.\n• CSMA/CD (Collision Detection): Used in legacy half-duplex Ethernet (IEEE 802.3). The node continues listening while transmitting. If two nodes transmit simultaneously, a collision occurs. Both nodes immediately abort transmission, emit a 32-bit Jamming Signal to alert all nodes, and execute the Binary Exponential Backoff Algorithm.\n• Binary Exponential Backoff: After the $k$-th collision, the node randomly chooses a backoff multiplier $r$ from $\\{0, 1, 2, \\dots, 2^k - 1\\}$ (capped at $k=10$, max 1023) and waits $r \\times 512$ bit times before retrying. After 16 consecutive collisions, the transmission is aborted.\n\nIn wireless networks (Wi-Fi / IEEE 802.11), physical radio transceivers cannot transmit and listen at the same time on the same frequency (the outgoing signal overwhelms the receiver), making collision detection impossible. Wi-Fi instead uses CSMA/CA (Collision Avoidance) with explicit RTS/CTS (Request to Send / Clear to Send) handshake frames to eliminate the Hidden Terminal Problem.',
    why: 'Without MAC protocols and collision resolution, multiple computers connected to shared media (coaxial bus Ethernet or open radio frequencies) would transmit simultaneously, corrupting 100% of data packets and reducing network throughput to zero.\n\nWhile modern wired Ethernet uses full-duplex twisted-pair switches (eliminating collisions entirely), the principles of CSMA, exponential backoff, and collision avoidance remain critical for Wi-Fi, 5G cellular random-access channels, and satellite communications.',
    useCase: 'Modern Wi-Fi 6 (802.11ax) routers in dense coffee shops or airport terminals manage hundreds of competing smartphones using CSMA/CA and OFDMA. When your laptop wants to upload a file over Wi-Fi, it listens for radio carrier energy, waits for a Distributed Inter-Frame Space (DIFS), and executes an exponential backoff countdown before transmitting.\n\nIf two laptops are on opposite ends of the room and cannot hear each other (the Hidden Terminal Problem), they both use RTS/CTS frames with the central access point to reserve the airwaves, preventing destructive collisions.',
    example: `+-----------------------------------------------------------------------------+
|               CSMA/CD TRANSMISSION & COLLISION TIMELINE                     |
+-----------------------------------------------------------------------------+

 [ Host A ]                                                       [ Host B ]
     |                                                                |
     | 1. Senses Channel: IDLE                                        |
     |    Starts Transmitting Frame Data ===>                         | 1. Senses Channel: IDLE
     |                                          <=== Starts Transmitting Frame
     |                                                                |
     |                     COLLISION OCCURS IN THE MIDDLE             |
     |                                    X                           |
     |                             (Signals overlap)                  |
     |                                                                |
     |<=== Collision wave reaches A               Collision reaches B ===>
     |                                                                |
     | 2. COLLISION DETECTED!                     2. COLLISION DETECTED!
     |    Abort transmission immediately               Abort transmission
     |    Broadcast 32-bit JAMMING SIGNAL              Broadcast JAMMING SIGNAL
     |                                                                |
     | 3. BINARY EXPONENTIAL BACKOFF:             3. BINARY EXPONENTIAL BACKOFF:
     |    Collision count k = 1                        Collision count k = 1
     |    Choose r in {0, 1}                           Choose r in {0, 1}
     |    Suppose Host A picks r = 0                   Suppose Host B picks r = 1
     |    Wait 0 * 512 bit times                       Wait 1 * 512 bit times
     |                                                                |
     | 4. Host A retries immediately & succeeds!                      |
     |    ==========================================================> |
     |                                                 Host B waits...|`,
    exampleExplanation: [
      'Carrier Sense: Both hosts listen to the wire. Because of propagation delay, Host B senses the wire as idle before Host A\'s signal arrives, and begins transmitting.',
      'Collision: The electrical signals overlap on the physical cable, causing voltage spikes above normal thresholds.',
      'Collision Detection: Both network cards detect the voltage spike and immediately cease transmitting user data.',
      'Jamming Signal: Both hosts emit a 32-bit jamming pattern to ensure every station on the cable recognizes the collision.',
      'Exponential Backoff: Host A randomly chooses wait multiplier 0; Host B randomly chooses 1. Host A transmits successfully while Host B waits, resolving the contention smoothly.'
    ],
    interviewQuestions: [
      {
        id: 'cn-4-q1',
        question: 'Explain the working of CSMA/CD and the Binary Exponential Backoff algorithm.',
        companyTags: ['Cisco', 'Broadcom', 'Amazon'],
        frequency: 'Very High',
        answer: 'CSMA/CD (Carrier Sense Multiple Access with Collision Detection):\n1. Carrier Sense: Listen to channel. If busy, defer; if idle, transmit.\n2. Collision Detection: Listen while transmitting. If a collision is detected, stop immediately and transmit a 32-bit Jamming Signal.\n3. Binary Exponential Backoff: After $k$ collisions ($k \\le 10$), choose random integer $r$ from range $[0, 2^k - 1]$. Wait $r \\times 512$ bit times before retrying. If collisions reach 16, abort and report network failure.'
      },
      {
        id: 'cn-4-q2',
        question: 'Why does Wi-Fi (802.11) use CSMA/CA instead of CSMA/CD?',
        companyTags: ['Qualcomm', 'Apple', 'Intel'],
        frequency: 'Very High',
        answer: 'Wi-Fi cannot use CSMA/CD for two fundamental physical reasons:\n1. Hardware Inability: The strength of a wireless transmitter\'s own signal is millions of times stronger than any incoming signal from another node. A radio cannot listen for weak collision signals while actively blasting high-power RF transmissions on the same frequency.\n2. Hidden Terminal Problem: Two stations separated by distance or a wall might not hear each other, but both reach the central access point simultaneously. CSMA/CA uses Collision Avoidance (waiting IFS intervals, random backoff before transmitting, and optional RTS/CTS handshakes).'
      },
      {
        id: 'cn-4-q3',
        question: 'What is the Hidden Terminal Problem in wireless networks, and how does RTS/CTS solve it?',
        companyTags: ['Google', 'Cisco', 'Uber'],
        frequency: 'High',
        answer: 'The Hidden Terminal Problem occurs when Station A and Station C are both within range of Access Point B, but cannot hear each other due to distance or physical obstacles. If both sense the channel, both falsely conclude the airwaves are idle and transmit simultaneously, colliding at B.\n\nRTS/CTS Solution:\n1. Station A sends a small "Request to Send" (RTS) frame to B.\n2. B broadcasts a "Clear to Send" (CTS) frame containing the reserved duration.\n3. Station C hears the CTS broadcast from B and silences its transmitter for that duration, allowing Station A to transmit data without collision.'
      },
      {
        id: 'cn-4-q4',
        question: 'Why do modern wired Ethernet switches eliminate collisions entirely?',
        companyTags: ['Amazon', 'Juniper', 'TCS'],
        frequency: 'High',
        answer: 'Legacy Ethernet used shared coaxial bus cables or dumb hubs operating in Half-Duplex (shared collision domain). Modern Ethernet switches provide dedicated point-to-point twisted-pair or fiber links to each device operating in Full-Duplex mode: separate physical wire pairs are used for transmitting (TX) and receiving (RX).\n\nBecause transmission and reception occur on physically independent electrical channels, packet collisions are physically impossible, making CSMA/CD obsolete on modern switched Ethernet.'
      },
      {
        id: 'cn-4-q5',
        question: 'What is the Address Resolution Protocol (ARP), and how does an ARP cache work?',
        companyTags: ['Microsoft', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: 'ARP resolves a known Layer 3 logical IP address (e.g. `192.168.1.5`) to its physical Layer 2 MAC address on the local LAN.\n\nWorking:\n1. Host A broadcasts an ARP Request: "Who has IP 192.168.1.5? Tell 192.168.1.1". (Sent to broadcast MAC `FF:FF:FF:FF:FF:FF`).\n2. The owner host sends a unicast ARP Reply containing its physical MAC address.\n3. Host A stores the mapping in its local in-memory ARP Cache for a few minutes to avoid broadcast overhead on subsequent packets.'
      }
    ],
    flashcards: [
      {
        id: 'cn-4-fc1',
        front: 'What does CSMA/CD stand for, and what does it do?',
        back: 'Carrier Sense Multiple Access with Collision Detection; listens before transmitting and aborts immediately upon collision.',
        keyTakeaway: 'CSMA/CD detects collisions on shared wired media.'
      },
      {
        id: 'cn-4-fc2',
        front: 'What is the formula for random wait time in Binary Exponential Backoff?',
        back: 'Wait r x 512 bit times, where r is a random integer in {0, 1, ..., 2^k - 1} after k collisions.',
        keyTakeaway: 'Backoff range doubles with each successive collision.'
      },
      {
        id: 'cn-4-fc3',
        front: 'Why can\'t wireless networks (Wi-Fi) detect collisions while transmitting?',
        back: 'Transmitted RF signal strength overwhelms incoming radio signals, blinding the receiver during transmission.',
        keyTakeaway: 'Wi-Fi must use Collision Avoidance (CSMA/CA) instead of detection.'
      },
      {
        id: 'cn-4-fc4',
        front: 'How does RTS/CTS resolve the Hidden Terminal Problem in Wi-Fi?',
        back: 'The Access Point broadcasts a CTS frame that reserves the airwaves, warning hidden stations to remain silent.',
        keyTakeaway: 'CTS broadcasts silence hidden nodes.'
      },
      {
        id: 'cn-4-fc5',
        front: 'Does modern switched Ethernet require CSMA/CD?',
        back: 'No; modern switches use full-duplex dedicated links with separate TX and RX lines, eliminating collisions.',
        keyTakeaway: 'Full-duplex switching eliminates collision domains.'
      }
    ]
  },
  {
    id: 'cn-5',
    subjectId: 'cn',
    order: 5,
    title: 'Network Layer: IPv4/IPv6 Addressing & Subnetting (CIDR)',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Think of global postal addresses. An IP address is like the structured postal destination: Country $\\rightarrow$ State $\\rightarrow$ City $\\rightarrow$ Street $\\rightarrow$ House Number. If every letter in the world had to list every single building individually in one giant flat phonebook, post offices would collapse. Subnetting is like grouping houses into Postal Zip Codes: all mail destined for zip code `94103` is loaded onto one cargo flight to San Francisco; global transit planes don\'t care who lives at 123 Main St until the mail arrives at the local San Francisco neighborhood post office. Classless Inter-Domain Routing (CIDR) allows postal districts to carve up boundaries flexibly based on population size.',
    what: 'The Network Layer (Layer 3) is responsible for host-to-host packet routing across the global Internet. Every device connected to the Internet must have a logical IP Address to enable packet delivery.\n\nIPv4 uses 32-bit addresses written in dotted-decimal notation (e.g. `192.168.1.1`), providing a theoretical maximum of $2^{32} \\approx 4.29$ billion addresses. An IPv4 address consists of two parts: a Network ID (identifying the subnet) and a Host ID (identifying the specific device on that subnet).\n\nHistorically, IPv4 was split into rigid Classes: Class A (`/8`), Class B (`/16`), and Class C (`/24`), which caused massive address wastage (a company needing 300 IP addresses was forced to buy a Class B license with 65,534 addresses, wasting 65,200 IPs). In 1993, Classless Inter-Domain Routing (CIDR) replaced classful addressing. In CIDR notation (`192.168.1.0/26`), the slash number indicates the Subnet Mask—the number of leading bits representing the network prefix. A `/26` subnet allocates 26 bits for the network and leaves $32 - 26 = 6$ bits for hosts, supporting $2^6 - 2 = 62$ usable host addresses (subtracting the Network Address and Broadcast Address).\n\nBecause IPv4 addresses were completely exhausted globally, the IETF created IPv6: a 128-bit address architecture formatted as eight groups of four hexadecimal digits (e.g. `2001:0db8:85a3::8a2e:0370:7334`). IPv6 provides $2^{128} \\approx 3.4 \\times 10^{38}$ addresses—enough to assign millions of unique IP addresses to every grain of sand on Earth—eliminating the need for Network Address Translation (NAT) and broadcast packets.',
    why: 'Hierarchical IP addressing and CIDR aggregation are what make the global Internet scalable. Without subnet aggregation, global core routers would need to store entries for all 4 billion connected computers in their routing tables, causing memory collapse and routing paralysis.\n\nWith CIDR route summarization, a major Internet Service Provider (ISP) advertises a single aggregated prefix (like `203.0.113.0/20`) to the rest of the world, hiding thousands of individual company subnets behind a single routing table entry.',
    useCase: 'Network engineers designing cloud Virtual Private Clouds (VPCs) in AWS, Azure, or Google Cloud configure CIDR blocks daily. A typical production VPC allocates a `/16` block (`10.0.0.0/16`, 65,536 IPs) and carves it into private and public subnets:\n• Public Subnets (`10.0.1.0/24`, `10.0.2.0/24`) for internet-facing application load balancers.\n• Private Subnets (`10.0.10.0/24`, `10.0.11.0/24`) for backend microservices and databases with zero public internet routing.\n\nHome Wi-Fi routers use Network Address Translation (NAT): the router receives one public IPv4 address from your ISP, and assigns private IPv4 addresses (`192.168.1.x`) to all your home laptops and smartphones, mapping multiple private connections to a single public IP via port multiplexing (NAPT).',
    example: `+-----------------------------------------------------------------------------+
|              IPv4 DATAGRAM 32-BIT HEADER STRUCTURE (RFC 791)                |
+-----------------------------------------------------------------------------+

 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|      Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |        Header Checksum        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source IP Address                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination IP Address                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options (if IHL > 5)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

===============================================================================
CIDR SUBNETTING EXAMPLE: 192.168.10.0/26
  - Subnet Mask:  255.255.255.192  (26 ones, 6 zeros)
  - Total Hosts:  2^(32 - 26) = 2^6 = 64 IP addresses
  - Usable Hosts: 64 - 2 = 62 usable host addresses
  - Network ID:   192.168.10.0   (All host bits 0)
  - Broadcast IP: 192.168.10.63  (All host bits 1)
  - Host Range:   192.168.10.1 through 192.168.10.62`,
    exampleExplanation: [
      'Version (4 bits) & IHL (4 bits): Version 4; Internet Header Length specifies header size in 32-bit words (standard minimum is 5 = 20 bytes).',
      'Total Length (16 bits): Total size of IP datagram (header + payload) in bytes (maximum 65,535 bytes).',
      'Fragmentation Fields (Identification, Flags, Fragment Offset): Allows routers to chop packets that exceed a link\'s Maximum Transmission Unit (MTU, e.g. 1500 bytes).',
      'Time to Live - TTL (8 bits): Decremented by 1 at every router hop. When TTL reaches 0, the packet is dropped and an ICMP Time Exceeded message is returned, preventing infinite routing loops.',
      'Protocol (8 bits): Identifies the transport payload protocol (e.g. `6` for TCP, `17` for UDP, `1` for ICMP).',
      'CIDR Breakdown: The `/26` leaves 6 bits for hosts ($2^6 = 64$). We subtract 2 for the Network ID (`.0`) and Broadcast IP (`.63`), leaving 62 assignable IP addresses.'
    ],
    interviewQuestions: [
      {
        id: 'cn-5-q1',
        question: 'Given an IP block 192.168.1.0/27, calculate the Subnet Mask, Total IPs, Usable Hosts, Network ID, and Broadcast Address.',
        companyTags: ['Cisco', 'Amazon', 'TCS'],
        frequency: 'Very High',
        answer: '• Prefix length: `/27` means 27 network bits, leaving $32 - 27 = 5$ host bits.\n• Subnet Mask: `11111111.11111111.11111111.11100000` = `255.255.255.224`.\n• Total IP addresses: $2^5 = 32$.\n• Usable Host addresses: $2^5 - 2 = 30$ (subtracting network and broadcast).\n• Network ID: `192.168.1.0` (all 5 host bits are 0).\n• Broadcast Address: `192.168.1.31` (all 5 host bits are 1).\n• Usable Host IP Range: `192.168.1.1` to `192.168.1.30`.'
      },
      {
        id: 'cn-5-q2',
        question: 'What is the purpose of the Time to Live (TTL) field in the IPv4 header?',
        companyTags: ['Google', 'Microsoft', 'Qualcomm'],
        frequency: 'Very High',
        answer: 'The TTL (Time to Live) field is an 8-bit counter that limits packet lifetime to prevent misconfigured routing loops from cycling packets forever on the Internet.\n\nHow It Works: Every router that forwards the packet decrements the TTL by 1. If TTL reaches 0, the router discards the packet and sends an ICMP "Time Exceeded" error message back to the source. The `traceroute` utility leverages this by sending packets with TTL = 1, 2, 3... to map every router hop along a path.'
      },
      {
        id: 'cn-5-q3',
        question: 'What are the key architectural differences between IPv4 and IPv6?',
        companyTags: ['Apple', 'Juniper', 'Infosys'],
        frequency: 'Very High',
        answer: '1. Address Space: IPv4 has 32 bits (~4.3 billion addresses); IPv6 has 128 bits (~$3.4 \\times 10^{38}$ addresses).\n2. Header Size: IPv4 has a variable-length header (20-60 bytes); IPv6 has a fixed 40-byte base header, accelerating hardware routing.\n3. Fragmentation: In IPv4, intermediate routers fragment packets. In IPv6, routers NEVER fragment; the source host performs Path MTU Discovery.\n4. Checksum: IPv6 eliminated the header checksum, relying on Layer 2 and Layer 4 checksums to speed up router processing.\n5. Broadcast: IPv6 eliminates broadcast entirely, replacing it with Multicast and Anycast.'
      },
      {
        id: 'cn-5-q4',
        question: 'What are Private IP address ranges (RFC 1918), and why are they not routable on the public Internet?',
        companyTags: ['Amazon', 'Uber', 'Cognizant'],
        frequency: 'High',
        answer: 'RFC 1918 reserves three private address blocks for internal networks:\n• Class A: `10.0.0.0/8` (`10.0.0.0` - `10.255.255.255`)\n• Class B: `172.16.0.0/12` (`172.16.0.0` - `172.31.255.255`)\n• Class C: `192.168.0.0/16` (`192.168.0.0` - `192.168.255.255`)\n\nWhy Not Routable: These addresses are reused across millions of private homes and corporate LANs worldwide. Public Internet core routers are programmed to immediately drop any packet with a private destination IP. Communication with the public Internet requires Network Address Translation (NAT).'
      },
      {
        id: 'cn-5-q5',
        question: 'How does Network Address Translation (NAT / NAPT) allow thousands of devices to share one public IP?',
        companyTags: ['Cisco', 'Goldman Sachs', 'Wipro'],
        frequency: 'High',
        answer: 'Network Address Port Translation (NAPT / PAT) maps multiple private IP addresses to a single public IP address using unique Layer 4 Port Numbers.\n\nWhen a home laptop (`192.168.1.10:52310`) makes an outbound connection, the NAT router rewrites the source IP to its public IP (`203.0.113.5`) and replaces the source port with an available NAT port (e.g. `40001`), saving this mapping in its internal NAT Translation Table. When reply packets return to port 40001, the router reverses the translation, delivering the packet to the correct internal laptop.'
      }
    ],
    flashcards: [
      {
        id: 'cn-5-fc1',
        front: 'How many bits are in an IPv4 address vs an IPv6 address?',
        back: 'IPv4 has 32 bits (4 bytes); IPv6 has 128 bits (16 bytes).',
        keyTakeaway: 'IPv6 expands address space from 4.3 billion to 3.4 x 10^38.'
      },
      {
        id: 'cn-5-fc2',
        front: 'How many usable host IP addresses are in a /24 subnet?',
        back: '2^(32-24) - 2 = 256 - 2 = 254 usable host addresses.',
        keyTakeaway: 'Always subtract 2 for the Network ID and Broadcast IP.'
      },
      {
        id: 'cn-5-fc3',
        front: 'What happens to an IP packet when its TTL counter reaches 0?',
        back: 'The router drops the packet and returns an ICMP Time Exceeded message to the sender.',
        keyTakeaway: 'TTL prevents packets from looping indefinitely.'
      },
      {
        id: 'cn-5-fc4',
        front: 'What are the three RFC 1918 Private IP address ranges?',
        back: '10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.',
        keyTakeaway: 'Private IP ranges are reserved for internal networks and non-routable on the Internet.'
      },
      {
        id: 'cn-5-fc5',
        front: 'Do intermediate routers perform packet fragmentation in IPv6?',
        back: 'No; IPv6 eliminates router fragmentation, requiring the sending host to perform Path MTU Discovery.',
        keyTakeaway: 'IPv6 offloads fragmentation exclusively to source endpoints.'
      }
    ]
  },
  {
    id: 'cn-6',
    subjectId: 'cn',
    order: 6,
    title: 'Routing Protocols & Algorithms: Distance-Vector vs Link-State',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine traveling across Europe by car. Distance-Vector Routing (like RIP) is like navigating exclusively by asking roadside gas station attendants: a mechanic in Paris tells you "Madrid is about 800 miles South along Route A1", but the mechanic has never personally been to Madrid and has no idea if a bridge collapsed 200 miles down the road. You rely purely on neighbors\' second-hand hearsay ("routing by rumor"). Link-State Routing (like OSPF) is like giving every driver an identical GPS satellite map of all roads, bridges, and speed limits across the entire continent. Every driver calculates the shortest path on their own GPS screen using Dijkstra\'s algorithm. Everyone has a global birds-eye view.',
    what: 'Routing is the network layer process of determining the optimal end-to-end path that packets travel from source host to destination host across a mesh of interconnected routers. Routing protocols execute distributed graph algorithms to build and update each router\'s Forwarding Table.\n\nRouting protocols are divided into two fundamental classes based on network scale:\n1. Interior Gateway Protocols (IGPs): Used within a single Autonomous System (AS)—a network administered by a single organization (e.g. a university, corporate enterprise, or ISP). Two classic algorithmic families dominate IGPs:\n   • Distance-Vector Routing (e.g. RIP): Based on the distributed Bellman-Ford algorithm. Routers periodically send their entire routing table (vector of distances) only to directly connected physical neighbors. Routers update their paths using the equation $D_x(y) = \\min_v \\{ c(x,v) + D_v(y) \\}$. Suffer from slow convergence and the Count-to-Infinity Problem.\n   • Link-State Routing (e.g. OSPF, IS-IS): Based on Dijkstra\'s Shortest Path Algorithm. Every router floods Link-State Advertisements (LSAs) containing the identity and cost of its directly attached links to all routers in the network. Every router constructs an identical Link-State Database (topological graph of the network) and independently executes Dijkstra\'s algorithm to compute the shortest-path tree.\n2. Exterior Gateway Protocols (EGPs): Used to route traffic between different Autonomous Systems across the global Internet. Border Gateway Protocol (BGP-4) is the sole inter-domain routing protocol of the global Internet. BGP is a Path-Vector protocol that advertises complete sequences of AS numbers (AS-Paths), allowing network operators to enforce political, business, and peering policies while mathematically preventing routing loops.',
    why: 'Without automated dynamic routing protocols, internet traffic would require manual static route configuration on millions of core routers. A single fiber cut under the Atlantic Ocean would bring down international communications until technicians manually reconfigured alternate paths.\n\nDynamic routing protocols detect link failures in milliseconds, flood alert advertisements, and converge on alternate paths autonomously without human intervention.',
    useCase: 'Enterprise networks running thousands of internal servers run OSPF (Open Shortest Path First). OSPF divides large enterprise networks into hierarchical Areas (with Area 0 as the central Backbone Area) to bound link-state database memory consumption and localize routing calculation overhead.\n\nAt the global Internet edge, telecommunication giants (like AT&T, Level 3, and Tata Communications) run BGP to exchange routes. When a cloud provider like Cloudflare or AWS launches a new data center, it uses BGP Anycast to announce the same IP prefix simultaneously from 300 cities worldwide, allowing global users to automatically reach the physically closest data center with the lowest latency.',
    example: `+-----------------------------------------------------------------------------+
|        LINK-STATE (DIJKSTRA) vs DISTANCE-VECTOR ROUTING TOPOLOGY            |
+-----------------------------------------------------------------------------+

             [ Router A ] ------------ (Cost: 2) ------------ [ Router B ]
                  |                                                 |
                  |                                                 |
              (Cost: 5)                                         (Cost: 3)
                  |                                                 |
                  |                                                 |
             [ Router C ] ------------ (Cost: 1) ------------ [ Router D ]

===============================================================================
1. DISTANCE-VECTOR (Bellman-Ford): "Routing by Rumor"
   - Router A tells C: "I can reach B with cost 2".
   - Router C computes: Cost to B via A = Cost(C, A) + 2 = 5 + 2 = 7.
   - Router D tells C: "I can reach B with cost 3".
   - Router C computes: Cost to B via D = Cost(C, D) + 3 = 1 + 3 = 4.
   - Router C chooses Path via D (Cost 4 < Cost 7) and updates its table.
   * Flaw: If link D-B breaks, C and D can bounce updates back and forth,
     incrementing cost indefinitely (Count-to-Infinity Problem!).

2. LINK-STATE (Dijkstra's Algorithm): "Global Topology Map"
   - Every router floods Link-State Advertisements (LSAs) to ALL routers.
   - Every router builds an IDENTICAL complete graph of the 4 nodes & 4 links.
   - Router C runs Dijkstra locally:
     Step 1: Permanent set {C}, Distances: D=1, A=5, B=infinity
     Step 2: Add closest node D {C, D}. Update neighbors of D: B = 1 + 3 = 4
     Step 3: Add B {C, D, B}. Update neighbors: A = 4 + 2 = 6 (5 is smaller!)
     Step 4: Shortest paths from C: to D=1, to B=4 (via D), to A=5 (direct).`,
    exampleExplanation: [
      'Topology: 4 routers with link costs. Notice there are two paths from C to B: via A (cost 5+2=7) or via D (cost 1+3=4).',
      'Distance-Vector Method: Routers exchange distance estimates only with direct neighbors. Router C discovers that routing through D offers lower total cost (4 vs 7).',
      'Count-to-Infinity Trap: If link D-B fails, D thinks it can reach B via C with cost 5, C updates to 6, D to 7, counting up to infinity unless Split Horizon with Poison Reverse is used.',
      'Link-State Method: Routers flood LSAs so all nodes maintain an identical network map. Router C independently runs Dijkstra\'s algorithm to find the exact shortest path tree.',
      'Advantage of Link-State: Fast convergence, zero loops, and immediate detection of link state transitions.'
    ],
    interviewQuestions: [
      {
        id: 'cn-6-q1',
        question: 'Compare Distance-Vector Routing vs Link-State Routing in terms of algorithm, knowledge, and convergence speed.',
        companyTags: ['Cisco', 'Amazon', 'Google'],
        frequency: 'Very High',
        answer: '• Algorithm: Distance-Vector uses distributed Bellman-Ford; Link-State uses Dijkstra\'s Shortest Path First (SPF).\n• Knowledge: Distance-Vector routers know only the distance and next hop to destinations based on neighbor rumors; Link-State routers know the complete, identical global topology map of the entire network.\n• Information Exchange: Distance-Vector sends entire routing table only to direct neighbors; Link-State floods small Link-State Advertisements (LSAs) describing only its own links to all routers in the network.\n• Convergence Speed: Link-State converges rapidly without routing loops; Distance-Vector converges slowly and is vulnerable to routing loops.'
      },
      {
        id: 'cn-6-q2',
        question: 'What is the Count-to-Infinity problem in Distance-Vector routing, and how do Split Horizon and Poison Reverse resolve it?',
        companyTags: ['Cisco', 'Juniper', 'Qualcomm'],
        frequency: 'Very High',
        answer: 'Count-to-Infinity occurs when a link fails, and two neighboring routers continually update each other with mutually dependent paths, slowly incrementing the hop count until reaching infinity (RIP defines infinity as 16 hops).\n\nSolutions:\n• Split Horizon: A router never advertises a route back out the same interface from which it learned it.\n• Poison Reverse: When a router learns a route from an interface, it advertises the route back out that interface with a metric of Infinity (16), immediately breaking circular dependencies.'
      },
      {
        id: 'cn-6-q3',
        question: 'What is BGP (Border Gateway Protocol), and why is it called a Path-Vector protocol?',
        companyTags: ['Cloudflare', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: 'BGP is the de-facto standard inter-domain routing protocol of the global Internet, exchanging reachability information between Autonomous Systems (ASs).\n\nWhy Path-Vector: Instead of advertising simple hop counts or link metrics, BGP advertises the complete sequence of Autonomous System numbers (the AS-Path attribute, e.g. `AS 15169 -> AS 3356 -> AS 701`) required to reach a destination prefix.\n\nLoop Prevention: If a router receives a BGP advertisement containing its own AS number in the AS-Path, it immediately discards the route, mathematically preventing inter-domain routing loops.'
      },
      {
        id: 'cn-6-q4',
        question: 'What is OSPF, and why does it divide networks into Areas (with Area 0 as the backbone)?',
        companyTags: ['Cisco', 'Juniper', 'TCS'],
        frequency: 'High',
        answer: 'OSPF (Open Shortest Path First) is an open-standard link-state IGP that uses Dijkstra\'s algorithm.\n\nWhy Areas: In a massive enterprise with 10,000 routers, flooding LSAs globally would overwhelm network bandwidth, and running Dijkstra on a 10,000-node graph would exhaust router CPU.\n\nOSPF divides the network into Areas. Detailed topology LSAs are contained strictly within their local area. Area Border Routers (ABRs) summarize routes into Area 0 (Backbone Area), bounding SPF calculations to manageable localized subsets.'
      },
      {
        id: 'cn-6-q5',
        question: 'What is the difference between a Routing Table and a Forwarding Table (FIB)?',
        companyTags: ['Arista', 'Cisco', 'Amazon'],
        frequency: 'Medium',
        answer: '• Routing Table (RIB - Routing Information Base): Maintained by the routing control plane in software. Contains all routes learned from all dynamic routing protocols (BGP, OSPF) and static configurations, with metrics and administrative distances.\n• Forwarding Table (FIB - Forwarding Information Base): Maintained by the data plane in specialized high-speed hardware memory (TCAM - Ternary Content-Addressable Memory). It contains only the single best next-hop interface for each prefix, optimized for nanosecond packet lookups at wire speed.'
      }
    ],
    flashcards: [
      {
        id: 'cn-6-fc1',
        front: 'Which algorithm does Link-State routing use vs Distance-Vector routing?',
        back: 'Link-State uses Dijkstra\'s algorithm; Distance-Vector uses the Bellman-Ford algorithm.',
        keyTakeaway: 'Dijkstra computes global shortest paths; Bellman-Ford updates distance vectors.'
      },
      {
        id: 'cn-6-fc2',
        front: 'What is the Count-to-Infinity problem in distance-vector routing?',
        back: 'A routing loop where neighbors continuously increment metrics for a failed link until reaching infinity.',
        keyTakeaway: 'Split Horizon and Poison Reverse mitigate count-to-infinity loops.'
      },
      {
        id: 'cn-6-fc3',
        front: 'Why is BGP called a Path-Vector protocol?',
        back: 'It advertises the complete sequence of Autonomous System (AS) numbers along the route to prevent loops.',
        keyTakeaway: 'AS-Paths in BGP guarantee loop-free inter-domain routing.'
      },
      {
        id: 'cn-6-fc4',
        front: 'What is OSPF Area 0 called?',
        back: 'The Backbone Area; all other OSPF areas must connect to Area 0 to route inter-area traffic.',
        keyTakeaway: 'Area 0 acts as the central transit hub for all OSPF areas.'
      },
      {
        id: 'cn-6-fc5',
        front: 'What is the maximum hop count in the Routing Information Protocol (RIP)?',
        back: '15 hops; a metric of 16 represents infinity (unreachable).',
        keyTakeaway: 'RIP is limited to small networks with a maximum diameter of 15 hops.'
      }
    ]
  },
  {
    id: 'cn-7',
    subjectId: 'cn',
    order: 7,
    title: 'Transport Layer: UDP Protocol, Checksum & Port Multiplexing',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine a live sports radio broadcaster speaking into a microphone. The broadcaster doesn\'t pause every sentence to dial your personal phone number, wait for you to answer, ask "Did you hear that word?", and re-read it if static occurred on your radio. They stream speech continuously in real time: if a burst of static drowns out half a second of commentary, you don\'t want the broadcast to pause for 5 seconds while they resend the lost words—you just want to hear the live play happening right now. This is User Datagram Protocol (UDP): lightweight, connectionless, zero-handshake fire-and-forget communication.',
    what: 'The Transport Layer (Layer 4) provides logical process-to-process communication between application programs running on different hosts. To distinguish which specific application should receive incoming network traffic on a computer, the transport layer uses 16-bit Port Numbers (ranging from 0 to 65,535). Standard ranges include Well-Known Ports (0–1023, e.g. HTTP: 80, HTTPS: 443, DNS: 53), Registered Ports (1024–49151), and Ephemeral/Dynamic Ports (49152–65535, dynamically assigned by the OS to client apps).\n\nThe User Datagram Protocol (UDP, RFC 768) is a minimalist, connectionless transport protocol that provides "best-effort" datagram delivery without establishing a pre-transmission connection. A UDP segment header is remarkably lean—only 8 bytes total, containing just four 16-bit fields:\n1. Source Port (optional for client requests).\n2. Destination Port (identifies receiving application).\n3. Length (total byte size of UDP header + payload data).\n4. Checksum (error detection across header, payload, and a pseudo-IP header).\n\nUDP provides Port Multiplexing/Demultiplexing and optional error detection via its checksum, but provides NO reliability guarantees: it has no sequence numbers, no acknowledgments, no retransmissions for lost packets, no flow control, and no congestion control. If an intermediate router drops a UDP packet due to buffer overflow, UDP does not notice or care; reliability, if required, must be implemented entirely in user application code.',
    why: 'While TCP provides guaranteed reliability, that reliability comes with heavy performance costs: connection establishment latency (1.5 RTT 3-way handshake), head-of-line blocking (a single lost packet stalls all subsequent data bytes), and transmission throttling caused by congestion control algorithms.\n\nFor time-sensitive real-time applications (video streaming, live gaming, DNS lookups, VoIP audio), receiving data on-time is vastly more critical than receiving 100% of historical bytes. In online multiplayer games (like Fortnite or Valorant), receiving player coordinates from 200 milliseconds ago is completely useless; you need the latest current coordinates immediately.',
    useCase: 'Domain Name System (DNS) queries use UDP port 53 by default: when you type `google.com`, your browser sends a single UDP datagram query. The DNS server replies with a single UDP datagram response. If the packet drops, the client simply re-sends the query after a short timeout, avoiding the overhead of establishing and tearing down a TCP connection.\n\nFurthermore, the modern web protocol HTTP/3 is built upon QUIC, which runs directly on top of UDP! By using UDP as a substrate, QUIC implements its own modern encryption (TLS 1.3), independent multiplexed streams, and 0-RTT connection handshakes in user space, bypassing legacy OS kernel TCP bottlenecks.',
    example: `+-----------------------------------------------------------------------------+
|               UDP 8-BYTE DATAGRAM HEADER STRUCTURE (RFC 768)                |
+-----------------------------------------------------------------------------+

 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |  (4 Bytes)
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length             |           Checksum            |  (4 Bytes)
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
|                  Application Data (Payload)                   |  (Variable)
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

===============================================================================
PORT DEMULTIPLEXING AT RECEIVING HOST:
  Incoming UDP Datagram arrives at Network Card
       |
       v (Stripped IP Header -> Passes to Transport Layer)
  Inspect Destination Port in UDP Header:
       |
       +---> Port 53   ===> Dispatches to DNS Daemon (named)
       +---> Port 123  ===> Dispatches to Network Time Protocol (NTP)
       +---> Port 5060 ===> Dispatches to VoIP / SIP Audio Server
       +---> Port 4433 ===> Dispatches to QUIC / HTTP/3 Web Server`,
    exampleExplanation: [
      'Source Port (16 bits): The port on the sending machine where reply datagrams should be directed (e.g. ephemeral port 51234).',
      'Destination Port (16 bits): The port of the target process on the destination machine (e.g. port 53 for DNS).',
      'Length (16 bits): The minimum length is 8 bytes (an empty UDP packet with only the header); maximum is 65,535 bytes (bounded by IP total length).',
      'Checksum (16 bits): Computed over the UDP header, payload data, and a 12-byte IPv4 Pseudo-Header (Source IP, Dest IP, Protocol 17, UDP Length) to catch misrouted packets.',
      'Port Demultiplexing: The OS kernel inspects the destination port and directly pushes the payload buffer into the matching application socket queue.'
    ],
    interviewQuestions: [
      {
        id: 'cn-7-q1',
        question: 'What are the key differences between TCP and UDP?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '• Connection: TCP is connection-oriented (requires 3-way handshake); UDP is connectionless (fire and forget).\n• Reliability: TCP guarantees delivery via acknowledgments, sequence numbers, and retransmissions; UDP provides best-effort delivery (packets may be lost, duplicated, or arrive out of order).\n• Header Size: TCP header is 20-60 bytes; UDP header is fixed at only 8 bytes.\n• Flow/Congestion Control: TCP has sliding window flow control and AIMD congestion control; UDP has zero throttling and sends at application rate.\n• Use Cases: TCP is used for Web (HTTP), Email (SMTP), File Transfer (FTP); UDP is used for DNS, VoIP, Live Video Streaming, Online Gaming, and QUIC/HTTP3.'
      },
      {
        id: 'cn-7-q2',
        question: 'Why does DNS use UDP by default, and when does it fall back to TCP?',
        companyTags: ['Cloudflare', 'Cisco', 'Apple'],
        frequency: 'Very High',
        answer: '• Why UDP: Standard DNS lookups are tiny (a single query and single answer). Using UDP requires only 1 RTT with zero connection setup/teardown overhead, allowing DNS servers to handle hundreds of thousands of queries per second without maintaining connection state in memory.\n• Fallback to TCP: DNS falls back to TCP port 53 in two scenarios:\n  1. Response Truncation (TC bit set): When the DNS response exceeds 512 bytes (or client EDNS buffer limits), such as large DNSSEC cryptographic keys.\n  2. Zone Transfers (AXFR/IXFR): Synchronizing complete DNS zone databases between primary and secondary name servers.'
      },
      {
        id: 'cn-7-q3',
        question: 'What is the UDP Pseudo-Header, and why is it included in the checksum calculation?',
        companyTags: ['Qualcomm', 'Oracle', 'TCS'],
        frequency: 'High',
        answer: 'The UDP Pseudo-Header is a 12-byte temporary memory structure consisting of:\n• Source IP Address (4 bytes)\n• Destination IP Address (4 bytes)\n• Zero padding byte (1 byte)\n• Protocol number (1 byte, 17 for UDP)\n• UDP Length (2 bytes)\n\nWhy Included: Even though IP addresses belong to Layer 3, including them in the Layer 4 checksum allows the receiving transport layer to verify that the packet was delivered to the intended destination IP address and was not misdelivered due to corrupted IP routing table entries.'
      },
      {
        id: 'cn-7-q4',
        question: 'What is Port Multiplexing and Demultiplexing in the Transport Layer?',
        companyTags: ['Amazon', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: '• Multiplexing (at Sender): Gathering data from multiple application processes (each bound to a socket with a unique port number), encapsulating each with transport headers, and passing them down to the network layer as a single IP stream.\n• Demultiplexing (at Receiver): Inspecting the Destination Port (and IP/Source Port for TCP) in the incoming transport header to deliver the payload to the exact application socket that opened that port.'
      },
      {
        id: 'cn-7-q5',
        question: 'Why is Google\'s QUIC protocol (HTTP/3) built on top of UDP rather than TCP?',
        companyTags: ['Google', 'Meta', 'Netflix'],
        frequency: 'Very High',
        answer: '1. Eliminates Head-of-Line Blocking: In TCP, multiple HTTP/2 multiplexed streams share one connection; if one packet drops, all streams freeze. QUIC over UDP provides independent streams—packet loss on stream 1 does not pause stream 2.\n2. 0-RTT Connection Establishment: Combines transport and TLS 1.3 cryptographic handshakes into a single round-trip (or 0-RTT for repeat connections).\n3. Connection Migration: QUIC uses a 64-bit Connection ID instead of the 4-tuple (IP/Port). If a user walks from Wi-Fi to cellular, the IP changes but the connection stays alive without reconnecting.\n4. User-Space Evolution: Modifying TCP requires kernel updates on billions of consumer devices; QUIC over UDP is implemented in user space and updates like an application.'
      }
    ],
    flashcards: [
      {
        id: 'cn-7-fc1',
        front: 'What is the total header size of a UDP datagram?',
        back: 'Exactly 8 bytes (Source Port, Destination Port, Length, Checksum).',
        keyTakeaway: 'UDP header is minimal (8 bytes) compared to TCP (20-60 bytes).'
      },
      {
        id: 'cn-7-fc2',
        front: 'What are the 4 fields in a UDP header?',
        back: 'Source Port (16 bits), Destination Port (16 bits), Length (16 bits), and Checksum (16 bits).',
        keyTakeaway: 'UDP contains only ports, length, and checksum.'
      },
      {
        id: 'cn-7-fc3',
        front: 'Does UDP provide flow control or congestion control?',
        back: 'No; UDP transmits at whatever rate the application produces data, without flow or congestion control.',
        keyTakeaway: 'UDP provides zero rate-throttling or delivery guarantees.'
      },
      {
        id: 'cn-7-fc4',
        front: 'When does DNS switch from UDP to TCP?',
        back: 'When DNS responses exceed 512 bytes (truncated responses) or during zone transfers between DNS servers.',
        keyTakeaway: 'DNS uses UDP for fast queries and TCP for large responses or zone transfers.'
      },
      {
        id: 'cn-7-fc5',
        front: 'Why is HTTP/3 built on UDP instead of TCP?',
        back: 'To eliminate TCP head-of-line blocking, enable 0-RTT handshakes, and allow connection migration across networks.',
        keyTakeaway: 'QUIC over UDP enables stream-level multiplexing without TCP head-of-line blocking.'
      }
    ]
  },
  {
    id: 'cn-8',
    subjectId: 'cn',
    order: 8,
    title: 'TCP Protocol: Reliability, 3-Way Handshake & Flow Control',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine two business executives negotiating a high-stakes million-dollar contract over the telephone. Executive A calls: "Hello, can you hear me clearly?" (SYN). Executive B answers: "Yes, I hear you clearly! Can you hear me?" (SYN-ACK). Executive A confirms: "Yes, I hear you loud and clear. Let\'s begin." (ACK). This is the TCP 3-Way Handshake. Throughout the business call, every single sentence spoken is assigned a sequential number ("Sentence 1", "Sentence 2"). If static garbles Sentence 3, Executive B interrupts: "I did not receive Sentence 3, please repeat it." Executive A will never move to Sentence 4 until Sentence 3 is signed and acknowledged. If Executive B is speaking too fast, Executive A requests: "Slow down, my notepad is full" (Flow Control).',
    what: 'The Transmission Control Protocol (TCP, RFC 793) is the fundamental connection-oriented, highly reliable transport protocol of the Internet Protocol suite. TCP transforms an unreliable, packet-dropping network layer (IP) into an abstraction of a reliable, ordered, error-checked, full-duplex byte stream between two communicating endpoints.\n\nA TCP segment header is 20 bytes (up to 60 bytes with options), featuring Sequence Numbers (32 bits, tracking the exact byte offset of the data stream), Acknowledgment Numbers (32 bits, cumulative ACK indicating the *next* expected byte from the peer), a 16-bit Receive Window (`rwnd`, advertising available buffer space for Flow Control), and control flags: SYN (synchronize sequence numbers), ACK (acknowledgment valid), FIN (finish connection), RST (reset connection), PSH (push data), and URG (urgent pointer).\n\nTCP operates through distinct lifecycle phases:\n1. Connection Establishment (3-Way Handshake):\n   • Client $\\rightarrow$ Server: `SYN` (Client chooses Initial Sequence Number `ISN_c`). Client enters `SYN_SENT`.\n   • Server $\\rightarrow$ Client: `SYN-ACK` (Server acknowledges `ISN_c + 1` and sends its own `ISN_s`). Server enters `SYN_RCVD`.\n   • Client $\\rightarrow$ Server: `ACK` (Client acknowledges `ISN_s + 1`). Both endpoints transition to `ESTABLISHED`.\n2. Reliable Data Transfer: Cumulative ACKs and dynamic Retransmission Timeouts ($RTO$, computed from smoothed round-trip time measurements) retransmit lost segments.\n3. Flow Control: The receiver continuously advertises its available buffer capacity in the `Receive Window (rwnd)` header field. The sender cannot transmit more unacknowledged bytes than `rwnd`, preventing a fast sender from overflowing a slow receiver\'s application buffer.\n4. Connection Teardown (4-Way Handshake): Each half of the full-duplex connection must close independently using `FIN` and `ACK` flags. The client enters the `TIME_WAIT` state (lasting $2 \\times \\text{MSL}$, typically 60–120 seconds) to ensure final ACKs are received and prevent stale delayed packets from colliding with future connections.',
    why: 'Without TCP\'s sequence numbers, cumulative acknowledgments, and flow control, web pages would render with missing paragraphs, software downloads would arrive corrupted with missing binary chunks, and fast servers would instantly overwhelm mobile client buffers, dropping connections completely.\n\nTCP provides the rock-solid foundation upon which critical web protocols (HTTP/1.1, HTTP/2, TLS, WebSockets, SSH, SMTP) execute reliably across unpredictable global networks.',
    useCase: 'Every financial stock trade executed on NASDAQ, every code commit pushed to GitHub over SSH, and every database query executed by an application server relies on TCP. When your browser downloads a 100 MB file over HTTPS, TCP fragments the byte stream into thousands of 1460-byte Maximum Segment Size (MSS) packets.\n\nIf a router in Denver drops packet number 42, the receiver detects the gap, sends duplicate ACKs requesting byte 42, the sender retransmits packet 42, and the receiver reassembles the complete file in perfect sequential order before handing it to the user.',
    example: `+-----------------------------------------------------------------------------+
|                 TCP 3-WAY HANDSHAKE & 4-WAY TEARDOWN FLOW                   |
+-----------------------------------------------------------------------------+

 [ CLIENT ]                                                      [ SERVER ]
   STATE: CLOSED                                                   STATE: LISTEN
     |                                                                |
     | 1. [ SYN, Seq = 1000 ]                                         |
     |    "I want to connect! My initial sequence number is 1000"     |
     |--------------------------------------------------------------->| (Enters SYN_RCVD)
(SYN_SENT)                                                            |
     | 2. [ SYN-ACK, Seq = 5000, Ack = 1001 ]                         |
     |    "Got your 1000! My Seq is 5000, expecting byte 1001 next"   |
     |<---------------------------------------------------------------|
     |                                                                |
     | 3. [ ACK, Seq = 1001, Ack = 5001 ]                             |
     |    "Got your 5000! Expecting byte 5001. Connected!"            |
     |--------------------------------------------------------------->|
(ESTABLISHED)                                                    (ESTABLISHED)
     |                                                                |
     |                   FULL DUPLEX DATA EXCHANGE                    |
     |  Client sends data: Seq = 1001 (100 bytes)                     |
     |  Server acknowledges: Ack = 1101, Advertised Window rwnd=64KB  |
     |                                                                |
===============================================================================
                     4-WAY CONNECTION TEARDOWN (FIN / ACK)
     |                                                                |
     | 1. [ FIN, Seq = 2000 ]                                         |
     |    "I am finished sending data."                               |
     |--------------------------------------------------------------->| (CLOSE_WAIT)
(FIN_WAIT_1)                                                          |
     | 2. [ ACK, Ack = 2001 ]                                         |
     |    "Acknowledged. I still have remaining data to send you."    |
     |<---------------------------------------------------------------|
(FIN_WAIT_2)                                                          |
     |    [ Server finishes flushing remaining data... ]              |
     |                                                                |
     | 3. [ FIN, Seq = 8000 ]                                         |
     |    "I am also finished sending data now."                      |
     |<---------------------------------------------------------------| (LAST_ACK)
     |                                                                |
     | 4. [ ACK, Ack = 8001 ]                                         |
     |    "Acknowledged. Goodbye!"                                    |
     |--------------------------------------------------------------->| (CLOSED)
(TIME_WAIT: 2 * MSL)                                                  |
     v                                                                v
 (Enters CLOSED after timeout)                                     (CLOSED)`,
    exampleExplanation: [
      'Step 1 (SYN): Client picks an Initial Sequence Number (ISN=1000) using a pseudorandom clock to prevent replay attacks.',
      'Step 2 (SYN-ACK): Server acknowledges receipt of client\'s ISN with `Ack = 1001` (cumulative ACK of next expected byte) and sends its own `ISN=5000`.',
      'Step 3 (ACK): Client acknowledges the server\'s ISN with `Ack = 5001`. The TCP connection is now officially ESTABLISHED on both sides.',
      'Data Transfer & Flow Control: Each segment specifies `Seq` number and `rwnd` window buffer space, preventing buffer overflow.',
      'Teardown (FIN/ACK): Because TCP is full-duplex, each direction closes independently. Server enters `CLOSE_WAIT` while flushing pending data.',
      'TIME_WAIT State: Client waits for $2 \\times \\text{MSL}$ (Maximum Segment Lifetime, 60–120s) to ensure the server received the final ACK and to let wandering duplicate packets die.'
    ],
    interviewQuestions: [
      {
        id: 'cn-8-q1',
        question: 'Why does TCP use a 3-Way Handshake to establish a connection instead of a 2-Way Handshake?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: 'A 2-Way Handshake is insufficient to prevent stale duplicate connections:\n\n1. Mutual Agreement on ISNs: Both client and server must choose and acknowledge each other\'s Initial Sequence Numbers (ISNs) to track data bytes.\n2. Stale Delayed SYNs: Suppose a client\'s SYN packet is delayed in the network. The client times out and opens a new connection. Later, the old delayed SYN finally arrives at the server. With a 2-way handshake, the server would send an ACK and immediately consider the connection open, allocating memory for a non-existent phantom client!\n\nWith a 3-way handshake, the server waits for the client\'s 3rd ACK. The client detects the old sequence number, sends a `RST` (Reset) packet, and the server discards the duplicate connection safely.'
      },
      {
        id: 'cn-8-q2',
        question: 'What is the purpose of the TIME_WAIT state in TCP connection teardown, and why does it last for 2*MSL?',
        companyTags: ['Google', 'Meta', 'Uber'],
        frequency: 'Very High',
        answer: 'The client that initiates the active close enters the `TIME_WAIT` state for $2 \\times \\text{MSL}$ (Maximum Segment Lifetime, typically 1 to 2 minutes):\n\n1. Reliable Teardown: If the client\'s final ACK is lost, the server will time out and retransmit its `FIN`. If the client closed immediately, it would respond with `RST`, causing an unclean abort on the server. In `TIME_WAIT`, the client resends the ACK.\n2. Preventing Stale Packet Confusion: It allows all delayed, wandering duplicate packets from the old connection to expire in the Internet before a new connection can open on the same IP:Port 4-tuple.'
      },
      {
        id: 'cn-8-q3',
        question: 'How does TCP Sliding Window Flow Control work, and how does it differ from Congestion Control?',
        companyTags: ['Cisco', 'Apple', 'Goldman Sachs'],
        frequency: 'Very High',
        answer: '• Flow Control: Protects the RECEIVER from being overwhelmed by a fast sender. The receiver advertises its available buffer space via the `Receive Window (rwnd)` header field. The sender cannot have more unacknowledged bytes in-flight than $\\\\text{rwnd}$.\n• Congestion Control: Protects the NETWORK (intermediate routers and links) from being overwhelmed by too much traffic. Managed via the sender\'s internal Congestion Window (`cwnd`).\n• Actual Allowed Window: The sender transmits $\\\\min(rwnd, cwnd)$.'
      },
      {
        id: 'cn-8-q4',
        question: 'What is a SYN Flood attack, and how do SYN Cookies mitigate it?',
        companyTags: ['Cloudflare', 'Akamai', 'Microsoft'],
        frequency: 'High',
        answer: '• SYN Flood Attack: An attacker sends thousands of spoofed `SYN` packets to a server but never responds to the server\'s `SYN-ACK`. The server allocates a Transmission Control Block (TCB) in memory for each half-open connection in its `SYN_RCVD` backlog queue, rapidly exhausting memory and rejecting legitimate users.\n• SYN Cookie Defense: The server does NOT allocate any memory or TCB when receiving a SYN! Instead, it encodes the connection state and timestamp into a cryptographic hash that becomes the server\'s Initial Sequence Number (ISN). Only when the client responds with a valid ACK (carrying the cookie + 1) does the server verify the math and allocate memory.'
      },
      {
        id: 'cn-8-q5',
        question: 'What is the Silly Window Syndrome in TCP, and how do Nagle\'s Algorithm and Clark\'s Solution prevent it?',
        companyTags: ['Cisco', 'Broadcom'],
        frequency: 'Medium',
        answer: 'Silly Window Syndrome occurs when data is exchanged in tiny fragments (e.g. 1 byte payload inside a 40-byte TCP/IP header, 97% overhead).\n\n• Sender Solution — Nagle\'s Algorithm: The sender buffers small outbound writes into a single MSS segment before sending, unless all previously sent data has been acknowledged.\n• Receiver Solution — Clark\'s Solution: The receiver refuses to advertise small window increases; it advertises `rwnd = 0` until it can open a window equal to a full Maximum Segment Size (MSS) or half of its buffer capacity.'
      }
    ],
    flashcards: [
      {
        id: 'cn-8-fc1',
        front: 'What are the 3 steps of the TCP 3-Way Handshake?',
        back: '1. Client -> Server: SYN; 2. Server -> Client: SYN-ACK; 3. Client -> Server: ACK.',
        keyTakeaway: 'The 3-way handshake synchronizes sequence numbers and verifies bidirectional connectivity.'
      },
      {
        id: 'cn-8-fc2',
        front: 'Why must the active closer enter the TIME_WAIT state for 2*MSL?',
        back: 'To guarantee the final ACK is received by the peer and allow delayed duplicate packets to expire in the network.',
        keyTakeaway: 'TIME_WAIT ensures clean connection termination.'
      },
      {
        id: 'cn-8-fc3',
        front: 'What is the difference between TCP Flow Control and Congestion Control?',
        back: 'Flow control protects the receiving endpoint buffer (rwnd); congestion control protects the shared network links (cwnd).',
        keyTakeaway: 'Sender transmits the minimum of rwnd and cwnd.'
      },
      {
        id: 'cn-8-fc4',
        front: 'How do SYN Cookies protect servers from SYN Flood DoS attacks?',
        back: 'The server encodes connection state into the ISN without allocating memory until the final ACK arrives.',
        keyTakeaway: 'SYN cookies eliminate memory allocation for unverified half-open connections.'
      },
      {
        id: 'cn-8-fc5',
        front: 'What does a cumulative ACK of 1001 mean in TCP?',
        back: 'The receiver has successfully received all bytes up to 1000 and is now expecting byte 1001 next.',
        keyTakeaway: 'TCP ACKs are cumulative and specify the next expected byte.'
      }
    ]
  },
  {
    id: 'cn-9',
    subjectId: 'cn',
    order: 9,
    title: 'TCP Congestion Control: Slow Start, AIMD & Fast Recovery',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine driving a car onto a foggy mountain highway with zero visibility. You have no idea if the highway is wide open or jammed with traffic. Slow Start is like accelerating gently at first, but doubling your speed every 5 seconds (exponential growth) to test the road. The moment you see brake lights in the fog (reaching the Slow Start Threshold, `ssthresh`), you stop doubling and accelerate by only 1 mph every 5 seconds (Additive Increase) to inch forward carefully. If you see a minor hazard ahead (3 Duplicate ACKs), you don\'t slam on the brakes to 0 mph; you cut your speed in half (Multiplicative Decrease) and keep rolling (Fast Recovery). But if you crash into a brick wall (Retransmission Timeout - RTO), you slam the brakes to a dead stop (1 MSS) and start all over.',
    what: 'TCP Congestion Control is the end-to-end mechanism by which TCP senders infer network congestion along the transmission path and dynamically adjust their transmission rate to avoid Congestion Collapse. Because intermediate routers on the Internet do not explicitly tell endpoints what speed to transmit at, TCP uses packet loss and round-trip delays as implicit feedback signals.\n\nThe sender maintains an internal state variable called the Congestion Window (`cwnd`), which limits the total number of unacknowledged bytes the sender can inject into the network: $\\text{Allowed} = \\min(\\text{cwnd}, \\text{rwnd})$.\n\nStandard TCP Congestion Control (TCP Tahoe, Reno, NewReno, CUBIC) operates across Four Interconnected Phases:\n1. Slow Start: Upon establishing a connection, `cwnd` is initialized to a small value (traditionally 1 MSS, modern systems use 10 MSS). For every received ACK, `cwnd` increases by 1 MSS. This results in Exponential Growth: `cwnd` doubles every Round-Trip Time (RTT: $1 \\rightarrow 2 \\rightarrow 4 \\rightarrow 8 \\rightarrow 16$).\n2. Slow Start Threshold (`ssthresh`): Marks the transition boundary between exponential probing and safe linear probing.\n3. Congestion Avoidance (AIMD - Additive Increase Multiplicative Decrease):\n   • Additive Increase: Once `cwnd` reaches `ssthresh`, `cwnd` increases linearly by only 1 MSS per RTT ($+1$ for every window of ACKs). It cautiously probes for additional bandwidth.\n   • Multiplicative Decrease: Upon detecting packet loss via 3 Duplicate ACKs, the sender infers mild congestion: it cuts `ssthresh` in half (`ssthresh = cwnd / 2`) and halves `cwnd`.\n4. Fast Retransmit & Fast Recovery:\n   • Fast Retransmit: If 3 duplicate ACKs are received for the same sequence number, the sender does not wait for the slow Retransmission Timeout (RTO) timer to expire; it retransmits the missing segment immediately.\n   • Fast Recovery (TCP Reno): Instead of collapsing `cwnd` back to 1 MSS (Tahoe behavior), Reno sets `cwnd = ssthresh + 3 MSS`, continuing to transmit new data packets while waiting for the ACK of the retransmitted packet, preserving high pipeline throughput.',
    why: 'In October 1986, the early Internet suffered a catastrophic Congestion Collapse: throughput on the 400-mile link between UC Berkeley and Lawrence Berkeley Laboratory collapsed by a factor of 1,000 from 32 Kbps down to 40 bps because unthrottled senders aggressively retransmitted dropped packets, creating an infinite feedback loop of dropped packets.\n\nVan Jacobson\'s congestion control algorithms saved the Internet from collapse. The Additive Increase Multiplicative Decrease (AIMD) algorithm is mathematically proven to be both Efficient and Fair: when competing TCP connections share a bottleneck link, AIMD guarantees that all connections converge on an equal, fair share of the available bandwidth.',
    useCase: 'Modern operating systems use advanced congestion control algorithms tuned for gigabit links. In Linux, TCP CUBIC is the default standard: it replaces traditional linear AIMD with a cubic function of elapsed time since the last congestion event, rapidly accelerating window recovery on high-bandwidth transcontinental fiber links.\n\nGoogle developed TCP BBR (Bottleneck Bandwidth and RTT), a modern model-based congestion control algorithm that monitors actual packet delivery rate rather than treating packet loss as the sole indicator of congestion. BBR achieves dramatically higher throughput and lower bufferbloat latencies on lossy Wi-Fi and mobile 5G networks, and powers all Google services and YouTube streaming.',
    example: `+-----------------------------------------------------------------------------+
|              TCP CONGESTION WINDOW (CWND) TIMELINE GRAPH                    |
+-----------------------------------------------------------------------------+

 CWND (MSS)
  ^
  |                                       [ Severe Loss: TIMEOUT (RTO) ]
32|                                                     * (Drops to 1 MSS!)
  |                                                    /|
28|                               [ Mild Loss: 3 Dup ACKs]
  |                                        *           /|
24|                                       /|\\         / |
  |                                      / | \\       /  |
20|                         ssthresh=16 /  |  \\     /   |
  |                        ------------*   |   *---*    |
16|                       /            |   |   |   |    |
  |                      /             |   |   |   |    |
12|                     /  CONGESTION  |   |   |   |    |
  |                    /   AVOIDANCE   |   |   |   |    |
 8|            *      /   (Linear: +1) |   |   |   |    |
  |           /      /                 |   |   |   |    |
 4|     *    /      /                  |   |   |   |    |
  |    /    /      /                   |   |   |   |    |
 2|   *    /      /                    |   |   |   |    |
  |  /    /      /                     |   |   |   |    |
 1| *----*------*----------------------*---*---*---*----+------------------>
    0    1      2                      3   4   5   6    7       Time (RTTs)
   [ SLOW START ]                     [ FAST RECOVERY ] [ SLOW START ]
   (Exponential:                      (Halves cwnd,      (Reset to 1 MSS
    doubles each RTT)                  keeps rolling)     on timeout)

===============================================================================
ALGORITHM RULES:
  - Slow Start: cwnd < ssthresh  ===> cwnd = cwnd + 1 MSS (doubles every RTT)
  - Congestion Avoidance: cwnd >= ssthresh ===> cwnd = cwnd + (1 / cwnd) per ACK
  - 3 Duplicate ACKs (Mild Loss)  ===> ssthresh = cwnd / 2; cwnd = ssthresh (Reno)
  - Timeout / RTO (Severe Loss)   ===> ssthresh = cwnd / 2; cwnd = 1 MSS (Tahoe)`,
    exampleExplanation: [
      'Time 0-2 RTT (Slow Start): cwnd begins at 1 MSS and doubles every RTT ($1 \\rightarrow 2 \\rightarrow 4 \\rightarrow 8 \\rightarrow 16$).',
      'At cwnd = 16 (ssthresh reached): The algorithm transitions into Congestion Avoidance, switching to safe linear growth ($+1$ MSS per RTT).',
      'Time 4 RTT (3 Duplicate ACKs): Mild congestion detected. Under TCP Reno, ssthresh is set to half ($24 / 2 = 12$) and cwnd enters Fast Recovery without dropping to 1.',
      'Time 7 RTT (Timeout / RTO): Severe congestion where zero ACKs return. cwnd collapses to 1 MSS, and the connection restarts from Slow Start.',
      'Fairness: AIMD guarantees that multiple competing connections converge to a fair share of the bottleneck bandwidth.'
    ],
    interviewQuestions: [
      {
        id: 'cn-9-q1',
        question: 'Explain the four phases of TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery).',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '1. Slow Start: `cwnd` starts at 1-10 MSS and increases by 1 MSS for every received ACK (exponential doubling every RTT) until reaching `ssthresh`.\n2. Congestion Avoidance: Once `cwnd >= ssthresh`, `cwnd` increases linearly by only 1 MSS per RTT (Additive Increase) to probe bandwidth cautiously.\n3. Fast Retransmit: Upon receiving 3 Duplicate ACKs for a segment, the sender assumes packet loss and immediately retransmits the missing segment without waiting for the RTO timer.\n4. Fast Recovery: `ssthresh` is halved (`cwnd / 2`), and `cwnd` is set to `ssthresh` (TCP Reno), continuing linear increase without collapsing back to 1 MSS.'
      },
      {
        id: 'cn-9-q2',
        question: 'Why does AIMD (Additive Increase Multiplicative Decrease) achieve bandwidth fairness among competing connections?',
        companyTags: ['Cisco', 'Qualcomm', 'Apple'],
        frequency: 'Very High',
        answer: 'AIMD can be analyzed on a 2D phase plot of Bandwidth User 1 vs Bandwidth User 2:\n• Additive Increase ($+1, +1$) moves the operating point parallel to the 45-degree fairness line towards the capacity limit.\n• Multiplicative Decrease (halving both by 50%) pulls the operating point along a vector pointing directly toward the origin $(0, 0)$.\n\nThe combination of parallel additive increase and origin-pointing multiplicative decrease mathematically forces the intersection point to converge progressively closer to the 45-degree line of perfect fairness, regardless of initial starting points.'
      },
      {
        id: 'cn-9-q3',
        question: 'What is the difference between TCP Tahoe and TCP Reno when packet loss occurs?',
        companyTags: ['Microsoft', 'Infosys', 'TCS'],
        frequency: 'High',
        answer: '• TCP Tahoe: On ANY packet loss (whether detected by 3 Duplicate ACKs or Timeout), Tahoe sets `ssthresh = cwnd / 2`, drops `cwnd` all the way down to 1 MSS, and restarts in Slow Start. This causes severe throughput dips.\n• TCP Reno: Distinguishes between mild loss (3 Duplicate ACKs) and severe loss (Timeout). On 3 Duplicate ACKs, Reno enters Fast Recovery: sets `ssthresh = cwnd / 2` and `cwnd = ssthresh`, skipping Slow Start and continuing in Congestion Avoidance. It only drops to 1 MSS on a hard timeout.'
      },
      {
        id: 'cn-9-q4',
        question: 'What is Bufferbloat in internet routers, and why does it break traditional TCP congestion control?',
        companyTags: ['Cloudflare', 'Google', 'Akamai'],
        frequency: 'High',
        answer: 'Bufferbloat is the presence of excessively large buffers inside consumer routers and cable modems.\n\nWhy It Breaks TCP: Traditional loss-based TCP (like Reno/CUBIC) increases `cwnd` until a packet is dropped. When routers have gigantic multi-megabyte buffers, packets don\'t drop; they simply sit in router queues for seconds! This causes massive round-trip latency spikes (500ms to 2000ms ping times), destroying video calls and online gaming while TCP falsely believes the network is uncongested.'
      },
      {
        id: 'cn-9-q5',
        question: 'How does Google\'s BBR (Bottleneck Bandwidth and RTT) differ from traditional loss-based congestion control?',
        companyTags: ['Google', 'Meta', 'Netflix'],
        frequency: 'High',
        answer: 'Traditional TCP treats packet loss as synonymous with congestion. On modern networks (Wi-Fi, 5G), packets frequently drop due to wireless radio noise rather than queue congestion, causing traditional TCP to throttle unnecessarily.\n\nBBR is Model-Based: It continuously measures two physical parameters: Maximum Bottleneck Bandwidth ($BtlBw$) and Minimum Round-Trip Time ($RTprop$). It paces packet transmission at the exact physical bottleneck rate, operating at the optimal "Kleinrock Operating Point" with maximum throughput and minimum queue delay, immune to shallow buffer drops.'
      }
    ],
    flashcards: [
      {
        id: 'cn-9-fc1',
        front: 'How does the Congestion Window (cwnd) grow during Slow Start?',
        back: 'Exponentially: cwnd increases by 1 MSS for every received ACK, doubling every RTT.',
        keyTakeaway: 'Slow Start probes network capacity with rapid exponential doubling.'
      },
      {
        id: 'cn-9-fc2',
        front: 'What triggers Fast Retransmit in TCP?',
        back: 'The arrival of 3 Duplicate ACKs for the same sequence number.',
        keyTakeaway: '3 duplicate ACKs trigger immediate retransmission before timeout.'
      },
      {
        id: 'cn-9-fc3',
        front: 'What happens to cwnd in TCP Reno upon receiving 3 Duplicate ACKs?',
        back: 'ssthresh is set to cwnd / 2, and cwnd enters Fast Recovery at ssthresh without dropping to 1 MSS.',
        keyTakeaway: 'TCP Reno avoids collapsing to 1 MSS on mild packet loss.'
      },
      {
        id: 'cn-9-fc4',
        front: 'Why is AIMD mathematically fair for competing network connections?',
        back: 'Additive increase pushes along the capacity boundary, while multiplicative decrease forces convergence toward equal sharing.',
        keyTakeaway: 'AIMD guarantees convergence to fair bandwidth allocation.'
      },
      {
        id: 'cn-9-fc5',
        front: 'What is Bufferbloat in internet routers?',
        back: 'Excessively large router buffers delaying packets for seconds without dropping them, causing massive latency spikes.',
        keyTakeaway: 'Bufferbloat causes extreme latency without loss signals.'
      }
    ]
  },
  {
    id: 'cn-10',
    subjectId: 'cn',
    order: 10,
    title: 'Application Layer: DNS Resolution, HTTP/2, HTTP/3 (QUIC) & Web Protocols',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine ordering books from an online bookstore across generations. In HTTP/1.0, to buy 4 books, you dial the bookstore phone, order Book 1, and hang up. Then you dial again for Book 2, and hang up. In HTTP/1.1 with Pipelining, you order all 4 books in one phone call, but if the warehouse worker can\'t find Book 1 on the shelf, the entire shipping conveyor belt stops moving, and Books 2, 3, and 4 are blocked behind it (Head-of-Line Blocking). HTTP/2 is like packing all 4 books into separate numbered boxes and sending them all simultaneously down a multi-lane conveyor belt inside one truck (Binary Multiplexing). HTTP/3 (QUIC) is like putting each book into its own independent delivery drone flying through the air over UDP: if Drone 1 gets hit by a bird, Drones 2, 3, and 4 land at your doorstep on time without waiting.',
    what: 'The Application Layer (Layer 7) contains the high-level communication protocols that end-user software applications use to exchange structured messages over the network.\n\nTwo foundational pillars govern the modern web:\n1. Domain Name System (DNS): The hierarchical, decentralized naming directory that translates human-readable hostnames (`api.commitdrive.com`) into routable IP addresses (`142.250.190.46`).\n   • Hierarchy: Root Name Servers (`.`, 13 named authorities replicated globally via Anycast) $\\rightarrow$ Top-Level Domain (TLD) Servers (`.com`, `.org`) $\\rightarrow$ Authoritative Name Servers (managing specific domain records: A, AAAA, CNAME, MX, TXT).\n   • Resolution: Recursive Queries (client asks local resolver to do all work) vs Iterative Queries (resolver queries Root, TLD, and Authoritative servers step-by-step).\n2. Hypertext Transfer Protocol (HTTP) Evolution:\n   • HTTP/1.1 (RFC 2616): Plaintext ASCII protocol. Introduced persistent TCP connections (`Keep-Alive`), but suffered from Head-of-Line (HoL) Blocking: requests on a single TCP connection had to be answered strictly in first-in-first-out order. Browsers worked around this by opening 6 parallel TCP connections per domain.\n   • HTTP/2 (RFC 7540): Replaced plaintext with a Binary Framing Layer. Introduced Request/Response Multiplexing: multiple independent streams interleaved concurrently over a single TCP connection, along with Header Compression (HPACK) and Server Push. However, it still suffered from TCP-level Head-of-Line blocking (a single lost TCP packet stalled all interleaved streams).\n   • HTTP/3 (RFC 9114): Replaced TCP with QUIC over UDP. Streams are independent at the transport layer, eliminating TCP-level HoL blocking entirely, while integrating TLS 1.3 encryption for 0-RTT/1-RTT connection handshakes.',
    why: 'Web performance directly impacts global business revenue: studies by Amazon and Google proved that every 100 milliseconds of additional latency reduces user engagement and e-commerce conversions by 1%.\n\nThe evolution from HTTP/1.1 to HTTP/2 and HTTP/3 eliminated the fundamental latency bottlenecks of the web: handshake delays, redundant header transfers, and head-of-line blocking, allowing complex web applications with hundreds of images, scripts, and API assets to load instantaneously on high-latency mobile networks.',
    useCase: 'Modern Single-Page Applications (React, Next.js) load hundreds of modular JavaScript chunks, CSS files, and REST API payloads. Under HTTP/1.1, loading 100 assets required 100 separate round trips or heavy bundlers creating massive multi-megabyte JavaScript files.\n\nUnder HTTP/2 and HTTP/3, the browser opens a single connection to the server or CDN edge (Cloudflare, Fastly). All 100 assets are multiplexed concurrently across binary streams. If a user switches from home Wi-Fi to a 5G cellular tower, HTTP/3\'s QUIC connection migration keeps streaming video active without dropping the connection or buffering.',
    example: `+-----------------------------------------------------------------------------+
|        HTTP EVOLUTION: HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC OVER UDP)         |
+-----------------------------------------------------------------------------+

1. HTTP/1.1: Head-of-Line Blocking (Sequential Requests over TCP)
   [ Client ]                                                    [ Server ]
      | ----- GET /style.css -------------------------------------> |
      | <==== style.css delivered ================================= |
      | ----- GET /script.js (BLOCKED until style.css finishes!) -> |
      | <==== script.js delivered ================================= |

2. HTTP/2: Binary Framing & Multiplexing over a SINGLE TCP Connection
   [ Client ]                                                    [ Server ]
      | === [ Stream 1: style.css ] + [ Stream 3: script.js ] ====> |
      | <== [ Frame: script.js ] + [ Frame: style.css ] =========== |
   * Flaw: If ONE packet drops at the TCP layer, ALL multiplexed streams stall!

3. HTTP/3: Independent QUIC Streams over UDP (Zero Head-of-Line Blocking!)
   [ Client ]                                                    [ Server ]
      | --- QUIC Stream 1 (style.css) over UDP -------------------> |
      | --- QUIC Stream 3 (script.js) over UDP -------------------> |
      |                                                             |
   * If Stream 1 packet drops, Stream 3 CONTINUES DELIVERING UNINTERRUPTED!

===============================================================================
DNS ITERATIVE RESOLUTION FLOW (Resolving "commitdrive.com"):
  Browser -> Local DNS Resolver (Recursive)
    |
    +--> Step 1: Query Root DNS Server (".")      ===> Returns .com TLD Server IP
    +--> Step 2: Query TLD DNS Server (".com")    ===> Returns Authoritative NS IP
    +--> Step 3: Query Authoritative DNS Server  ===> Returns Host IP (A Record)`,
    exampleExplanation: [
      'HTTP/1.1: Requests must wait for the preceding response to finish, forcing browsers to open multiple parallel TCP connections.',
      'HTTP/2: Divides data into binary frames with Stream IDs, multiplexing dozens of assets across one TCP connection.',
      'HTTP/2 Flaw: Because TCP enforces in-order byte delivery, a single dropped packet stalls the TCP socket buffer for all streams.',
      'HTTP/3 (QUIC): Transports independent streams over UDP datagrams. Dropping a packet on Stream 1 has zero impact on Stream 3.',
      'DNS Iteration: The local recursive resolver queries the Root, TLD, and Authoritative servers iteratively to resolve the domain to an IP address.'
    ],
    interviewQuestions: [
      {
        id: 'cn-10-q1',
        question: 'What happens in the network stack from the moment you type "https://www.google.com" into a browser and press Enter?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '1. URL Parsing & DNS: Browser checks local cache, then queries DNS resolver (Root -> TLD -> Authoritative) to resolve hostname to an IP address.\n2. ARP Lookup: Resolves the gateway router\'s MAC address.\n3. TCP Handshake: 3-way handshake (SYN, SYN-ACK, ACK) on port 443.\n4. TLS Handshake: Negotiates cipher suites, validates server certificate, and establishes symmetric AES session keys.\n5. HTTP Request: Browser sends `GET / HTTP/2` request.\n6. Server Processing: Web server processes request and returns HTTP 200 with HTML payload.\n7. Browser Rendering: Parses DOM tree, CSSOM tree, executes JavaScript, and requests sub-resources.'
      },
      {
        id: 'cn-10-q2',
        question: 'What are the key differences between HTTP/1.1, HTTP/2, and HTTP/3?',
        companyTags: ['Cloudflare', 'Meta', 'Netflix'],
        frequency: 'Very High',
        answer: '• HTTP/1.1: Plaintext protocol. One request-response at a time per TCP connection (suffer from HTTP-level head-of-line blocking). Heavy uncompressed headers.\n• HTTP/2: Binary protocol over TCP. Multiplexes multiple requests/responses as interleaved frames over a single TCP connection. HPACK header compression. Still suffers from TCP-level head-of-line blocking.\n• HTTP/3: Uses QUIC over UDP. Eliminates TCP head-of-line blocking (streams are independent at transport layer). Built-in TLS 1.3 with 0-RTT handshakes. Connection migration across networks.'
      },
      {
        id: 'cn-10-q3',
        question: 'What is the difference between Recursive and Iterative DNS queries?',
        companyTags: ['Cisco', 'Apple', 'TCS'],
        frequency: 'High',
        answer: '• Recursive Query: The client (e.g. your computer) asks the Local DNS Resolver to find the complete answer, placing the entire resolution burden on the resolver. The resolver must return either the final IP or an error.\n• Iterative Query: The resolver queries name servers step-by-step. The queried server does not perform further lookups; it immediately responds with the best answer it has or a referral pointer to the next name server down the hierarchy (Root -> TLD -> Authoritative).'
      },
      {
        id: 'cn-10-q4',
        question: 'What are the standard DNS Record types (A, AAAA, CNAME, MX, TXT)?',
        companyTags: ['Amazon', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: '• A Record: Maps a hostname to an IPv4 address (e.g. `example.com` -> `93.184.216.34`).\n• AAAA Record: Maps a hostname to an IPv6 address.\n• CNAME (Canonical Name): An alias mapping one domain name to another domain name (e.g. `www.example.com` -> `example.com`).\n• MX (Mail Exchange): Directs incoming domain email to mail servers with priority weights.\n• TXT Record: Holds arbitrary text metadata, used for email security (SPF, DKIM, DMARC) and domain ownership verification.'
      },
      {
        id: 'cn-10-q5',
        question: 'What is the difference between WebSockets and HTTP/2 Server Push?',
        companyTags: ['Uber', 'Salesforce', 'Cognizant'],
        frequency: 'Medium',
        answer: '• WebSockets: A full-duplex, persistent bidirectional communication protocol operating over a single TCP socket. After an initial HTTP upgrade handshake, either client or server can transmit raw data frames at any time with minimal overhead (ideal for live chat, gaming, real-time stock feeds).\n• HTTP/2 Server Push: An optimization where the server proactively pushes secondary assets (like `style.css`) to the browser\'s cache before the browser parses the HTML and requests them. It is strictly for asset caching, not general bidirectional application messaging.'
      }
    ],
    flashcards: [
      {
        id: 'cn-10-fc1',
        front: 'What is Head-of-Line (HoL) Blocking in HTTP/1.1 vs HTTP/2 vs HTTP/3?',
        back: 'In HTTP/1.1, early slow requests block later requests. In HTTP/2, dropped TCP packets block all streams. In HTTP/3, streams are independent over UDP.',
        keyTakeaway: 'HTTP/3 eliminates both HTTP and transport layer head-of-line blocking.'
      },
      {
        id: 'cn-10-fc2',
        front: 'What is the difference between an A Record and a CNAME Record in DNS?',
        back: 'An A record maps a hostname to an IPv4 address; a CNAME maps an alias domain to another domain name.',
        keyTakeaway: 'A records map to IP addresses; CNAMEs alias to domain names.'
      },
      {
        id: 'cn-10-fc3',
        front: 'How does HTTP/2 achieve multiplexing on a single TCP connection?',
        back: 'By breaking requests into binary frames tagged with unique Stream IDs that can be interleaved and reassembled.',
        keyTakeaway: 'Binary framing enables concurrent streams over one connection.'
      },
      {
        id: 'cn-10-fc4',
        front: 'What transport protocol does HTTP/3 use?',
        back: 'QUIC running directly over UDP.',
        keyTakeaway: 'HTTP/3 replaces TCP with QUIC over UDP.'
      },
      {
        id: 'cn-10-fc5',
        front: 'What is DNS Anycast, and why do Root DNS servers use it?',
        back: 'Announcing the same IP address from hundreds of global locations, routing users automatically to the closest physical server.',
        keyTakeaway: 'Anycast distributes DNS query load across global points of presence.'
      }
    ]
  }
];
