import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Quiz, Question, Module, Course

db = SessionLocal()

def clear_and_seed_questions(module_title: str, questions_data: list):
    module = db.query(Module).filter(Module.title == module_title).first()
    if not module:
        print(f"  ⚠️  Module not found: {module_title}")
        return

    quiz = db.query(Quiz).filter(Quiz.module_id == module.id).first()
    if not quiz:
        print(f"  ⚠️  No quiz for: {module_title}")
        return

    # Delete existing questions
    db.query(Question).filter(Question.quiz_id == quiz.id).delete()

    # Add new questions
    for q in questions_data:
        question = Question(
            quiz_id=quiz.id,
            text=q["text"],
            option_a=q["a"],
            option_b=q["b"],
            option_c=q["c"],
            option_d=q["d"],
            correct_option=q["correct"],
            explanation=q["explanation"]
        )
        db.add(question)

    db.commit()
    print(f"  ✓ {module_title}")


# ══════════════════════════════════════════════
# DSA - Data Structures & Algorithms
# ══════════════════════════════════════════════

clear_and_seed_questions("Introduction to DSA", [
    {
        "text": "What is the time complexity of accessing an element in an array by index?",
        "a": "O(n)", "b": "O(log n)", "c": "O(1)", "d": "O(n²)",
        "correct": "C",
        "explanation": "Array access by index is O(1) because arrays store elements in contiguous memory, allowing direct calculation of any element's address."
    },
    {
        "text": "Which data structure follows the LIFO (Last In, First Out) principle?",
        "a": "Queue", "b": "Stack", "c": "Linked List", "d": "Tree",
        "correct": "B",
        "explanation": "A Stack follows LIFO — the last element pushed onto the stack is the first one to be popped off, like a stack of plates."
    },
    {
        "text": "What is the space complexity of an algorithm that uses a fixed number of variables regardless of input size?",
        "a": "O(n)", "b": "O(n²)", "c": "O(log n)", "d": "O(1)",
        "correct": "D",
        "explanation": "O(1) space complexity means the algorithm uses constant space — it doesn't grow with input size, only using a fixed number of variables."
    },
    {
        "text": "Which of the following best describes Big O notation?",
        "a": "Exact running time of an algorithm", "b": "Best-case performance", "c": "Upper bound on time/space growth", "d": "Average-case performance",
        "correct": "C",
        "explanation": "Big O notation describes the upper bound of an algorithm's growth rate — the worst-case scenario for time or space as input grows."
    },
    {
        "text": "What is the time complexity of binary search on a sorted array of n elements?",
        "a": "O(n)", "b": "O(n log n)", "c": "O(1)", "d": "O(log n)",
        "correct": "D",
        "explanation": "Binary search halves the search space at each step, giving O(log n) time complexity — far more efficient than linear search for sorted data."
    },
])

clear_and_seed_questions("Arrays & Strings", [
    {
        "text": "Given an array of integers, what is the most efficient way to find if two numbers sum to a target value?",
        "a": "Nested loops — O(n²)", "b": "Hash map — O(n)", "c": "Sort then search — O(n log n)", "d": "Binary search — O(log n)",
        "correct": "B",
        "explanation": "Using a hash map, we store each number and check if (target - current) exists in O(1) lookup, giving overall O(n) time complexity."
    },
    {
        "text": "What is the result of reversing the string 'algorithm' in place?",
        "a": "mhtirogla", "b": "algorithm", "c": "mhtirogla", "d": "alogirthm",
        "correct": "A",
        "explanation": "Reversing 'algorithm' gives 'mhtirogla' — swap characters from both ends moving toward the center until they meet."
    },
    {
        "text": "Which operation on a dynamic array (ArrayList) has amortized O(1) time complexity?",
        "a": "Insert at beginning", "b": "Delete from middle", "c": "Append to end", "d": "Search by value",
        "correct": "C",
        "explanation": "Appending to the end of a dynamic array is amortized O(1) because although occasional resizing takes O(n), it happens rarely enough that the average cost per operation is constant."
    },
    {
        "text": "What does it mean for an array to be contiguous in memory?",
        "a": "Elements are sorted in order", "b": "Elements are stored in adjacent memory locations", "c": "Elements have the same data type", "d": "Elements are linked by pointers",
        "correct": "B",
        "explanation": "Contiguous memory means all array elements are stored in adjacent (side-by-side) memory locations, enabling O(1) random access using index arithmetic."
    },
    {
        "text": "What is the time complexity of inserting an element at the beginning of an array of size n?",
        "a": "O(1)", "b": "O(log n)", "c": "O(n)", "d": "O(n²)",
        "correct": "C",
        "explanation": "Inserting at the beginning requires shifting all n existing elements one position to the right to make room, resulting in O(n) time complexity."
    },
])

clear_and_seed_questions("Linked Lists", [
    {
        "text": "What is the main advantage of a linked list over an array?",
        "a": "Faster random access", "b": "Less memory usage", "c": "Dynamic size and efficient insertions/deletions", "d": "Better cache performance",
        "correct": "C",
        "explanation": "Linked lists can grow/shrink dynamically and insert/delete in O(1) when you have a reference to the node, without shifting elements like arrays require."
    },
    {
        "text": "In a singly linked list, what does each node contain?",
        "a": "Data only", "b": "Data and a pointer to the next node", "c": "Data and pointers to both next and previous nodes", "d": "Only a pointer to the next node",
        "correct": "B",
        "explanation": "A singly linked list node contains its data value and a single pointer (reference) to the next node in the sequence. Doubly linked lists have both next and previous pointers."
    },
    {
        "text": "What is the time complexity of searching for an element in an unsorted linked list?",
        "a": "O(1)", "b": "O(log n)", "c": "O(n)", "d": "O(n log n)",
        "correct": "C",
        "explanation": "Searching a linked list requires traversing from the head node one by one until the element is found or the list ends, giving O(n) worst-case time."
    },
    {
        "text": "Which technique is commonly used to detect a cycle in a linked list?",
        "a": "Binary search", "b": "Hash table", "c": "Floyd's Cycle Detection (slow/fast pointers)", "d": "Merge sort",
        "correct": "C",
        "explanation": "Floyd's algorithm uses two pointers moving at different speeds. If a cycle exists, the fast pointer will eventually meet the slow pointer inside the cycle."
    },
    {
        "text": "What is the time complexity of deleting a node from the middle of a doubly linked list, given a pointer to that node?",
        "a": "O(n)", "b": "O(log n)", "c": "O(n²)", "d": "O(1)",
        "correct": "D",
        "explanation": "With a direct pointer to the node, deletion in a doubly linked list is O(1) — just update the previous node's next pointer and next node's previous pointer."
    },
])

clear_and_seed_questions("Stacks & Queues", [
    {
        "text": "Which data structure is best for implementing a browser's back button functionality?",
        "a": "Queue", "b": "Stack", "c": "Heap", "d": "Graph",
        "correct": "B",
        "explanation": "A stack is perfect for browser history — each page visited is pushed on the stack, and the back button pops the most recent page (LIFO behavior)."
    },
    {
        "text": "In a queue, where are elements inserted and removed?",
        "a": "Inserted and removed from the front", "b": "Inserted at front, removed from back", "c": "Inserted at back, removed from front", "d": "Inserted and removed from the back",
        "correct": "C",
        "explanation": "Queues follow FIFO (First In, First Out) — new elements enqueue at the rear/back, and elements dequeue from the front, like a real-world queue."
    },
    {
        "text": "What happens when you attempt to pop from an empty stack?",
        "a": "Returns null", "b": "Returns 0", "c": "Stack overflow", "d": "Stack underflow",
        "correct": "D",
        "explanation": "Popping from an empty stack causes a stack underflow error — there are no elements to remove. This must be checked before performing pop operations."
    },
    {
        "text": "Which algorithm uses a queue as its primary data structure?",
        "a": "Depth-First Search (DFS)", "b": "Dijkstra's algorithm", "c": "Breadth-First Search (BFS)", "d": "Quick Sort",
        "correct": "C",
        "explanation": "BFS uses a queue to explore nodes level by level — it enqueues neighbors before exploring deeper, ensuring shortest path in unweighted graphs."
    },
    {
        "text": "What is a deque (double-ended queue)?",
        "a": "A queue that allows duplicates", "b": "A queue where insertion and deletion can happen at both ends", "c": "A queue implemented with two stacks", "d": "A priority queue",
        "correct": "B",
        "explanation": "A deque allows insertion and deletion at both the front and rear, combining the functionality of both stacks and queues into one flexible data structure."
    },
])

clear_and_seed_questions("Trees & BST", [
    {
        "text": "In a Binary Search Tree (BST), where is a new node with a value smaller than the root placed?",
        "a": "Right subtree", "b": "Left subtree", "c": "At the root", "d": "At a random position",
        "correct": "B",
        "explanation": "BST property: all nodes in the left subtree have values less than the parent, and all nodes in the right subtree have values greater. Smaller values go left."
    },
    {
        "text": "What traversal of a BST produces elements in sorted (ascending) order?",
        "a": "Pre-order", "b": "Post-order", "c": "In-order", "d": "Level-order",
        "correct": "C",
        "explanation": "In-order traversal (Left → Root → Right) of a BST visits nodes in ascending sorted order because it always processes the smaller left subtree first."
    },
    {
        "text": "What is the height of a balanced binary tree with n nodes?",
        "a": "O(n)", "b": "O(n²)", "c": "O(1)", "d": "O(log n)",
        "correct": "D",
        "explanation": "A balanced binary tree has height O(log n) because each level doubles the number of nodes, so n nodes need about log₂(n) levels."
    },
    {
        "text": "Which property defines an AVL tree?",
        "a": "All leaf nodes are at the same level", "b": "Each node has exactly two children", "c": "The height difference between left and right subtrees of any node is at most 1", "d": "The tree is always a complete binary tree",
        "correct": "C",
        "explanation": "An AVL tree is a self-balancing BST where the balance factor (height difference between left and right subtrees) of every node is -1, 0, or +1."
    },
    {
        "text": "What is the worst-case time complexity of search in an unbalanced BST?",
        "a": "O(log n)", "b": "O(1)", "c": "O(n log n)", "d": "O(n)",
        "correct": "D",
        "explanation": "In the worst case (a skewed tree where all nodes are in a line), a BST degenerates to a linked list, making search O(n) — same as linear search."
    },
])

clear_and_seed_questions("Hash Tables", [
    {
        "text": "What is the average time complexity for search, insert, and delete operations in a hash table?",
        "a": "O(n)", "b": "O(log n)", "c": "O(n log n)", "d": "O(1)",
        "correct": "D",
        "explanation": "Hash tables provide O(1) average time for search, insert, and delete by using a hash function to map keys directly to array indices."
    },
    {
        "text": "What is a hash collision?",
        "a": "When two keys have the same value", "b": "When the hash table is full", "c": "When two different keys produce the same hash index", "d": "When a key is not found in the table",
        "correct": "C",
        "explanation": "A collision occurs when the hash function maps two different keys to the same array index. Good hash tables handle this with chaining or open addressing."
    },
    {
        "text": "Which collision resolution technique uses linked lists at each bucket?",
        "a": "Open addressing", "b": "Linear probing", "c": "Separate chaining", "d": "Double hashing",
        "correct": "C",
        "explanation": "Separate chaining stores all elements that hash to the same index in a linked list at that bucket, allowing multiple elements per index."
    },
    {
        "text": "What is the load factor of a hash table?",
        "a": "The size of the hash table", "b": "The ratio of stored elements to total table size", "c": "The number of collisions", "d": "The time to compute the hash function",
        "correct": "B",
        "explanation": "Load factor = (number of elements) / (table size). A load factor above 0.7 typically triggers resizing to maintain O(1) average performance."
    },
    {
        "text": "Which real-world application commonly uses hash tables?",
        "a": "Sorting large datasets", "b": "Finding shortest paths in graphs", "c": "Database indexing and caching", "d": "Compressing files",
        "correct": "C",
        "explanation": "Hash tables are widely used in database indexing for fast lookups, and in caching systems (like Redis) for O(1) key-value storage and retrieval."
    },
])

clear_and_seed_questions("Graphs & Traversal", [
    {
        "text": "What is the difference between BFS and DFS graph traversal?",
        "a": "BFS uses a stack, DFS uses a queue", "b": "BFS explores level by level using a queue, DFS explores depth-first using a stack", "c": "BFS is only for trees, DFS is for graphs", "d": "They are the same algorithm",
        "correct": "B",
        "explanation": "BFS uses a queue to explore all neighbors at the current level before going deeper. DFS uses a stack (or recursion) to explore as far as possible along each branch."
    },
    {
        "text": "Which graph representation is more space-efficient for sparse graphs?",
        "a": "Adjacency matrix", "b": "Incidence matrix", "c": "Adjacency list", "d": "Edge list",
        "correct": "C",
        "explanation": "Adjacency lists use O(V+E) space, while adjacency matrices use O(V²). For sparse graphs (few edges), adjacency lists are far more memory-efficient."
    },
    {
        "text": "Dijkstra's algorithm is used to find:",
        "a": "The minimum spanning tree", "b": "The shortest path from a source to all other vertices", "c": "Whether a graph is connected", "d": "All cycles in a graph",
        "correct": "B",
        "explanation": "Dijkstra's algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights."
    },
    {
        "text": "What does it mean for a graph to be acyclic?",
        "a": "It has no vertices", "b": "It has no edges", "c": "It contains no cycles (no path from a vertex back to itself)", "d": "It is not connected",
        "correct": "C",
        "explanation": "An acyclic graph has no cycles — there is no sequence of edges that forms a closed loop. Trees are examples of directed acyclic graphs (DAGs)."
    },
    {
        "text": "What is a topological sort used for?",
        "a": "Sorting numbers efficiently", "b": "Finding shortest paths", "c": "Ordering tasks with dependencies in a DAG", "d": "Detecting cycles in undirected graphs",
        "correct": "C",
        "explanation": "Topological sort linearly orders vertices of a DAG such that for every edge (u,v), u comes before v. It's used in task scheduling, build systems, and course prerequisites."
    },
])

clear_and_seed_questions("Sorting & Searching", [
    {
        "text": "Which sorting algorithm has the best average-case time complexity?",
        "a": "Bubble Sort — O(n²)", "b": "Insertion Sort — O(n²)", "c": "Merge Sort — O(n log n)", "d": "Selection Sort — O(n²)",
        "correct": "C",
        "explanation": "Merge Sort consistently achieves O(n log n) in all cases (best, average, worst) by dividing the array in half and merging sorted halves — making it very efficient."
    },
    {
        "text": "When is binary search applicable?",
        "a": "Only on linked lists", "b": "Only on sorted arrays or lists", "c": "On any unsorted collection", "d": "Only on trees",
        "correct": "B",
        "explanation": "Binary search requires the data to be sorted. It works by comparing the target to the middle element and discarding half the search space at each step."
    },
    {
        "text": "What is the key difference between Quick Sort and Merge Sort?",
        "a": "Quick Sort is stable, Merge Sort is not", "b": "Quick Sort uses extra memory, Merge Sort does not", "c": "Quick Sort partitions in-place, Merge Sort requires extra space for merging", "d": "Quick Sort is always faster",
        "correct": "C",
        "explanation": "Quick Sort is an in-place algorithm (O(log n) stack space), while Merge Sort requires O(n) extra space for the temporary arrays used during merging."
    },
    {
        "text": "What is the worst-case time complexity of Quick Sort?",
        "a": "O(n log n)", "b": "O(n)", "c": "O(n²)", "d": "O(log n)",
        "correct": "C",
        "explanation": "Quick Sort's worst case is O(n²) when the pivot is always the smallest or largest element (e.g., already sorted array with first element as pivot), causing unbalanced partitions."
    },
    {
        "text": "Which sorting algorithm is most efficient for nearly sorted data?",
        "a": "Merge Sort", "b": "Quick Sort", "c": "Heap Sort", "d": "Insertion Sort",
        "correct": "D",
        "explanation": "Insertion Sort is O(n) for nearly sorted data because it performs very few swaps — each element only moves a short distance to its correct position."
    },
])


# ══════════════════════════════════════════════
# NETWORKS - Computer Networks
# ══════════════════════════════════════════════

clear_and_seed_questions("Network Fundamentals", [
    {
        "text": "What is the primary purpose of a computer network?",
        "a": "To increase CPU speed", "b": "To enable resource sharing and communication between devices", "c": "To store large amounts of data", "d": "To run applications faster",
        "correct": "B",
        "explanation": "Computer networks enable multiple devices to share resources (printers, files, internet) and communicate with each other efficiently across distances."
    },
    {
        "text": "What does LAN stand for and what area does it typically cover?",
        "a": "Large Area Network — citywide", "b": "Local Area Network — a building or campus", "c": "Linked Access Node — a single room", "d": "Low Bandwidth Network — rural areas",
        "correct": "B",
        "explanation": "LAN (Local Area Network) covers a small geographic area like a home, office, or campus, offering high-speed connections between nearby devices."
    },
    {
        "text": "Which device operates at the Network layer and forwards packets between networks?",
        "a": "Hub", "b": "Switch", "c": "Router", "d": "Repeater",
        "correct": "C",
        "explanation": "Routers operate at Layer 3 (Network layer) and use IP addresses to forward packets between different networks, connecting LANs to the internet."
    },
    {
        "text": "What is bandwidth in the context of computer networks?",
        "a": "The physical length of a cable", "b": "The maximum data transfer rate of a network link", "c": "The number of devices on a network", "d": "The delay in data transmission",
        "correct": "B",
        "explanation": "Bandwidth is the maximum rate at which data can be transmitted over a network connection, typically measured in Mbps or Gbps."
    },
    {
        "text": "What is the difference between a hub and a switch?",
        "a": "Hubs are faster than switches", "b": "A hub broadcasts to all ports, a switch directs traffic to specific ports using MAC addresses", "c": "Switches connect networks, hubs connect devices", "d": "There is no difference",
        "correct": "B",
        "explanation": "Hubs broadcast incoming data to all connected ports (wasteful), while switches learn MAC addresses and forward data only to the intended destination port (efficient)."
    },
])

clear_and_seed_questions("OSI Model", [
    {
        "text": "How many layers does the OSI model have?",
        "a": "4", "b": "5", "c": "6", "d": "7",
        "correct": "D",
        "explanation": "The OSI (Open Systems Interconnection) model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application."
    },
    {
        "text": "Which OSI layer is responsible for end-to-end communication and error recovery?",
        "a": "Network Layer (Layer 3)", "b": "Transport Layer (Layer 4)", "c": "Session Layer (Layer 5)", "d": "Data Link Layer (Layer 2)",
        "correct": "B",
        "explanation": "The Transport layer provides end-to-end communication, error detection, flow control, and data segmentation. TCP and UDP operate at this layer."
    },
    {
        "text": "At which OSI layer does a network switch primarily operate?",
        "a": "Layer 1 — Physical", "b": "Layer 3 — Network", "c": "Layer 4 — Transport", "d": "Layer 2 — Data Link",
        "correct": "D",
        "explanation": "Switches operate at Layer 2 (Data Link) using MAC addresses to forward frames to the correct port. Layer 3 switches also handle IP routing."
    },
    {
        "text": "What is the unit of data called at the Network layer (Layer 3)?",
        "a": "Bit", "b": "Frame", "c": "Segment", "d": "Packet",
        "correct": "D",
        "explanation": "Data units by layer: Layer 1=Bits, Layer 2=Frames, Layer 3=Packets, Layer 4=Segments. Routers process packets at the Network layer."
    },
    {
        "text": "Which layer of the OSI model handles data encryption and compression?",
        "a": "Application Layer", "b": "Session Layer", "c": "Presentation Layer", "d": "Transport Layer",
        "correct": "C",
        "explanation": "The Presentation layer (Layer 6) handles data formatting, encryption, decryption, and compression — ensuring data is in a usable format for the application layer."
    },
])

clear_and_seed_questions("TCP/IP Protocol Suite", [
    {
        "text": "What does the TCP three-way handshake consist of?",
        "a": "SYN, SYN-ACK, ACK", "b": "ACK, SYN, FIN", "c": "SYN, ACK, FIN", "d": "HELLO, READY, CONFIRM",
        "correct": "A",
        "explanation": "TCP establishes connections with a three-way handshake: client sends SYN, server responds with SYN-ACK, client confirms with ACK. This ensures both sides are ready."
    },
    {
        "text": "What is the key difference between TCP and UDP?",
        "a": "TCP is faster than UDP", "b": "UDP uses IP addresses, TCP does not", "c": "TCP provides reliable, ordered delivery; UDP is connectionless and faster but unreliable", "d": "They are used for different network types",
        "correct": "C",
        "explanation": "TCP guarantees delivery, ordering, and error checking but adds overhead. UDP is lightweight and fast (used for streaming, gaming) but doesn't guarantee delivery."
    },
    {
        "text": "Which IP address range is reserved for private networks (not routable on the internet)?",
        "a": "192.168.0.0 – 192.168.255.255", "b": "8.8.8.0 – 8.8.8.255", "c": "172.217.0.0 – 172.217.255.255", "d": "1.0.0.0 – 1.255.255.255",
        "correct": "A",
        "explanation": "192.168.x.x is one of three private IP ranges (along with 10.x.x.x and 172.16-31.x.x) defined in RFC 1918 — used in home/office networks and not routed on the public internet."
    },
    {
        "text": "What is the purpose of NAT (Network Address Translation)?",
        "a": "Encrypting network traffic", "b": "Converting domain names to IP addresses", "c": "Allowing multiple devices with private IPs to share one public IP", "d": "Assigning IP addresses automatically",
        "correct": "C",
        "explanation": "NAT allows an entire home or office network with private IP addresses to share one public IP address when accessing the internet, conserving the limited IPv4 address space."
    },
    {
        "text": "What does DHCP do in a network?",
        "a": "Resolves domain names to IP addresses", "b": "Encrypts data in transit", "c": "Routes packets between networks", "d": "Automatically assigns IP addresses to devices on a network",
        "correct": "D",
        "explanation": "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, gateways, and DNS servers to devices when they join a network."
    },
])

clear_and_seed_questions("Routing & Switching", [
    {
        "text": "What is the purpose of a routing table?",
        "a": "To store MAC addresses of connected devices", "b": "To log all network traffic", "c": "To store paths/routes to reach different network destinations", "d": "To manage IP address allocation",
        "correct": "C",
        "explanation": "A routing table contains a list of network destinations and the best path (next hop) to reach each one, used by routers to forward packets correctly."
    },
    {
        "text": "What is the difference between static and dynamic routing?",
        "a": "Static routing is faster for all networks", "b": "Static routes are manually configured; dynamic routing uses protocols to automatically discover routes", "c": "Dynamic routing only works on LANs", "d": "Static routing requires more bandwidth",
        "correct": "B",
        "explanation": "Static routing requires an administrator to manually enter routes, while dynamic routing protocols (like OSPF, RIP, BGP) automatically discover and update routes as the network changes."
    },
    {
        "text": "What does VLAN stand for and what is its main benefit?",
        "a": "Virtual LAN — logically segments a network without physical separation", "b": "Virtual Link Access Node — connects multiple routers", "c": "Variable Length Area Network — adapts to network size", "d": "Verified Local Area Network — a secured network",
        "correct": "A",
        "explanation": "VLANs (Virtual LANs) logically segment a network into separate broadcast domains on the same physical switch, improving security and reducing broadcast traffic."
    },
    {
        "text": "Which routing protocol is used for routing between different autonomous systems on the internet?",
        "a": "OSPF", "b": "RIP", "c": "EIGRP", "d": "BGP",
        "correct": "D",
        "explanation": "BGP (Border Gateway Protocol) is the internet's routing protocol, used between different autonomous systems (ISPs, large organizations) to exchange routing information globally."
    },
    {
        "text": "What is the Spanning Tree Protocol (STP) designed to prevent?",
        "a": "IP address conflicts", "b": "Unauthorized network access", "c": "Broadcast storms caused by switching loops", "d": "Packet loss during transmission",
        "correct": "C",
        "explanation": "STP prevents broadcast storms by detecting and blocking redundant paths that could create switching loops, while still allowing failover if the primary path fails."
    },
])

clear_and_seed_questions("Network Security", [
    {
        "text": "What is a firewall's primary function?",
        "a": "Speed up network traffic", "b": "Assign IP addresses", "c": "Monitor and control incoming and outgoing network traffic based on security rules", "d": "Compress data for faster transmission",
        "correct": "C",
        "explanation": "A firewall enforces security policies by filtering network traffic — allowing legitimate traffic and blocking unauthorized access based on rules (IP, port, protocol)."
    },
    {
        "text": "What type of attack floods a server with traffic to make it unavailable?",
        "a": "Man-in-the-Middle", "b": "SQL Injection", "c": "Phishing", "d": "Denial of Service (DoS)",
        "correct": "D",
        "explanation": "A DoS (Denial of Service) attack overwhelms a server with excessive requests, exhausting its resources and making it unavailable to legitimate users."
    },
    {
        "text": "What does SSL/TLS provide in network communications?",
        "a": "Faster data transmission", "b": "IP address management", "c": "Encrypted, authenticated communication over a network", "d": "Automatic routing",
        "correct": "C",
        "explanation": "SSL/TLS provides encryption (data privacy), authentication (verifying server identity), and integrity (ensuring data isn't tampered with) for network communications."
    },
    {
        "text": "What is a VPN (Virtual Private Network) used for?",
        "a": "Creating a public WiFi hotspot", "b": "Creating an encrypted tunnel over a public network to ensure secure communication", "c": "Increasing internet speed", "d": "Blocking advertisements",
        "correct": "B",
        "explanation": "A VPN encrypts all traffic and routes it through a secure tunnel, allowing users to securely access private networks over the public internet and masking their IP address."
    },
    {
        "text": "Which security protocol is used to securely access remote servers over an unsecured network?",
        "a": "FTP", "b": "Telnet", "c": "SSH (Secure Shell)", "d": "HTTP",
        "correct": "C",
        "explanation": "SSH provides encrypted command-line access to remote systems, replacing insecure protocols like Telnet that transmit data (including passwords) in plain text."
    },
])

clear_and_seed_questions("Wireless Networks", [
    {
        "text": "What does SSID stand for in wireless networking?",
        "a": "Secure System Identification Data", "b": "Service Set Identifier — the name of a WiFi network", "c": "Signal Strength Indicator Device", "d": "System Security ID",
        "correct": "B",
        "explanation": "SSID (Service Set Identifier) is the human-readable name of a WiFi network that devices see when scanning for available networks."
    },
    {
        "text": "Which WiFi security protocol is currently the most secure?",
        "a": "WEP", "b": "WPA", "c": "WPA2", "d": "WPA3",
        "correct": "D",
        "explanation": "WPA3 (introduced in 2018) is the latest and most secure WiFi protocol, offering stronger encryption and protection against brute-force attacks compared to WPA2."
    },
    {
        "text": "What is the typical maximum range of a standard WiFi 802.11n access point indoors?",
        "a": "5 meters", "b": "70 meters", "c": "500 meters", "d": "1 kilometer",
        "correct": "B",
        "explanation": "Standard 802.11n WiFi typically has an indoor range of about 70 meters (230 feet), though walls and interference can reduce this significantly."
    },
    {
        "text": "What is the difference between the 2.4GHz and 5GHz WiFi bands?",
        "a": "2.4GHz is always faster", "b": "5GHz has longer range but slower speeds", "c": "2.4GHz has longer range but more interference; 5GHz has shorter range but faster speeds and less interference", "d": "They have identical performance",
        "correct": "C",
        "explanation": "2.4GHz penetrates walls better (longer range) but is crowded with interference from other devices. 5GHz offers faster speeds and less congestion but shorter range."
    },
    {
        "text": "What is a rogue access point?",
        "a": "An access point with a weak signal", "b": "An unauthorized WiFi access point installed on a network without permission", "c": "An access point with outdated firmware", "d": "A backup access point",
        "correct": "B",
        "explanation": "A rogue access point is an unauthorized WiFi AP connected to a network, potentially allowing attackers to intercept traffic or bypass security controls."
    },
])

clear_and_seed_questions("Network Management", [
    {
        "text": "What protocol is used to monitor and manage network devices?",
        "a": "FTP", "b": "SNMP (Simple Network Management Protocol)", "c": "SMTP", "d": "DNS",
        "correct": "B",
        "explanation": "SNMP allows network administrators to monitor and manage network devices (routers, switches, servers) remotely — collecting performance data and sending alerts."
    },
    {
        "text": "What does QoS (Quality of Service) do in a network?",
        "a": "Encrypts network traffic", "b": "Assigns IP addresses", "c": "Prioritizes certain types of network traffic to ensure performance", "d": "Monitors security threats",
        "correct": "C",
        "explanation": "QoS prioritizes traffic types (e.g., VoIP calls over file downloads) to ensure critical applications get sufficient bandwidth and low latency."
    },
    {
        "text": "What is network latency?",
        "a": "The amount of data transferred per second", "b": "The number of connected devices", "c": "The time it takes for data to travel from source to destination", "d": "The strength of a WiFi signal",
        "correct": "C",
        "explanation": "Latency is the delay between sending and receiving data, measured in milliseconds. Low latency is critical for real-time applications like video calls and online gaming."
    },
    {
        "text": "What is the purpose of network monitoring tools like Wireshark?",
        "a": "To speed up network connections", "b": "To capture and analyze network packets for troubleshooting and security analysis", "c": "To assign IP addresses automatically", "d": "To configure router settings",
        "correct": "B",
        "explanation": "Wireshark captures live network packets and displays their contents, allowing administrators to diagnose network problems, analyze protocols, and detect security issues."
    },
    {
        "text": "What does fault tolerance in network design mean?",
        "a": "The network automatically fixes security vulnerabilities", "b": "The network can tolerate and continue operating despite component failures", "c": "All devices on the network have the same configuration", "d": "The network rejects faulty packets",
        "correct": "B",
        "explanation": "Fault tolerance means the network continues functioning when a component fails, achieved through redundancy (multiple paths, backup links, failover systems)."
    },
])


# ══════════════════════════════════════════════
# OS - Operating Systems
# ══════════════════════════════════════════════

clear_and_seed_questions("OS Overview", [
    {
        "text": "What is the primary role of an operating system?",
        "a": "To browse the internet", "b": "To manage hardware resources and provide services to applications", "c": "To compile programming languages", "d": "To store user data",
        "correct": "B",
        "explanation": "An OS acts as an intermediary between hardware and applications — managing CPU, memory, storage, and I/O while providing a platform for programs to run."
    },
    {
        "text": "What is the kernel in an operating system?",
        "a": "The user interface of the OS", "b": "A type of file system", "c": "The core component that directly controls hardware and manages system resources", "d": "An application running on the OS",
        "correct": "C",
        "explanation": "The kernel is the core of the OS that runs in privileged mode, directly managing hardware resources, memory, and providing essential services to all other software."
    },
    {
        "text": "What is a system call?",
        "a": "A phone call between computers", "b": "A hardware interrupt", "c": "A programming interface that allows user programs to request services from the OS kernel", "d": "A network communication protocol",
        "correct": "C",
        "explanation": "System calls are the interface between user applications and the OS kernel — programs use them to request services like file I/O, memory allocation, or process creation."
    },
    {
        "text": "Which type of OS kernel has all services running in kernel space?",
        "a": "Microkernel", "b": "Hybrid kernel", "c": "Exokernel", "d": "Monolithic kernel",
        "correct": "D",
        "explanation": "A monolithic kernel runs all OS services (file systems, drivers, networking) in kernel space, offering performance advantages but less modularity than microkernels."
    },
    {
        "text": "What is the difference between a process and a thread?",
        "a": "They are the same thing", "b": "A process is a program in execution with its own memory space; a thread is a unit of execution within a process sharing the same memory", "c": "Threads are slower than processes", "d": "A process runs in user space, a thread runs in kernel space",
        "correct": "B",
        "explanation": "A process has its own independent memory space, while threads within the same process share memory. Threads are lighter weight and faster to create but require synchronization."
    },
])

clear_and_seed_questions("Process Management", [
    {
        "text": "What are the typical states in a process lifecycle?",
        "a": "On, Off, Standby", "b": "New, Ready, Running, Waiting, Terminated", "c": "Created, Active, Sleeping, Dead", "d": "Start, Execute, Finish",
        "correct": "B",
        "explanation": "A process transitions through states: New (being created), Ready (waiting for CPU), Running (executing), Waiting (blocked on I/O), and Terminated (finished)."
    },
    {
        "text": "What is a PCB (Process Control Block)?",
        "a": "A hardware component for process execution", "b": "A data structure the OS maintains for each process, storing its state, registers, and resources", "c": "A scheduling algorithm", "d": "A type of memory management",
        "correct": "B",
        "explanation": "The PCB is a data structure that stores all information about a process — its PID, state, program counter, CPU registers, memory info, and I/O status."
    },
    {
        "text": "What is the purpose of the fork() system call in Unix/Linux?",
        "a": "To terminate a process", "b": "To split CPU time between processes", "c": "To create a child process that is a copy of the parent process", "d": "To allocate memory to a process",
        "correct": "C",
        "explanation": "fork() creates a new process (child) that is an exact copy of the calling process (parent). The child gets a new PID and runs concurrently with the parent."
    },
    {
        "text": "What is a zombie process?",
        "a": "A process consuming excessive CPU", "b": "A process that has completed execution but still has an entry in the process table because its parent hasn't read its exit status", "c": "A process running in background", "d": "A process that cannot be killed",
        "correct": "B",
        "explanation": "A zombie process has finished execution but its entry remains in the process table until the parent calls wait() to collect its exit status. Too many zombies can exhaust process table slots."
    },
    {
        "text": "What is context switching in an OS?",
        "a": "Switching between user interfaces", "b": "Changing the OS configuration", "c": "Saving the state of a running process and restoring the state of another process to run", "d": "Switching between network interfaces",
        "correct": "C",
        "explanation": "Context switching saves the current process's state (PCB) and loads the next process's saved state, allowing the CPU to switch between processes — the key mechanism for multitasking."
    },
])

clear_and_seed_questions("CPU Scheduling", [
    {
        "text": "What does FCFS (First-Come, First-Served) scheduling do?",
        "a": "Runs the shortest job first", "b": "Runs processes in priority order", "c": "Runs processes in the order they arrive", "d": "Gives each process equal time slices",
        "correct": "C",
        "explanation": "FCFS is the simplest scheduling algorithm — processes are executed in arrival order. Simple to implement but can cause the 'convoy effect' where short jobs wait behind long ones."
    },
    {
        "text": "What is the main advantage of Round Robin (RR) scheduling?",
        "a": "Minimizes total waiting time", "b": "Always runs the highest priority process", "c": "Provides fair CPU sharing with bounded response time for all processes", "d": "Minimizes context switches",
        "correct": "C",
        "explanation": "Round Robin gives each process a fixed time quantum in rotation, ensuring fair CPU sharing and bounded waiting time — making it ideal for time-sharing systems."
    },
    {
        "text": "In Shortest Job First (SJF) scheduling, what is the main disadvantage?",
        "a": "It wastes CPU time", "b": "It requires too much memory", "c": "Long processes may never execute (starvation)", "d": "It's too complex to implement",
        "correct": "C",
        "explanation": "SJF can cause starvation — if short jobs keep arriving, long processes may wait indefinitely. Aging (gradually increasing priority of waiting processes) can solve this."
    },
    {
        "text": "What is the difference between preemptive and non-preemptive scheduling?",
        "a": "Preemptive is slower", "b": "Preemptive allows the OS to interrupt a running process and switch to another; non-preemptive waits until the process voluntarily yields", "c": "Non-preemptive is more fair", "d": "There is no practical difference",
        "correct": "B",
        "explanation": "Preemptive scheduling allows the OS to forcibly remove a process from the CPU (e.g., when time quantum expires or higher priority arrives). Non-preemptive waits for voluntary yield or completion."
    },
    {
        "text": "What is CPU utilization and what is the goal for a well-designed scheduler?",
        "a": "The amount of RAM used; keep it below 50%", "b": "The number of processes running; maximize process count", "c": "The percentage of time the CPU is busy; keep it as high as possible (typically 40–90%)", "d": "The clock speed of the CPU; run at maximum speed",
        "correct": "C",
        "explanation": "CPU utilization measures how busy the CPU is. Good schedulers aim for high utilization (40% light load, 90% heavy load) while balancing response time and fairness."
    },
])

clear_and_seed_questions("Memory Management", [
    {
        "text": "What is virtual memory?",
        "a": "RAM installed on a graphics card", "b": "A technique that uses disk space to extend the apparent size of RAM, allowing programs to use more memory than physically available", "c": "Memory used only by the OS kernel", "d": "A type of cache memory",
        "correct": "B",
        "explanation": "Virtual memory creates the illusion of more RAM by storing inactive memory pages on disk (swap space). The MMU handles translation between virtual and physical addresses."
    },
    {
        "text": "What is a page fault?",
        "a": "A hardware memory error", "b": "When a program accesses an invalid memory address", "c": "When a requested memory page is not in physical RAM and must be loaded from disk", "d": "A type of buffer overflow",
        "correct": "C",
        "explanation": "A page fault occurs when a program accesses a virtual memory page that isn't currently in RAM. The OS must pause the process, load the page from disk, and then resume — causing a performance delay."
    },
    {
        "text": "What is memory fragmentation?",
        "a": "Corrupted memory data", "b": "Memory split into small unusable chunks — external fragmentation (free spaces between allocated blocks) or internal (unused space within allocated blocks)", "c": "Memory used by multiple processes simultaneously", "d": "Encrypted memory regions",
        "correct": "B",
        "explanation": "External fragmentation occurs when free memory is scattered in small non-contiguous blocks. Internal fragmentation is wasted space within allocated memory blocks. Compaction and paging help address this."
    },
    {
        "text": "What is the purpose of the Memory Management Unit (MMU)?",
        "a": "To increase CPU clock speed", "b": "To manage network memory", "c": "To translate virtual addresses to physical memory addresses", "d": "To store the OS kernel",
        "correct": "C",
        "explanation": "The MMU is hardware that translates virtual addresses used by programs into physical RAM addresses, enabling virtual memory, memory protection, and process isolation."
    },
    {
        "text": "Which page replacement algorithm replaces the page that won't be used for the longest time in the future?",
        "a": "LRU (Least Recently Used)", "b": "FIFO (First In, First Out)", "c": "OPT/Optimal Algorithm", "d": "Clock Algorithm",
        "correct": "C",
        "explanation": "The Optimal algorithm replaces the page that won't be needed for the longest time — theoretically perfect but impossible to implement in practice since future access patterns are unknown."
    },
])

clear_and_seed_questions("File Systems", [
    {
        "text": "What is an inode in Unix/Linux file systems?",
        "a": "A type of directory", "b": "A data structure storing file metadata (permissions, size, location) but not the filename", "c": "The first block of a file", "d": "A network file protocol",
        "correct": "B",
        "explanation": "An inode stores file metadata — owner, permissions, timestamps, size, and pointers to data blocks — but not the filename. The directory maps filenames to inode numbers."
    },
    {
        "text": "What is the difference between absolute and relative paths?",
        "a": "Absolute paths are shorter", "b": "Absolute paths start from the root directory (/); relative paths start from the current working directory", "c": "Relative paths work on all operating systems", "d": "There is no difference",
        "correct": "B",
        "explanation": "Absolute paths specify the complete path from the root (e.g., /home/user/file.txt), while relative paths start from your current location (e.g., ../documents/file.txt)."
    },
    {
        "text": "What does journaling in a file system provide?",
        "a": "Faster read speeds", "b": "Compression of stored files", "c": "Recovery from crashes by logging changes before committing them to the main file system", "d": "Encryption of all files",
        "correct": "C",
        "explanation": "Journaling logs planned changes to a journal before executing them. If a crash occurs mid-operation, the OS can replay or roll back the journal to restore file system consistency."
    },
    {
        "text": "What is the purpose of file permissions in Unix/Linux (e.g., rwxr-xr-x)?",
        "a": "To set file creation dates", "b": "To compress files", "c": "To control read, write, and execute access for owner, group, and others", "d": "To determine file type",
        "correct": "C",
        "explanation": "Unix permissions control access at three levels: owner (u), group (g), others (o). Each can have read (r=4), write (w=2), execute (x=1) permissions, providing fine-grained access control."
    },
    {
        "text": "What is the difference between FAT32 and NTFS file systems?",
        "a": "FAT32 supports larger files and has better security features than NTFS", "b": "NTFS supports larger files (>4GB), file permissions, journaling, and encryption; FAT32 has a 4GB file size limit but is universally compatible", "c": "They are identical in functionality", "d": "FAT32 is only used on Linux systems",
        "correct": "B",
        "explanation": "NTFS (Windows) offers large file support, access permissions, journaling, compression, and encryption. FAT32 is limited to 4GB files but works on virtually all devices and operating systems."
    },
])

clear_and_seed_questions("Concurrency", [
    {
        "text": "What is a race condition in concurrent programming?",
        "a": "Two programs competing for faster execution speed", "b": "A situation where the outcome depends on the unpredictable order in which threads access shared resources", "c": "A CPU scheduling algorithm", "d": "A type of memory leak",
        "correct": "B",
        "explanation": "A race condition occurs when multiple threads access shared data concurrently and the final result depends on execution order — leading to unpredictable bugs that are difficult to reproduce."
    },
    {
        "text": "What is a mutex (mutual exclusion lock)?",
        "a": "A type of CPU scheduling", "b": "A synchronization primitive that ensures only one thread can access a shared resource at a time", "c": "A memory allocation strategy", "d": "A network communication protocol",
        "correct": "B",
        "explanation": "A mutex prevents race conditions by locking a shared resource — only the thread holding the mutex can access the resource, and other threads must wait until it's released."
    },
    {
        "text": "What is a semaphore used for in OS?",
        "a": "Storing process information", "b": "CPU scheduling", "c": "Controlling access to shared resources by multiple processes using a counter", "d": "File system management",
        "correct": "C",
        "explanation": "A semaphore is a synchronization tool using a counter. Binary semaphores (0/1) work like mutexes. Counting semaphores allow N threads to access a resource simultaneously."
    },
    {
        "text": "What is the difference between parallelism and concurrency?",
        "a": "They are the same concept", "b": "Concurrency means multiple tasks make progress (possibly by interleaving); parallelism means tasks literally execute simultaneously on multiple processors", "c": "Parallelism is slower than concurrency", "d": "Concurrency requires multiple CPUs",
        "correct": "B",
        "explanation": "Concurrency is about managing multiple tasks (they may take turns). Parallelism requires multiple CPU cores executing tasks truly simultaneously. Concurrency enables parallelism but they're distinct concepts."
    },
    {
        "text": "What problem does the Producer-Consumer pattern address?",
        "a": "CPU scheduling fairness", "b": "Network bandwidth allocation", "c": "Coordinating between threads that produce data and threads that consume it using a shared buffer", "d": "Memory deallocation",
        "correct": "C",
        "explanation": "The Producer-Consumer pattern solves coordination between producers (generating data) and consumers (processing data) using a bounded buffer with synchronization to prevent overflow or underflow."
    },
])

clear_and_seed_questions("Deadlock", [
    {
        "text": "What are the four necessary conditions for a deadlock to occur (Coffman conditions)?",
        "a": "Speed, Memory, CPU, I/O", "b": "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "c": "Starvation, Priority, Blocking, Waiting", "d": "Lock, Unlock, Request, Release",
        "correct": "B",
        "explanation": "All four Coffman conditions must hold simultaneously for deadlock: Mutual Exclusion (resources non-shareable), Hold and Wait (holding while requesting), No Preemption (can't forcibly take), Circular Wait (cycle of dependencies)."
    },
    {
        "text": "What is the Banker's Algorithm used for?",
        "a": "CPU scheduling", "b": "Memory paging", "c": "Deadlock avoidance by checking if resource allocation keeps the system in a safe state", "d": "File system management",
        "correct": "C",
        "explanation": "The Banker's Algorithm prevents deadlock by simulating resource allocation and only granting requests that keep the system in a 'safe state' — where all processes can complete."
    },
    {
        "text": "What is the simplest strategy to prevent circular wait (a deadlock condition)?",
        "a": "Allocate all resources at once", "b": "Impose a total ordering on resources and require processes to request them in order", "c": "Kill processes that wait too long", "d": "Allow preemption of all resources",
        "correct": "B",
        "explanation": "By numbering resources and requiring all processes to request them in ascending numerical order, circular wait becomes impossible — a cycle cannot form when all requests follow the same direction."
    },
    {
        "text": "What is the difference between deadlock prevention and deadlock detection?",
        "a": "They are the same strategy", "b": "Prevention ensures deadlock never occurs by eliminating conditions; detection allows deadlock to occur and recovers from it", "c": "Detection is used in real-time systems only", "d": "Prevention is only for distributed systems",
        "correct": "B",
        "explanation": "Prevention proactively eliminates one or more Coffman conditions. Detection periodically checks for deadlocks and recovers by preempting resources or terminating processes."
    },
    {
        "text": "What is livelock?",
        "a": "A deadlock that resolves itself automatically", "b": "Processes actively responding to each other but making no useful progress — similar to two people constantly stepping aside for each other in a corridor", "c": "A process running at maximum CPU speed", "d": "Multiple processes accessing the same file",
        "correct": "B",
        "explanation": "In livelock, processes aren't blocked (they're actively running) but they keep changing state in response to each other without making progress — like two processes repeatedly releasing and re-requesting resources."
    },
])

clear_and_seed_questions("I/O Management", [
    {
        "text": "What is DMA (Direct Memory Access) and why is it used?",
        "a": "A type of RAM for faster access", "b": "A technique where I/O devices transfer data directly to/from memory without CPU involvement, freeing the CPU for other tasks", "c": "A CPU cache management strategy", "d": "A disk formatting technique",
        "correct": "B",
        "explanation": "DMA allows I/O controllers to transfer data directly to/from RAM without constant CPU involvement. The CPU initiates the transfer, does other work, and is interrupted only when the transfer completes."
    },
    {
        "text": "What is the difference between synchronous and asynchronous I/O?",
        "a": "Synchronous is faster for all operations", "b": "Synchronous I/O blocks the process until the operation completes; asynchronous I/O allows the process to continue while the operation executes in the background", "c": "Asynchronous I/O is only for network operations", "d": "There is no practical difference",
        "correct": "B",
        "explanation": "Synchronous (blocking) I/O pauses the calling process until data is ready. Asynchronous (non-blocking) I/O lets the process continue executing and receive a notification when the I/O completes."
    },
    {
        "text": "What is disk scheduling and why is it important?",
        "a": "Planning when to back up data", "b": "Organizing the order in which disk I/O requests are serviced to minimize seek time and improve throughput", "c": "Defragmenting the disk", "d": "Encrypting disk contents",
        "correct": "B",
        "explanation": "Disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN) determine the order to service disk read/write requests, minimizing mechanical arm movement and improving overall disk throughput."
    },
    {
        "text": "What is spooling in OS I/O management?",
        "a": "A type of memory allocation", "b": "Buffering I/O data to disk, allowing slow I/O devices (like printers) to be used by multiple programs without blocking", "c": "A network I/O technique", "d": "Encrypting I/O data",
        "correct": "B",
        "explanation": "Spooling (Simultaneous Peripheral Operations On-Line) queues I/O jobs to disk, allowing the OS to feed data to slow devices (printers) at their own pace while applications continue executing."
    },
    {
        "text": "What is the purpose of I/O buffering?",
        "a": "To encrypt data during transfer", "b": "To store data temporarily to smooth out speed differences between a fast CPU and slow I/O devices", "c": "To compress data before writing to disk", "d": "To schedule CPU processes",
        "correct": "B",
        "explanation": "Buffers hold data temporarily to bridge the speed gap between fast producers (CPU) and slow consumers (disk, network). This prevents the CPU from idling while waiting for slow I/O devices."
    },
])

clear_and_seed_questions("Virtualization", [
    {
        "text": "What is the main benefit of server virtualization?",
        "a": "Faster CPU performance", "b": "Multiple virtual machines running on one physical server, improving resource utilization and reducing hardware costs", "c": "Better network security", "d": "Easier programming",
        "correct": "B",
        "explanation": "Virtualization allows multiple isolated VMs to share one physical server's resources, dramatically improving utilization (from ~15% to 70%+), reducing hardware costs and energy consumption."
    },
    {
        "text": "What is a hypervisor?",
        "a": "An advanced CPU scheduler", "b": "Software that creates and manages virtual machines by abstracting physical hardware", "c": "A high-performance network switch", "d": "A type of file system",
        "correct": "B",
        "explanation": "A hypervisor (VMM - Virtual Machine Monitor) creates and manages VMs, allocating physical resources (CPU, RAM, storage) to each VM while keeping them isolated from each other."
    },
    {
        "text": "What is the difference between Type 1 and Type 2 hypervisors?",
        "a": "Type 1 supports more VMs than Type 2", "b": "Type 1 runs directly on hardware (bare-metal); Type 2 runs on top of a host operating system", "c": "Type 2 is more secure than Type 1", "d": "Type 1 is only for Windows VMs",
        "correct": "B",
        "explanation": "Type 1 (bare-metal) hypervisors like VMware ESXi, Hyper-V run directly on hardware for maximum performance. Type 2 hypervisors like VirtualBox run as applications on a host OS, easier to set up."
    },
    {
        "text": "What is the key difference between a Virtual Machine (VM) and a Container?",
        "a": "VMs are faster than containers", "b": "VMs virtualize the entire hardware stack including the OS; containers share the host OS kernel and only isolate the application environment", "c": "Containers require more disk space", "d": "VMs can only run Linux",
        "correct": "B",
        "explanation": "VMs include a full OS (heavy, GB-sized). Containers (Docker) share the host kernel and only package the app + dependencies (lightweight, MB-sized), starting in seconds vs minutes for VMs."
    },
    {
        "text": "What is live migration in virtualization?",
        "a": "Moving data between storage systems", "b": "Upgrading a VM's operating system", "c": "Moving a running VM from one physical host to another with minimal or no downtime", "d": "Backing up VM snapshots",
        "correct": "C",
        "explanation": "Live migration transfers a running VM between physical hosts while it continues operating — memory pages are copied incrementally, then the VM is briefly paused for final synchronization, enabling zero-downtime maintenance."
    },
])


# ══════════════════════════════════════════════
# SE - Software Engineering
# ══════════════════════════════════════════════

clear_and_seed_questions("SDLC Models", [
    {
        "text": "Which SDLC model requires all requirements to be complete before development begins?",
        "a": "Agile", "b": "Spiral", "c": "Waterfall", "d": "Scrum",
        "correct": "C",
        "explanation": "The Waterfall model is sequential — each phase must be completed before the next begins, requiring complete requirements before development starts."
    },
    {
        "text": "What is the main advantage of Agile over Waterfall?",
        "a": "Agile requires less documentation", "b": "Agile is cheaper", "c": "Agile allows requirements to evolve through iterative development and continuous feedback", "d": "Agile has no testing phase",
        "correct": "C",
        "explanation": "Agile's iterative approach allows requirements to evolve throughout the project, making it much more flexible than Waterfall's rigid sequential process."
    },
    {
        "text": "What drives the Spiral model of SDLC?",
        "a": "Customer requirements", "b": "Risk analysis and mitigation", "c": "Development speed", "d": "Team size",
        "correct": "B",
        "explanation": "The Spiral model is risk-driven — each cycle includes risk analysis and mitigation, making it suitable for large, complex, high-risk projects."
    },
    {
        "text": "What does CI/CD stand for in modern software development?",
        "a": "Code Integration / Code Deployment", "b": "Continuous Integration / Continuous Deployment", "c": "Critical Infrastructure / Critical Delivery", "d": "Customer Interface / Customer Delivery",
        "correct": "B",
        "explanation": "CI/CD stands for Continuous Integration (automatically building and testing on each commit) and Continuous Deployment (automatically deploying after tests pass)."
    },
    {
        "text": "What is the V-Model's key characteristic?",
        "a": "It is iterative like Agile", "b": "Each development phase corresponds to a testing phase", "c": "It uses visual diagrams for all phases", "d": "It only works for small projects",
        "correct": "B",
        "explanation": "The V-Model pairs each development phase with a corresponding testing/validation phase, emphasizing verification and validation throughout development."
    },
])

clear_and_seed_questions("Requirements Analysis", [
    {
        "text": "What is the difference between functional and non-functional requirements?",
        "a": "Functional requirements are optional; non-functional are mandatory", "b": "Functional requirements describe what the system does; non-functional describe how well it does it (performance, security, usability)", "c": "Non-functional requirements are written by developers only", "d": "They are the same type of requirement",
        "correct": "B",
        "explanation": "Functional requirements define specific behaviors (e.g., 'user can log in'). Non-functional requirements define quality attributes (e.g., 'login must complete in under 2 seconds')."
    },
    {
        "text": "What is a use case in software requirements?",
        "a": "A performance benchmark", "b": "A description of how a user interacts with a system to achieve a specific goal", "c": "A type of database query", "d": "A code testing technique",
        "correct": "B",
        "explanation": "A use case describes a sequence of interactions between a user (actor) and a system to accomplish a goal — capturing functional requirements from the user's perspective."
    },
    {
        "text": "What does MoSCoW prioritization stand for in requirements?",
        "a": "Must have, Should have, Could have, Won't have", "b": "Main, Secondary, Optional, Wasted", "c": "Mandatory, Scalable, Complex, Optional Workload", "d": "Mission-critical, Operational, Support, Cosmetic, Optional Work",
        "correct": "A",
        "explanation": "MoSCoW is a prioritization technique: Must have (critical for launch), Should have (important but not vital), Could have (nice to have), Won't have (out of scope for now)."
    },
    {
        "text": "What is requirements traceability?",
        "a": "Tracking the history of requirement changes", "b": "The ability to trace requirements from source through design, code, and testing to verify each requirement is implemented and tested", "c": "Monitoring system performance against requirements", "d": "Writing requirements in a standard format",
        "correct": "B",
        "explanation": "Requirements traceability links each requirement to its source, design decisions, implementation, and test cases — ensuring nothing is missed and changes can be impact-assessed."
    },
    {
        "text": "What is the main problem with ambiguous requirements?",
        "a": "They take longer to write", "b": "They cost more to document", "c": "Different team members may interpret them differently, leading to inconsistent implementation", "d": "They cannot be tested",
        "correct": "C",
        "explanation": "Ambiguous requirements (e.g., 'the system should be fast') are interpreted differently by developers, testers, and clients, leading to mismatched expectations and rework."
    },
])

clear_and_seed_questions("UML Design", [
    {
        "text": "What does UML stand for and what is it used for?",
        "a": "Universal Machine Language — for programming", "b": "Unified Modeling Language — for visualizing, designing, and documenting software systems", "c": "Unified Module Library — for code reuse", "d": "User Management Layer — for access control",
        "correct": "B",
        "explanation": "UML (Unified Modeling Language) is a standardized notation for visually representing software architecture, design, and behavior through various diagram types."
    },
    {
        "text": "Which UML diagram shows the static structure of a system including classes, attributes, and relationships?",
        "a": "Sequence Diagram", "b": "Use Case Diagram", "c": "Class Diagram", "d": "Activity Diagram",
        "correct": "C",
        "explanation": "Class diagrams show the static structure — classes, their attributes, methods, and relationships (inheritance, association, composition) — forming the backbone of object-oriented design."
    },
    {
        "text": "What does a sequence diagram in UML show?",
        "a": "The inheritance hierarchy of classes", "b": "The order of method calls and message passing between objects over time", "c": "The deployment of software on hardware", "d": "The data flow through a system",
        "correct": "B",
        "explanation": "Sequence diagrams show how objects interact in a time-ordered sequence of messages, illustrating the flow of control for a specific scenario or use case."
    },
    {
        "text": "In UML class diagrams, what does a filled diamond represent?",
        "a": "Inheritance (is-a relationship)", "b": "Dependency", "c": "Composition (strong ownership — child cannot exist without parent)", "d": "Interface implementation",
        "correct": "C",
        "explanation": "A filled diamond represents composition — the child object's lifecycle depends entirely on the parent. If the parent is destroyed, children are also destroyed (e.g., House → Rooms)."
    },
    {
        "text": "What is the purpose of a Use Case Diagram?",
        "a": "To show the internal structure of a class", "b": "To model system behavior from the user's perspective, showing actors and their interactions with the system", "c": "To document database schema", "d": "To show how classes inherit from each other",
        "correct": "B",
        "explanation": "Use Case Diagrams show what the system does from the external user (actor) perspective — defining system boundaries and showing which actors interact with which use cases."
    },
])

clear_and_seed_questions("Testing Strategies", [
    {
        "text": "What is the difference between unit testing and integration testing?",
        "a": "Unit testing is faster than integration testing", "b": "Unit testing tests individual components in isolation; integration testing tests how multiple components work together", "c": "Integration testing is done by end users", "d": "Unit tests require a complete system",
        "correct": "B",
        "explanation": "Unit tests verify individual functions/methods in isolation using mocks. Integration tests verify that multiple components work correctly together, testing their interactions."
    },
    {
        "text": "What is Test-Driven Development (TDD)?",
        "a": "Testing after all code is written", "b": "Writing tests first, then writing just enough code to pass the tests, then refactoring", "c": "Having dedicated testers write all tests", "d": "Using automated testing tools exclusively",
        "correct": "B",
        "explanation": "TDD follows Red-Green-Refactor: write a failing test (Red), write minimal code to pass it (Green), then refactor for quality. This drives design and ensures testable code."
    },
    {
        "text": "What is code coverage and what does 100% coverage guarantee?",
        "a": "100% coverage means the software has no bugs", "b": "Code coverage measures what percentage of code is executed during testing; 100% coverage means all lines run but doesn't guarantee correctness", "c": "Coverage only applies to unit tests", "d": "100% coverage is always required",
        "correct": "B",
        "explanation": "Code coverage tracks which lines/branches execute during tests. 100% line coverage means all code runs, but tests may not verify correct behavior — you need good assertions, not just execution."
    },
    {
        "text": "What is regression testing?",
        "a": "Testing new features only", "b": "Testing performance under load", "c": "Re-running tests after changes to ensure existing functionality hasn't been broken", "d": "Testing that the system handles invalid inputs",
        "correct": "C",
        "explanation": "Regression testing verifies that new changes (bug fixes, features) haven't broken previously working functionality. Automated regression suites catch unintended side effects of code changes."
    },
    {
        "text": "What is the difference between black-box and white-box testing?",
        "a": "Black-box testing is manual; white-box is automated", "b": "Black-box tests functionality without knowledge of internal code; white-box tests internal structure and logic with full code access", "c": "White-box testing is done by end users", "d": "Black-box testing requires source code",
        "correct": "B",
        "explanation": "Black-box testing treats the system as a black box — testing inputs/outputs without internal knowledge. White-box testing examines internal logic, paths, and conditions using source code."
    },
])

clear_and_seed_questions("Version Control", [
    {
        "text": "What is the purpose of version control systems like Git?",
        "a": "To speed up code compilation", "b": "To track changes to code over time, enable collaboration, and allow reverting to previous versions", "c": "To automatically fix code bugs", "d": "To deploy applications to servers",
        "correct": "B",
        "explanation": "Version control systems track the complete history of code changes, enable multiple developers to collaborate without conflicts, and allow reverting to any previous state."
    },
    {
        "text": "What is the difference between git merge and git rebase?",
        "a": "They produce identical results", "b": "Merge combines branches preserving commit history; rebase moves commits onto another branch creating a linear history", "c": "Rebase is safer than merge", "d": "Merge only works on main branch",
        "correct": "B",
        "explanation": "Merge creates a merge commit that preserves the branching history. Rebase replays commits on top of another branch for a cleaner linear history, but rewrites commit hashes."
    },
    {
        "text": "What does a git pull request (or merge request) represent in a team workflow?",
        "a": "A request to download code from a repository", "b": "A notification that new code is available", "c": "A proposal to merge code changes into a branch, enabling code review before integration", "d": "An automated deployment trigger",
        "correct": "C",
        "explanation": "A pull request is a mechanism for code review — a developer proposes changes, team members review and comment, and only approved changes are merged into the main branch."
    },
    {
        "text": "What is a git conflict and when does it occur?",
        "a": "When a commit message is too long", "b": "When two branches modify the same lines of code in different ways, Git cannot automatically decide which version to keep", "c": "When the repository is too large", "d": "When network connection fails during push",
        "correct": "B",
        "explanation": "Conflicts occur when merging/rebasing branches that made different changes to the same code. Git marks the conflicting sections and requires a developer to manually choose the correct version."
    },
    {
        "text": "What is the Gitflow branching strategy?",
        "a": "A strategy where everyone commits directly to main", "b": "A workflow using feature branches, a develop branch, release branches, and hotfix branches to organize development", "c": "An automated deployment system", "d": "A code formatting standard",
        "correct": "B",
        "explanation": "Gitflow uses main (production), develop (integration), feature/* (new features), release/* (release prep), and hotfix/* (production fixes) branches to organize collaborative development."
    },
])

clear_and_seed_questions("Agile & Scrum", [
    {
        "text": "What is a Sprint in Scrum?",
        "a": "A performance benchmark for the development team", "b": "A time-boxed iteration (usually 1-4 weeks) in which a potentially shippable product increment is created", "c": "A type of code review", "d": "A deployment to production",
        "correct": "B",
        "explanation": "A Sprint is a fixed-length development cycle (typically 2 weeks) where the team selects items from the product backlog and works to deliver a potentially releasable increment."
    },
    {
        "text": "What is the Product Backlog in Scrum?",
        "a": "A list of bugs found in production", "b": "The team's velocity metric", "c": "An ordered list of everything that might be needed in the product, managed by the Product Owner", "d": "A record of completed sprints",
        "correct": "C",
        "explanation": "The Product Backlog is the master list of features, requirements, and enhancements for the product. The Product Owner prioritizes it, and items are pulled into Sprints."
    },
    {
        "text": "What are the three Scrum roles?",
        "a": "Manager, Developer, Tester", "b": "Product Owner, Scrum Master, Development Team", "c": "Architect, Coder, QA Engineer", "d": "CEO, CTO, Developers",
        "correct": "B",
        "explanation": "Scrum has three roles: Product Owner (defines and prioritizes requirements), Scrum Master (facilitates the process, removes blockers), and Development Team (self-organizing team that builds the product)."
    },
    {
        "text": "What is the purpose of a Daily Standup (Daily Scrum)?",
        "a": "A daily progress report to management", "b": "A 15-minute daily sync for the team to share what they did, what they'll do, and any blockers", "c": "A code review session", "d": "Sprint planning for the day",
        "correct": "B",
        "explanation": "The Daily Standup is a 15-minute time-boxed team sync covering: what I did yesterday, what I'll do today, and what's blocking me. It promotes transparency and quick impediment removal."
    },
    {
        "text": "What is the difference between velocity and capacity in Agile?",
        "a": "They measure the same thing", "b": "Velocity is the amount of work completed in past sprints (historical); capacity is the available team time for an upcoming sprint", "c": "Capacity is always higher than velocity", "d": "Velocity measures code quality",
        "correct": "B",
        "explanation": "Velocity measures actual story points completed in past sprints (used for forecasting). Capacity is the actual available hours/days for the team in an upcoming sprint (accounts for holidays, meetings)."
    },
])

print("\n✅ ALL QUESTIONS SEEDED SUCCESSFULLY!")
print("📊 Coverage:")
print("   DSA:      8 modules × 5 questions = 40 questions")
print("   Networks: 7 modules × 5 questions = 35 questions")
print("   OS:       9 modules × 5 questions = 45 questions")
print("   SE:       6 modules × 5 questions = 30 questions")
print("   TOTAL:    150 real questions!")

db.close()