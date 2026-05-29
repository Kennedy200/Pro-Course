import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Module, ModuleContent, LevelEnum

db = SessionLocal()

def seed_content(module_title: str, foundational: dict, intermediate: dict, advanced: dict):
    module = db.query(Module).filter(Module.title == module_title).first()
    if not module:
        print(f"  ⚠️  Module not found: {module_title}")
        return

    db.query(ModuleContent).filter(ModuleContent.module_id == module.id).delete()

    for level, data in [
        (LevelEnum.foundational, foundational),
        (LevelEnum.intermediate, intermediate),
        (LevelEnum.advanced, advanced),
    ]:
        content = ModuleContent(
            module_id=module.id,
            level=level,
            title=data["title"],
            body=data["body"],
            order=1
        )
        db.add(content)

    db.commit()
    print(f"  ✓ {module_title}")


# ══════════════════════════════════════════════
# DSA
# ══════════════════════════════════════════════

seed_content("Introduction to DSA",
foundational={
    "title": "What Are Data Structures and Algorithms?",
    "body": """A data structure is a way of organizing and storing data so it can be accessed and modified efficiently. Think of it like organizing your wardrobe — you could throw everything in a pile, or you could sort items by type, color, or season. The organized wardrobe lets you find what you need quickly.

An algorithm is a step-by-step set of instructions to solve a problem. When you follow a recipe to bake a cake, you are following an algorithm. In computing, algorithms tell the computer exactly what steps to take to accomplish a task.

Why do data structures and algorithms matter? Imagine you are searching for a contact in a phone book. If the names are random, you read every single one until you find yours — this could take forever with millions of entries. But if names are alphabetically sorted, you can jump to the right section immediately. That difference in approach is the essence of DSA.

Every program you use — Google Search, WhatsApp, Instagram — relies on carefully chosen data structures and algorithms to work fast and efficiently. A poorly chosen approach can make a program run thousands of times slower than an optimized one.

The two most important concepts when evaluating an algorithm are time complexity (how long it takes) and space complexity (how much memory it uses). We use Big O notation to describe these — for example, O(n) means the time grows linearly with input size, while O(1) means constant time regardless of input size."""
},
intermediate={
    "title": "Big O Notation and Complexity Analysis",
    "body": """Big O notation is a mathematical way to describe the performance of an algorithm as the input size grows. It focuses on the dominant term and ignores constants, giving us a high-level view of efficiency.

Common Big O complexities from fastest to slowest:
O(1) — Constant time. Array access by index. Doesn't matter if the array has 10 or 10 million items.
O(log n) — Logarithmic. Binary search. Each step eliminates half the remaining options.
O(n) — Linear. Scanning every element once. Doubles when input doubles.
O(n log n) — Linearithmic. Efficient sorting algorithms like Merge Sort and Heap Sort.
O(n²) — Quadratic. Nested loops over the same data. Very slow for large inputs.
O(2ⁿ) — Exponential. Solving some recursive problems naively. Impractical for large inputs.

When analyzing algorithms, focus on the worst case unless specified. Drop constants and lower-order terms: O(3n + 5) becomes O(n). O(n² + n) becomes O(n²).

Space complexity analysis follows the same rules but measures memory usage. An algorithm that creates a new array the same size as the input has O(n) space complexity. One that only uses a few variables has O(1) space complexity.

Trade-offs between time and space are common. Hash tables use extra memory (O(n) space) but achieve O(1) average lookup time. This trade-off is often worth it when speed is critical."""
},
advanced={
    "title": "Amortized Analysis and Advanced Complexity Topics",
    "body": """Amortized analysis considers the average performance of an operation over a sequence of operations, rather than the worst case of a single operation. This gives a more accurate picture of real-world performance.

The classic example is a dynamic array (like Python's list or Java's ArrayList). When the array is full and you append, it must resize — copying all elements to a new, larger array. This single operation costs O(n). However, if we double the capacity each time, resizing happens rarely. Over n appends, the total work is O(n), making each append O(1) amortized — even though occasional ones cost O(n).

Three methods for amortized analysis:
Aggregate method: Calculate total cost of n operations divided by n.
Accounting method: Assign virtual "credits" to cheap operations that pay for future expensive ones.
Potential method: Define a potential function representing stored work, then analyze changes.

Beyond standard Big O, complexity theory classifies problems:
P — Problems solvable in polynomial time (efficient). Sorting, shortest paths.
NP — Problems whose solutions can be verified in polynomial time. Travelling Salesman, Graph Coloring.
NP-Hard — At least as hard as the hardest NP problems.
NP-Complete — Both NP and NP-Hard. No known polynomial algorithm exists.

Understanding complexity classes helps you recognize when a problem has no efficient known solution and when approximation algorithms or heuristics are necessary."""
})

seed_content("Arrays & Strings",
foundational={
    "title": "Understanding Arrays and Basic String Operations",
    "body": """An array is the most fundamental data structure — a collection of elements stored in contiguous memory locations. Every element has an index (starting from 0 in most languages), and you can access any element instantly using its index.

Think of an array like a row of numbered lockers. Locker 0, Locker 1, Locker 2... If you know the locker number, you can go directly to it. This direct access is why arrays are so powerful.

Basic array operations:
Access: array[i] — O(1). Direct memory calculation.
Search: scan each element — O(n) worst case.
Insert at end: O(1) if space exists.
Insert at beginning or middle: O(n) — must shift all subsequent elements.
Delete: similar to insert, O(n) for middle/beginning.

Strings are essentially arrays of characters. Most string operations work similarly to array operations. Common string tasks include reversing, searching for substrings, checking for palindromes, and counting characters.

The two-pointer technique is fundamental for array and string problems. Place one pointer at the start and one at the end, moving them toward each other. This efficiently solves problems like reversing a string, checking palindromes, and finding pairs that sum to a target — all in O(n) time without extra memory."""
},
intermediate={
    "title": "Sliding Window and Two-Pointer Techniques",
    "body": """The sliding window technique solves problems involving contiguous subarrays or substrings efficiently. Instead of recalculating from scratch for each window position, we slide the window by adding one element and removing another.

Fixed-size window example — Maximum sum subarray of size k:
Instead of summing k elements from scratch at each position (O(nk)), maintain a running sum. Add the new element entering the window, subtract the element leaving. This reduces complexity from O(nk) to O(n).

Variable-size window example — Longest substring without repeating characters:
Use two pointers (left and right). Expand right pointer, adding characters to a hash set. When a duplicate is found, shrink from the left until the duplicate is removed. Track the maximum window size seen. This runs in O(n) with O(min(n,m)) space where m is the character set size.

The two-pointer technique has two common patterns:
Opposite ends: Start at both ends, converge toward center. Used for two-sum in sorted arrays, palindrome checking, container with most water.
Same direction: Both pointers move right but at different speeds. Used for removing duplicates, finding cycles, partitioning arrays.

Key insight: these techniques transform O(n²) nested loop solutions into O(n) single-pass solutions by maintaining information about the current window or pair relationship."""
},
advanced={
    "title": "Advanced Array Algorithms: Kadane's, Dutch National Flag, and More",
    "body": """Kadane's Algorithm finds the maximum sum contiguous subarray in O(n) time and O(1) space — a beautiful example of dynamic programming thinking.

The insight: at each position, the maximum subarray ending here is either just the current element (starting fresh) or the current element plus the best subarray ending at the previous position. Track both the current running sum and the global maximum.

The Dutch National Flag Problem (3-way partition) sorts an array containing only three distinct values in O(n) time and O(1) space using three pointers. This generalizes to the partition step in 3-way QuickSort, which handles duplicate elements efficiently.

Prefix sum arrays enable O(1) range sum queries after O(n) preprocessing. Store cumulative sums, then any range sum [l,r] = prefix[r] - prefix[l-1]. Extend to 2D for matrix range sums.

Boyer-Moore Voting Algorithm finds the majority element (appearing more than n/2 times) in O(n) time and O(1) space. Treat each new element as a vote — if it matches the current candidate, increment count; otherwise decrement. When count hits 0, change the candidate.

String algorithms like KMP (Knuth-Morris-Pratt) and Rabin-Karp solve pattern matching in O(n+m) time — far better than the naive O(nm) approach. KMP builds a failure function to avoid re-examining characters; Rabin-Karp uses rolling hash functions for efficient comparison."""
})

seed_content("Linked Lists",
foundational={
    "title": "Introduction to Linked Lists",
    "body": """A linked list is a linear data structure where elements (called nodes) are stored in non-contiguous memory locations. Each node contains data and a reference (pointer) to the next node in the sequence. The last node points to null, indicating the end of the list.

Unlike arrays, linked list elements are not stored next to each other in memory. Instead, each element points to where the next one lives — like a treasure hunt where each clue tells you where the next clue is hidden.

Types of linked lists:
Singly Linked List: Each node has one pointer — to the next node. Can only traverse forward.
Doubly Linked List: Each node has two pointers — to both next and previous nodes. Can traverse in both directions.
Circular Linked List: The last node points back to the first, creating a loop.

The key advantage over arrays: dynamic size and efficient insertion/deletion. Adding or removing a node only requires updating a few pointers — no shifting of elements needed. However, there is no random access — to find the nth element, you must traverse from the head.

Common operations:
Traversal: Start at head, follow next pointers until null — O(n).
Insertion at head: Create node, point it to current head, update head — O(1).
Insertion at tail: Traverse to last node, point it to new node — O(n), or O(1) with a tail pointer.
Deletion: Find the node before the target, update its next pointer to skip the target — O(n)."""
},
intermediate={
    "title": "Linked List Algorithms and Common Patterns",
    "body": """Two fundamental techniques for linked list problems are the fast/slow pointer and the reverse-in-place approach.

Fast and Slow Pointers (Floyd's Algorithm):
Use two pointers moving at different speeds. The slow pointer moves one step at a time; the fast pointer moves two. This detects cycles in O(n) time — if a cycle exists, the fast pointer will eventually lap the slow pointer and they'll meet.

To find the middle of a linked list: when fast reaches the end, slow is at the middle. This elegantly avoids counting nodes.

To find the kth node from the end: advance the first pointer k steps, then advance both pointers together. When the first reaches the end, the second is at the kth from last.

Reversing a linked list in place:
Use three pointers: previous (starts null), current (starts head), next (saves the next node). At each step: save next, reverse the current pointer to previous, advance previous and current. O(n) time, O(1) space.

Merging two sorted lists:
Use a dummy head node to simplify edge cases. Compare current nodes of both lists, append the smaller one to the result. When one list runs out, append the remainder of the other. O(m+n) time.

Detecting and removing cycles, finding intersection points of two lists — all solved elegantly with two-pointer approaches that avoid the O(n) space cost of using hash sets."""
},
advanced={
    "title": "Advanced Linked List: Skip Lists and Memory Management",
    "body": """Skip lists are a probabilistic data structure that provides O(log n) average time for search, insertion, and deletion — similar to balanced BSTs but with simpler implementation.

A skip list maintains multiple levels of linked lists. The bottom level contains all elements. Each higher level is a "highway" containing a random subset of elements from the level below. To search, start at the top-left (highest level, leftmost node) and work down-right.

The beauty of skip lists: with p=0.5 probability of promotion to the next level, the expected number of levels is O(log n), and the expected search time is O(log n). No complex rotations like AVL or Red-Black trees.

Memory management considerations:
Memory leaks occur in languages like C/C++ when deleted nodes' memory is never freed. In garbage-collected languages (Python, Java), the garbage collector handles this, but circular references can prevent collection.

In C++, implementing a proper destructor that traverses and deletes every node is essential. Smart pointers (unique_ptr, shared_ptr) automate this.

XOR linked lists store XOR of previous and next addresses in a single pointer field, reducing memory per node. Given any node and either neighbor, you can calculate the other neighbor. Space-efficient but impractical in garbage-collected languages.

Lock-free linked lists use atomic compare-and-swap (CAS) operations to allow concurrent access without locks — critical for high-performance concurrent systems where lock contention becomes a bottleneck."""
})

seed_content("Stacks & Queues",
foundational={
    "title": "Stacks and Queues: LIFO and FIFO Explained",
    "body": """A stack is a data structure that follows the Last In, First Out (LIFO) principle. Imagine a stack of plates — you can only add or remove from the top. The last plate placed is the first one removed.

Stack operations:
Push: Add an element to the top — O(1).
Pop: Remove the top element — O(1).
Peek/Top: View the top element without removing it — O(1).
isEmpty: Check if the stack is empty — O(1).

Real-world stack uses: your browser's back button (pages are pushed on a stack — going back pops them), function call stack in programming (each function call is pushed; returning pops it), undo functionality in text editors.

A queue follows the First In, First Out (FIFO) principle — like a real-world queue at a bank. The first person to join is the first to be served.

Queue operations:
Enqueue: Add to the rear — O(1).
Dequeue: Remove from the front — O(1).
Front: View the front element — O(1).
isEmpty: Check if empty — O(1).

Real-world queue uses: print spooling (documents printed in order received), BFS graph traversal, task scheduling in operating systems, handling requests in web servers.

Both can be implemented with arrays or linked lists. Arrays are simpler but may waste space; linked lists are dynamic but use more memory per element."""
},
intermediate={
    "title": "Monotonic Stacks, Deques, and Advanced Applications",
    "body": """A monotonic stack maintains elements in strictly increasing or decreasing order. As you process elements, pop anything that violates the monotonic property before pushing the new element.

The "Next Greater Element" problem perfectly illustrates this: for each element, find the first element to its right that is larger. Naive approach: O(n²). Monotonic stack approach: O(n).

Process elements left to right. Maintain a decreasing stack. For each new element, while the stack is non-empty and the top is smaller than the current element, the current element is the "next greater" for the top. Pop it and record the answer.

This pattern solves: trapping rainwater, largest rectangle in histogram, stock span problem — all in O(n).

A deque (double-ended queue) allows insertion and deletion from both ends in O(1). This enables the Sliding Window Maximum problem to be solved in O(n):

Maintain a deque storing indices in decreasing order of values. For each new element, remove indices of smaller elements from the back (they can never be the maximum). Remove indices that have slid out of the window from the front. The front always holds the maximum index.

Implementing a queue using two stacks: one stack for enqueue, one for dequeue. When the dequeue stack is empty, pour all elements from the enqueue stack into it (reversing their order). Amortized O(1) per operation.

Implementing a stack using two queues: more complex — O(n) per push or O(n) per pop depending on the approach."""
},
advanced={
    "title": "Stack Frames, Call Stack Internals, and Lock-Free Queues",
    "body": """The call stack is one of the most important applications of stacks in computing. Every time a function is called, a stack frame is pushed containing local variables, the return address, and parameters. When the function returns, the frame is popped and execution continues from the saved return address.

Stack overflow occurs when recursion is too deep (or infinite), exhausting the call stack. Systems typically allocate 1-8MB for the call stack. Tail call optimization (TCO) in languages like Haskell and newer JavaScript reuses the current frame for tail-recursive calls, effectively converting recursion to iteration.

Converting recursive algorithms to iterative using an explicit stack: DFS traversal, recursive tree operations, and backtracking algorithms can all be implemented iteratively by simulating the call stack manually. This avoids stack overflow and often improves performance by reducing function call overhead.

Lock-free queues using atomic operations:
Michael-Scott Queue is the classic non-blocking queue used in concurrent systems. It uses CAS (Compare-And-Swap) atomic operations to enqueue and dequeue without locks. Two pointers (Head and Tail) are updated atomically. Threads that fail CAS retry, helping competing threads complete their operations first.

Memory reclamation in lock-free structures is tricky — you can't free a node if another thread might still be reading it. Hazard pointers and epoch-based reclamation are two approaches that safely handle this in production systems like Linux kernel's RCU (Read-Copy-Update)."""
})

seed_content("Trees & BST",
foundational={
    "title": "Trees and Binary Search Trees Fundamentals",
    "body": """A tree is a hierarchical data structure consisting of nodes connected by edges. Unlike linear structures (arrays, linked lists), trees branch out. Every tree has a root node at the top, and nodes below it are called children. Nodes with no children are leaves.

Key tree terminology:
Root: The topmost node with no parent.
Parent/Child: A node directly above/below another in the hierarchy.
Siblings: Nodes sharing the same parent.
Height: Longest path from root to a leaf.
Depth: Distance from the root to a specific node.
Subtree: A node and all its descendants.

A binary tree is a tree where each node has at most two children — left and right.

A Binary Search Tree (BST) adds an important ordering property: for any node, all values in its left subtree are smaller, and all values in its right subtree are larger. This property makes searching efficient.

BST operations:
Search: Compare target with current node. Go left if smaller, right if larger. O(h) where h is height.
Insert: Follow search path until reaching null, insert there. O(h).
Delete: Three cases — no children (simply remove), one child (replace with child), two children (replace with in-order successor).

For a balanced BST with n nodes, height h = O(log n), making operations O(log n). For a skewed BST (all left or all right), h = O(n), degrading to O(n) — no better than a linked list."""
},
intermediate={
    "title": "Tree Traversals, Balanced Trees, and Practical Applications",
    "body": """Tree traversals visit every node exactly once in a specific order. The three main depth-first traversals of binary trees:

In-order (Left → Root → Right): Visits nodes in ascending sorted order for a BST. Used to print BST contents in sorted order.

Pre-order (Root → Left → Right): Root is processed first. Used to create a copy of the tree, serialize tree structure, prefix expressions.

Post-order (Left → Right → Root): Root is processed last. Used to delete a tree (delete children before parent), evaluate expression trees, postfix expressions.

Level-order (Breadth-First): Uses a queue. Process all nodes level by level from root to leaves. Used to find shortest path, serialize/deserialize trees, find level-specific data.

Self-balancing BSTs maintain O(log n) height automatically:

AVL Trees: Strictly balanced — height difference between left and right subtrees of any node is at most 1. After every insert/delete, perform rotations to restore balance. Faster lookups than Red-Black trees.

Red-Black Trees: Less strictly balanced — height at most 2×log(n). Fewer rotations needed for inserts/deletes than AVL. Used in Java's TreeMap, Linux kernel's CFS scheduler, C++ STL map.

B-Trees: Generalize BSTs to have many keys per node. Minimize disk I/O by keeping nodes large (matching disk block size). Used in databases (MySQL, PostgreSQL) and file systems (NTFS, ext4)."""
},
advanced={
    "title": "Advanced Trees: Segment Trees, Fenwick Trees, and Tries",
    "body": """Segment Trees solve range query problems efficiently. Given an array, support range sum (or min/max) queries and point updates in O(log n) each.

Build: Recursively divide array in half. Each node stores the aggregate (sum/min) for its range. Build in O(n) time and O(n) space.
Query: Recursively combine results from child nodes whose ranges overlap the query range.
Update: Update the leaf, then propagate changes upward.
Lazy propagation extends segment trees to support range updates efficiently (e.g., add 5 to all elements in range [l,r]) in O(log n) instead of O(n).

Fenwick Trees (Binary Indexed Trees) solve the same prefix sum/point update problem with simpler code and half the memory. Each index stores a partial sum based on its lowest set bit. Update and query both run in O(log n).

Tries (Prefix Trees) store strings character by character, with each edge representing one character. Extremely efficient for:
Autocomplete: Insert all words, then traverse to the prefix node and DFS for all completions.
Spell checking: Insert dictionary words, then query each word.
Longest common prefix, word search in a grid.
Time complexity: O(m) for insert/search where m is the string length — independent of the number of stored strings.

Suffix Trees and Suffix Arrays solve advanced string problems like finding the longest repeated substring, pattern matching in O(n+m), and longest common substring of two strings — all in linear or near-linear time."""
})

seed_content("Hash Tables",
foundational={
    "title": "Hash Tables: Fast Lookups with Hash Functions",
    "body": """A hash table (also called hash map or dictionary) is one of the most powerful and widely-used data structures. It stores key-value pairs and provides average O(1) time for insertion, deletion, and lookup — regardless of how many items are stored.

The magic behind hash tables is the hash function. When you store a key, the hash function converts it into an integer (the hash code), which determines the index in an underlying array where the value is stored. When you look up the key, the same hash function calculates the same index, allowing direct access.

Example: Storing student grades by name.
- "Alice" → hash function → index 3 → store 95
- "Bob" → hash function → index 7 → store 87
- Looking up "Alice" → hash function → index 3 → retrieve 95

A good hash function:
Deterministic: Same input always produces the same output.
Uniform distribution: Maps inputs evenly across all indices, minimizing collisions.
Fast to compute: Adding overhead defeats the purpose.

Collisions occur when two different keys hash to the same index. Two main strategies handle collisions:
Separate Chaining: Each bucket holds a linked list of all entries that hash there. Simple but uses extra memory.
Open Addressing: If a bucket is occupied, probe for the next available slot using linear probing, quadratic probing, or double hashing.

Load factor (elements/capacity) determines when to resize. When load factor exceeds a threshold (typically 0.7), the table doubles in size and rehashes all entries."""
},
intermediate={
    "title": "Hash Function Design, Collision Resolution, and Performance",
    "body": """Designing good hash functions is both art and science. For integers, simple modular arithmetic works: h(k) = k mod m, where m is the table size (preferably prime to reduce clustering). For strings, polynomial hashing is standard: sum each character's value multiplied by a prime power.

Java's String.hashCode() uses: s[0]×31^(n-1) + s[1]×31^(n-2) + ... + s[n-1]. The choice of 31 is deliberate — it's prime and efficiently computed as (n << 5) - n.

Linear Probing: When slot h(k) is full, try h(k)+1, h(k)+2, etc. Simple but causes primary clustering — chains of consecutive occupied slots grow over time, slowing lookups.

Quadratic Probing: Try h(k)+1², h(k)+2², h(k)+3²... Reduces primary clustering but can cause secondary clustering.

Double Hashing: Use a second hash function for the probe increment: h(k,i) = h₁(k) + i×h₂(k). Best distribution among open addressing methods.

Robin Hood Hashing: A clever variant of linear probing. During insertion, if the new key is "richer" (closer to its ideal slot) than the existing key, swap them and continue inserting the displaced key. This minimizes variance in probe lengths, maintaining very fast average lookups even at high load factors.

Cuckoo Hashing: Use two hash tables and two hash functions. Each key can be in one of two locations. If both are occupied, kick out the existing key and reinsert it in its alternate location (like a cuckoo pushing other eggs out). O(1) worst-case lookup (check exactly two locations)."""
},
advanced={
    "title": "Consistent Hashing, Bloom Filters, and Distributed Hash Tables",
    "body": """Consistent hashing solves a critical problem in distributed systems: when adding or removing servers, how do you minimize data redistribution?

In standard hashing with n servers: server = hash(key) % n. Adding a server changes n, remapping nearly all keys — catastrophic for distributed caches.

Consistent hashing arranges servers on a conceptual ring (hash space 0 to 2³²). Each key is assigned to the first server clockwise from its hash position. Adding/removing a server only affects keys between the new server and its predecessor — O(k/n) keys instead of O(k).

Virtual nodes (vnodes) address uneven distribution: each physical server represents multiple positions on the ring (e.g., 150 virtual nodes per server). This ensures more even load distribution. Used by Amazon Dynamo, Apache Cassandra, and Memcached.

Bloom Filters are space-efficient probabilistic data structures that test if an element is in a set. They use k hash functions and a bit array. To add: set k bits. To query: check if all k bits are set.
False positives possible (says "maybe in set" when not).
False negatives impossible (if bits aren't all set, definitely not in set).
Memory: ~10 bits per element for 1% false positive rate — far more efficient than storing actual elements.
Applications: Chrome's malicious URL filter, database query optimization, cache invalidation.

Count-Min Sketch extends bloom filters to frequency estimation: approximate how often items appear in a stream, using far less memory than exact counting. Used in network traffic analysis and trending topic detection."""
})

seed_content("Graphs & Traversal",
foundational={
    "title": "Introduction to Graphs: Vertices, Edges, and Representations",
    "body": """A graph is a collection of vertices (nodes) connected by edges. Unlike trees, graphs can have cycles, multiple paths between vertices, and even disconnected components. Graphs model real-world relationships perfectly: social networks (people as vertices, friendships as edges), maps (cities as vertices, roads as edges), the internet (web pages as vertices, hyperlinks as edges).

Graph terminology:
Directed Graph (Digraph): Edges have direction. Following someone on Twitter (one-way) vs being friends (two-way).
Undirected Graph: Edges are bidirectional. Road connections between cities.
Weighted Graph: Each edge has a numerical weight (cost, distance, time).
Path: A sequence of vertices connected by edges.
Cycle: A path that starts and ends at the same vertex.
Connected Graph: Every vertex is reachable from every other vertex.
Degree: Number of edges connected to a vertex. In directed graphs: in-degree and out-degree.

Two main representations:
Adjacency Matrix: 2D array where matrix[i][j] = 1 (or weight) if there's an edge from i to j. O(1) edge lookup, O(V²) space — efficient for dense graphs.

Adjacency List: Array of lists where list[i] contains all neighbors of vertex i. O(V+E) space — efficient for sparse graphs (most real-world graphs). Edge lookup is O(degree).

The choice between representations depends on the graph's density (ratio of edges to vertices) and the operations needed. Most real-world graphs (social networks, road maps) are sparse, making adjacency lists the standard choice."""
},
intermediate={
    "title": "BFS, DFS, and Classic Graph Algorithms",
    "body": """Breadth-First Search (BFS) explores a graph level by level using a queue. Start at the source, enqueue it, then repeatedly dequeue a vertex, process it, and enqueue all unvisited neighbors. Mark vertices visited to avoid cycles.

BFS properties:
Explores vertices in order of increasing distance from source.
Finds shortest path in unweighted graphs.
Time: O(V+E). Space: O(V) for the queue.
Applications: Shortest path, social network friend recommendations, web crawlers.

Depth-First Search (DFS) explores as deep as possible before backtracking, using a stack (or recursion). Start at the source, mark visited, recursively visit each unvisited neighbor.

DFS properties:
Explores along a single path until hitting a dead end, then backtracks.
Time: O(V+E). Space: O(V) for the recursion stack.
Applications: Topological sort, cycle detection, finding connected components, solving mazes.

Dijkstra's Algorithm finds shortest paths from a single source in a weighted graph (non-negative weights). Uses a priority queue (min-heap) to always process the closest unvisited vertex. Time: O((V+E) log V) with a binary heap.

Bellman-Ford handles negative edge weights. Relaxes all edges V-1 times. Detects negative cycles. Slower at O(VE) but more versatile.

Floyd-Warshall finds shortest paths between all pairs of vertices in O(V³). Uses dynamic programming: distance[i][j] = min(direct path, path through vertex k) for each intermediate vertex k.

Kruskal's and Prim's algorithms find the Minimum Spanning Tree — the subset of edges that connects all vertices with minimum total weight, used in network design."""
},
advanced={
    "title": "Advanced Graph Algorithms: Network Flow, Strongly Connected Components",
    "body": """Maximum Flow problems model situations where you want to maximize flow through a network (water through pipes, data through networks, traffic through roads). Each edge has a capacity, and flow cannot exceed capacity.

Ford-Fulkerson Algorithm: Repeatedly find augmenting paths (paths with remaining capacity) from source to sink using DFS/BFS, and add flow along them. When no augmenting path exists, maximum flow is found. Time: O(Ef) where f is max flow — can be slow with bad path selection.

Edmonds-Karp Algorithm: Uses BFS for path selection, guaranteeing O(VE²) time regardless of flow values. The key insight: BFS finds shortest augmenting paths, and their lengths never decrease.

Dinic's Algorithm: More sophisticated, runs in O(V²E) — practical for large instances. Uses level graphs (BFS layers) and blocking flows.

Strongly Connected Components (SCCs): In a directed graph, an SCC is a maximal set of vertices where every vertex is reachable from every other.

Tarjan's Algorithm: Single DFS pass. Maintains a stack and discovery/low-link times. Each SCC is identified when a root node (where low-link equals discovery time) is found. O(V+E).

Kosaraju's Algorithm: Two DFS passes. First DFS on original graph records finish times. Second DFS on transposed (reversed) graph processes vertices in reverse finish time order. Each DFS tree in the second pass is an SCC. O(V+E).

SCCs are used in compiler optimizations, social network analysis (finding tight-knit communities), and deadlock detection in systems."""
})

seed_content("Sorting & Searching",
foundational={
    "title": "Sorting Algorithms: From Bubble Sort to Merge Sort",
    "body": """Sorting is one of the most fundamental operations in computer science. Organizing data in a particular order makes many other operations (like searching) much more efficient.

Bubble Sort: The simplest sorting algorithm. Repeatedly scan the array, comparing adjacent elements and swapping them if out of order. Each full pass "bubbles" the largest unsorted element to its correct position.
Time: O(n²) average and worst case.
Best for: Teaching concepts. Never used in production.

Selection Sort: Find the minimum element in the unsorted portion and swap it to the front. Repeat for the remaining unsorted portion.
Time: O(n²). Only n swaps — good when writes are expensive.

Insertion Sort: Build the sorted array one element at a time by inserting each new element in its correct position within the sorted portion (like sorting playing cards in hand).
Time: O(n²) worst case, O(n) best case (nearly sorted data).
Practical: Fast for small arrays and nearly-sorted data. Used as the base case in TimSort.

Merge Sort: Divide the array in half, recursively sort each half, then merge the sorted halves. Classic divide-and-conquer.
Time: O(n log n) always — consistent and predictable.
Space: O(n) — requires auxiliary array.
Stable: Equal elements maintain their original order.

Quick Sort: Choose a pivot, partition the array around it (smaller left, larger right), recursively sort the partitions.
Time: O(n log n) average, O(n²) worst case.
Space: O(log n) average — in-place.
In practice, often fastest due to excellent cache performance and small constants."""
},
intermediate={
    "title": "Advanced Sorting: Heap Sort, Counting Sort, and Radix Sort",
    "body": """Heap Sort uses a binary heap data structure to sort in-place. Build a max-heap from the array (O(n)), then repeatedly extract the maximum (swap root with last unsorted element, heap-down) to produce sorted output.
Time: O(n log n) guaranteed. Space: O(1). Not stable.
Advantage: Guaranteed O(n log n) with no extra memory — preferred when memory is severely constrained.

Comparison-based sorting lower bound: Any algorithm that sorts by comparing elements requires at least O(n log n) comparisons in the worst case. This is provable: there are n! possible orderings, and each comparison distinguishes at most two. Need at least log₂(n!) ≈ n log n comparisons. Merge Sort, Heap Sort, and ideal Quick Sort all achieve this optimal bound.

Breaking the lower bound with non-comparison sorts:
Counting Sort: Count occurrences of each value, compute cumulative counts for positions, place elements. O(n + k) where k is the range of values. Extremely fast when k is small.

Radix Sort: Sort by individual digits/characters from least significant to most significant (LSD) or most to least (MSD), using a stable sort at each level.
Time: O(d(n+k)) where d is the number of digits and k is the base. Faster than comparison sorts for integers with bounded values.

Bucket Sort: Distribute elements into buckets (ranges), sort each bucket independently, concatenate.
Time: O(n + k) average. Works well when input is uniformly distributed.

TimSort (used by Python and Java): Hybrid of Merge Sort and Insertion Sort. Identifies natural "runs" (already sorted sequences), extends short runs with Insertion Sort, then merges runs using Merge Sort's merge step. Excellent on real-world data that's partially sorted."""
},
advanced={
    "title": "Binary Search Variants and Order Statistics",
    "body": """Binary search is deceptively simple to describe but notoriously tricky to implement correctly. The key decisions: should mid be included or excluded from the next search range? What's the termination condition? Carefully chosen loop invariants eliminate bugs.

Finding the leftmost occurrence (lower bound): When the target is found, don't immediately return — record the position and continue searching left. This finds the first occurrence among duplicates.

Finding the rightmost occurrence (upper bound): When found, continue searching right.

Binary search on the answer: Many optimization problems can be solved by binary searching over the answer rather than the input. "What is the maximum load such that m workers can complete n tasks in d days?" Binary search on the load; for each candidate answer, check feasibility in O(n).

Quick Select (order statistics): Find the kth smallest element in O(n) average time using Quick Sort's partition. Partition around a pivot; if pivot lands at position k, return it. Otherwise, recurse on the appropriate partition. Median-of-medians guarantees O(n) worst case by choosing a good pivot.

External sorting handles datasets too large for memory. Merge Sort extends naturally: sort chunks that fit in memory (runs), write them to disk, then merge runs using a priority queue (k-way merge). The bottleneck becomes I/O — replacement selection generates longer-than-memory initial runs on average.

Parallel sorting: Merge Sort parallelizes naturally — sort each half on different processors. Bitonic Sort and odd-even merge sort are designed for parallel hardware (sorting networks), achieving O(log²n) parallel time with O(n log²n) total work."""
})


# ══════════════════════════════════════════════
# NETWORKS
# ══════════════════════════════════════════════

seed_content("Network Fundamentals",
foundational={
    "title": "How Computer Networks Work",
    "body": """A computer network is a collection of computing devices connected together to share resources and communicate. When you send a WhatsApp message, stream a YouTube video, or load a webpage, you're using a computer network.

Networks can be classified by size:
PAN (Personal Area Network): Devices within a few meters — Bluetooth headphones connected to your phone.
LAN (Local Area Network): A building or campus — your home WiFi, a school computer lab.
MAN (Metropolitan Area Network): A city — connecting multiple offices across town.
WAN (Wide Area Network): Global scale — the internet itself is the largest WAN.

Key network components:
End devices: Computers, phones, printers — devices that send and receive data.
Intermediary devices: Routers, switches, hubs — devices that forward and direct data.
Network media: Cables (copper, fiber optic) or wireless signals that carry data.

Transmission media types:
Twisted Pair Cable (Cat5e, Cat6): Copper wires twisted to reduce interference. Used in most home and office Ethernet connections. Up to 10 Gbps at short distances.
Fiber Optic Cable: Light pulses through glass fibers. Extremely fast (100+ Gbps), immune to electromagnetic interference, can span long distances. Used for internet backbone.
Wireless: Radio waves transmit data through the air. Convenient but susceptible to interference and security risks.

Bandwidth vs Latency: Bandwidth is how much data can flow (pipe width). Latency is how long it takes to travel (pipe length). High bandwidth doesn't mean low latency — a satellite connection can have high bandwidth but high latency (600ms delay) because signals travel 36,000km to orbit."""
},
intermediate={
    "title": "Network Topologies and the Client-Server Model",
    "body": """Network topology describes the arrangement of devices and connections. Physical topology is the actual cable layout; logical topology is how data flows.

Star Topology: All devices connect to a central switch. Most common in modern networks. Easy to add/remove devices. Single point of failure at the switch, but other devices are unaffected if one device fails.

Bus Topology: All devices share a single cable. Simple and inexpensive but slow (only one device can transmit at a time) and a cable break disrupts the entire network. Largely obsolete.

Ring Topology: Devices form a closed loop. Data travels in one direction until it reaches its destination. A break in the ring can disrupt the entire network. Used in older token ring and SONET fiber optic networks.

Mesh Topology: Every device connects to every other device. Maximum redundancy — multiple paths exist between any two points. Extremely reliable but expensive and complex to manage. Used in internet backbone and mission-critical networks.

The Client-Server Model is the dominant paradigm for network communication. Clients (your browser, app) request services. Servers (web servers, database servers) provide them. Benefits: centralized management, security, and resource sharing.

Peer-to-Peer (P2P) networks have no central server — every device can be both client and server. Used in BitTorrent, blockchain networks, and some video calling applications. More resilient (no single point of failure) but harder to manage and secure.

Protocols are agreed-upon rules for communication. Without protocols, devices couldn't understand each other — like two people speaking different languages. HTTP governs web browsing, SMTP governs email, FTP governs file transfer. All built on lower-level protocols like TCP/IP."""
},
advanced={
    "title": "Software-Defined Networking and Network Function Virtualization",
    "body": """Traditional networks embed control logic in each device (router, switch). This distributed approach is simple but inflexible — changing routing policies requires configuring each device individually.

Software-Defined Networking (SDN) separates the control plane (routing decisions) from the data plane (packet forwarding). A centralized SDN controller has a global view of the network and programs all forwarding devices through standardized APIs (like OpenFlow).

Benefits of SDN:
Centralized management: Configure the entire network from one place.
Programmability: Define network behavior in software, respond to conditions dynamically.
Vendor independence: Standard APIs decouple software from hardware.
Innovation: Try new routing algorithms without replacing hardware.

OpenFlow Protocol: The first widely-adopted SDN protocol. Controllers install flow tables in switches specifying how to handle each type of traffic. Switches forward packets based on these tables, asking the controller for instructions for unrecognized flows.

Network Function Virtualization (NFV) virtualizes network services traditionally running on dedicated hardware (firewalls, load balancers, WAN accelerators). Run them as software on standard servers.

NFV enables:
Elastic scaling: Spin up more firewall instances during attack, scale down later.
Rapid deployment: New service in minutes, not weeks of hardware procurement.
Cost reduction: Commodity hardware instead of expensive dedicated appliances.

The combination of SDN and NFV forms the foundation of modern cloud networking. AWS, Google Cloud, and Azure use these principles to manage millions of virtual machines with programmable, software-defined networks."""
})

seed_content("OSI Model",
foundational={
    "title": "The OSI Model: 7 Layers of Network Communication",
    "body": """The OSI (Open Systems Interconnection) model is a conceptual framework that describes how different network protocols interact. It divides network communication into 7 layers, each with specific responsibilities. This layered approach means each layer can change independently without affecting others.

The 7 layers from bottom (hardware) to top (user):

Layer 1 — Physical: Transmits raw bits over a physical medium. Concerned with voltages, cable types, pin layouts, and radio frequencies. Examples: Ethernet cables, fiber optic, WiFi radio signals.

Layer 2 — Data Link: Frames data for reliable node-to-node transmission. Handles MAC addresses and error detection. Examples: Ethernet, WiFi (802.11), PPP.

Layer 3 — Network: Routes packets between different networks using logical (IP) addresses. Makes internetworking possible. Examples: IP, ICMP (ping), routing protocols.

Layer 4 — Transport: Provides end-to-end communication between applications. Handles segmentation, flow control, and reliability. Examples: TCP (reliable), UDP (fast).

Layer 5 — Session: Manages sessions (connections) between applications — establishing, maintaining, terminating. Examples: NetBIOS, RPC.

Layer 6 — Presentation: Translates data formats, handles encryption and compression. Examples: SSL/TLS encryption, JPEG, ASCII vs Unicode conversion.

Layer 7 — Application: Provides network services directly to user applications. Examples: HTTP, FTP, SMTP, DNS.

Memory trick: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application). Data flows down the sender's stack, across the network, and up the receiver's stack."""
},
intermediate={
    "title": "TCP/IP vs OSI: The Practical Internet Model",
    "body": """While the OSI model is excellent for teaching concepts, the internet actually runs on the TCP/IP model (also called the Internet model), which has 4 layers that map to the OSI layers.

TCP/IP Layers:
Network Access (Link) Layer: Combines OSI layers 1+2. Handles physical transmission and local network protocols. Ethernet, WiFi.

Internet Layer: Corresponds to OSI layer 3. IP addressing and routing. IPv4, IPv6, ICMP.

Transport Layer: Corresponds to OSI layer 4. TCP and UDP.

Application Layer: Combines OSI layers 5+6+7. HTTP, FTP, DNS, SMTP.

The OSI model is theoretical; TCP/IP is practical. Real-world protocols don't always fit neatly into OSI layers — TLS (encryption) spans layers 4-7. This is why most network engineers use OSI for discussion but TCP/IP for implementation.

Encapsulation is the process of adding headers as data passes down the stack:
Application layer passes data to Transport layer.
Transport adds a TCP/UDP header (segment).
Network layer adds an IP header (packet).
Data Link adds a frame header and trailer (frame).
Physical transmits the bits.

At each layer, the receiving device uses the header to understand how to process the data, then strips it before passing up to the next layer. This is why layer n only communicates logically with layer n on the other device — each header is only meaningful to its corresponding layer.

Protocol Data Units (PDUs) by layer: bits (physical), frames (data link), packets (network), segments (transport), data (application)."""
},
advanced={
    "title": "Deep Dive: Layer 2 Internals and Ethernet Frame Structure",
    "body": """Ethernet, defined by IEEE 802.3, dominates wired LAN communication. Understanding its frame structure reveals how devices communicate on the same network segment.

Ethernet Frame Structure:
Preamble (7 bytes): 10101010... pattern that synchronizes receiver clock.
Start Frame Delimiter (1 byte): 10101011 — signals start of frame.
Destination MAC (6 bytes): Target device's hardware address.
Source MAC (6 bytes): Sender's hardware address.
EtherType/Length (2 bytes): Identifies encapsulated protocol (0x0800=IPv4, 0x0806=ARP, 0x86DD=IPv6) or payload length.
Payload (46-1500 bytes): The actual data being carried.
FCS (4 bytes): Frame Check Sequence — CRC error detection.

MAC (Media Access Control) addresses are 48-bit hardware addresses burned into NICs. First 3 bytes: OUI (Organizationally Unique Identifier) assigned to manufacturers. Last 3 bytes: device-specific. Written as XX:XX:XX:XX:XX:XX in hexadecimal.

CSMA/CD (Carrier Sense Multiple Access with Collision Detection) was Ethernet's original access method for shared media. Before transmitting: sense if medium is idle. If collision detected: stop, send jam signal, wait random backoff time, retry. Modern switched Ethernet is full-duplex and point-to-point — CSMA/CD is no longer needed but remains in the standard.

VLAN tagging (IEEE 802.1Q) inserts a 4-byte tag after the source MAC address. This allows switches to logically segment networks. The tag contains: 3-bit Priority Code Point (PCP) for QoS, 1-bit DEI (discard eligibility), and 12-bit VLAN ID (supporting up to 4094 VLANs).

STP (Spanning Tree Protocol, IEEE 802.1D) prevents broadcast storms by blocking redundant paths. RSTP (802.1w) converges in seconds vs minutes. MSTP (802.1s) runs multiple spanning tree instances per VLAN group."""
})

seed_content("TCP/IP Protocol Suite",
foundational={
    "title": "TCP/IP: The Foundation of Internet Communication",
    "body": """TCP/IP is the suite of protocols that powers the internet. It defines how data is formatted, addressed, transmitted, routed, and received. Understanding TCP/IP is essential for anyone working with networks, web development, or distributed systems.

IP (Internet Protocol): Every device on a network has an IP address — a unique numerical identifier. IPv4 uses 32 bits written as four numbers (e.g., 192.168.1.1). IPv6 uses 128 bits written in hexadecimal (e.g., 2001:0db8:85a3::8a2e:0370:7334) to address the exhaustion of IPv4 addresses.

Subnet masks define which part of an IP address is the network portion and which is the host portion. 192.168.1.0/24 means the first 24 bits (192.168.1) identify the network; the last 8 bits (0-255) identify devices on that network.

TCP (Transmission Control Protocol) provides reliable, ordered, connection-oriented communication. Before sending data, TCP establishes a connection via the three-way handshake:
1. Client sends SYN (synchronize) — "I want to connect"
2. Server responds with SYN-ACK — "OK, I'm ready"
3. Client sends ACK — "Great, let's go"

TCP guarantees delivery using acknowledgments. For every segment received, the receiver sends an ACK. If no ACK arrives within a timeout, the sender retransmits. Sequence numbers ensure data is reassembled in the correct order even if packets arrive out of sequence.

UDP (User Datagram Protocol) is the lightweight alternative — no connection, no guarantees, no acknowledgments. Just send packets and hope they arrive. Faster due to lower overhead. Used where speed matters more than perfect delivery: video streaming, online gaming, DNS queries, VoIP."""
},
intermediate={
    "title": "TCP Flow Control, Congestion Control, and IP Addressing",
    "body": """TCP Flow Control prevents a fast sender from overwhelming a slow receiver. The receiver advertises a receive window — the amount of data it can currently buffer. The sender never has more unacknowledged data outstanding than the window size.

The window dynamically adjusts: if the receiver's buffer fills up, it advertises window=0, pausing the sender. As the application reads data, the buffer frees up and the receiver advertises a larger window again.

TCP Congestion Control addresses a different problem: preventing a fast sender from overwhelming the network (not just the receiver). Four algorithms work together:

Slow Start: Begin with a small congestion window (cwnd=1 MSS). Double it each RTT. Grows exponentially until reaching the slow start threshold.

Congestion Avoidance: Above the threshold, grow linearly (add 1 MSS per RTT) instead of exponentially.

Fast Retransmit: If the sender receives 3 duplicate ACKs (meaning one packet was lost but later ones arrived), retransmit immediately without waiting for timeout.

Fast Recovery: After fast retransmit, halve cwnd instead of resetting to 1. Resume congestion avoidance rather than slow start.

IP Subnetting: CIDR (Classless Inter-Domain Routing) notation replaced the old Class A/B/C system. /24 = 256 addresses, /25 = 128, /16 = 65,536. Subnetting divides a large network into smaller segments for security and performance.

VLSM (Variable Length Subnet Masking) allows different subnets to have different sizes within the same network — efficient use of IP space. Critical for conserving IPv4 addresses.

NAT (Network Address Translation) maps private IP addresses to a single public IP. A home router with one public IP can serve many private devices. PAT (Port Address Translation) uses different port numbers to distinguish connections."""
},
advanced={
    "title": "IPv6, QUIC Protocol, and Modern TCP Optimizations",
    "body": """IPv6 was designed to replace IPv4, addressing exhaustion (4.3 billion IPv4 addresses allocated; IPv6 provides 3.4×10³⁸ addresses). But IPv6 brings more than address space:

Simplified header: IPv4 header is variable length with 12 fields; IPv6 header is fixed 40 bytes with 8 fields. More efficient routing.
No broadcast: IPv6 uses multicast and anycast instead of broadcast — reduces unnecessary traffic.
Built-in IPsec: Security is part of the protocol, not an add-on.
Stateless address autoconfiguration (SLAAC): Devices can configure their own IPv6 addresses without DHCP.
Flow labels: 20-bit field identifying traffic flows for QoS treatment.

QUIC (Quick UDP Internet Connections) is a modern transport protocol developed by Google, now standardized by IETF as the foundation of HTTP/3. Built on UDP, QUIC reimplements TCP reliability with key improvements:

0-RTT connection establishment: Returning clients can send data immediately (vs TCP's 1.5 RTT for TCP+TLS).
Connection migration: Connections survive IP address changes (critical for mobile devices switching networks).
Independent stream multiplexing: Multiple HTTP requests over one connection without head-of-line blocking (TCP's fatal flaw for HTTP/2).
Integrated encryption: TLS 1.3 is mandatory and integrated, not optional.

TCP optimizations in modern kernels:
BBR Congestion Control (Google): Measures actual bandwidth and round-trip time to control sending rate. Dramatically outperforms CUBIC on high-latency links.
TCP Fast Open: Send data in the SYN packet, reducing latency for short connections.
Multipath TCP (MPTCP): Use multiple network paths simultaneously — both WiFi and cellular. Increases throughput and resilience."""
})

seed_content("Routing & Switching",
foundational={
    "title": "How Routers and Switches Direct Network Traffic",
    "body": """Routers and switches are the backbone of modern networks. Understanding how they differ and work together is fundamental to networking.

Switches operate at Layer 2 (Data Link) using MAC addresses. A switch connects devices within the same network (LAN). When a frame arrives, the switch looks up the destination MAC address in its MAC address table (CAM table) and forwards it only to the correct port — not to all ports like a hub would.

MAC Learning: When a frame arrives, the switch records the source MAC address and the port it arrived on. Over time, the switch builds a complete map of which device is connected to which port. If a destination MAC isn't in the table yet, the switch floods the frame to all ports except the source — this is called unicast flooding.

Routers operate at Layer 3 (Network) using IP addresses. A router connects different networks and makes forwarding decisions based on IP addresses. When a packet arrives, the router consults its routing table to determine which interface to forward it on to reach the destination network.

The routing table contains: destination network, subnet mask, next hop (which router to send to next), and the outgoing interface. Routers choose the most specific matching route (longest prefix match).

ARP (Address Resolution Protocol) bridges Layer 2 and Layer 3. When a device wants to send a packet to an IP address on the same network, it needs the MAC address. ARP broadcasts a request ("who has IP x.x.x.x?") and the owner responds with its MAC address. Results are cached in the ARP table."""
},
intermediate={
    "title": "Routing Protocols: OSPF, BGP, and Spanning Tree",
    "body": """Routing protocols automate the process of learning and maintaining routes in a network. Without them, administrators would manually configure every route on every router — impossible at scale.

Interior Gateway Protocols (IGPs) operate within an autonomous system (AS) — typically a single organization's network:

RIP (Routing Information Protocol): The oldest dynamic routing protocol. Uses hop count (number of routers to traverse) as its metric. Maximum 15 hops — unsuitable for large networks. Sends full routing table every 30 seconds — wastes bandwidth. Simple to configure but largely obsolete.

OSPF (Open Shortest Path First): The dominant IGP. Uses Dijkstra's shortest path algorithm with link cost (based on bandwidth) as its metric. Routers exchange Link State Advertisements (LSAs) so every router has a complete map of the network. Fast convergence (detects failures in seconds). Hierarchical design with areas reduces routing table size. Used in most enterprise networks.

EIGRP (Enhanced Interior Gateway Routing Protocol): Cisco-proprietary hybrid — combines distance vector and link state features. Uses bandwidth and delay as composite metric. Very fast convergence using DUAL algorithm.

BGP (Border Gateway Protocol): The routing protocol of the internet, operating between autonomous systems (ISPs, large organizations). Path vector protocol — selects routes based on AS path, policies, and attributes. Extremely powerful and flexible but complex. Every internet route your traffic takes is determined by BGP.

STP (Spanning Tree Protocol): Switches can have redundant links for reliability, but loops cause broadcast storms (frames circulate forever). STP detects loops and blocks redundant paths, allowing only a tree structure with a single path between any two switches. Elects a root bridge; all other bridges calculate the shortest path to the root and block other paths."""
},
advanced={
    "title": "Advanced Routing: MPLS, SD-WAN, and BGP Traffic Engineering",
    "body": """MPLS (Multiprotocol Label Switching) was developed to speed up packet forwarding and enable traffic engineering. Instead of looking up destination IP addresses at every hop (slow), MPLS assigns short labels at the network edge and forwards based on labels (fast).

MPLS operation: At the ingress PE (Provider Edge) router, an IP packet is assigned a label based on its FEC (Forwarding Equivalence Class) — all packets with the same destination and QoS requirements. Core P (Provider) routers swap labels based on their Label Forwarding Information Base (LFIB) without examining IP headers. Egress PE removes the label.

Benefits: Fast forwarding, traffic engineering (explicitly route traffic along specific paths rather than shortest path), VPN services (MPLS VPN isolates customer traffic), QoS (different service classes for voice, video, data).

BGP Traffic Engineering allows network operators to control how traffic enters and exits their network. Incoming traffic: prepend your AS number multiple times to make your AS appear further away — other ASes prefer routes with shorter AS paths, directing traffic to your preferred ingress point. Outgoing traffic: use LOCAL_PREF attribute to prefer specific egress links.

SD-WAN (Software-Defined Wide Area Network) applies SDN principles to WAN connectivity. Traditional WAN uses expensive MPLS circuits. SD-WAN overlays software intelligence on cheaper internet connections:
Application-aware routing: Route video calls over the low-latency path, backups over the cheap path.
Active-active links: Use multiple WAN connections simultaneously, not just primary/backup.
Zero-touch provisioning: New branch sites configured automatically.
Centralized visibility: Monitor all WAN links from one dashboard.
Major providers: Cisco Viptela, VMware VeloCloud, Fortinet, Palo Alto Prisma SD-WAN."""
})

seed_content("Network Security",
foundational={
    "title": "Network Security Fundamentals: Threats and Defenses",
    "body": """Network security protects the integrity, confidentiality, and availability of data as it travels across networks. As more business and personal activity moves online, network security has become critically important.

The CIA Triad — the three core goals of security:
Confidentiality: Only authorized parties can read data. Achieved through encryption.
Integrity: Data hasn't been tampered with in transit. Achieved through hashing and digital signatures.
Availability: Services remain accessible to legitimate users. Achieved through redundancy and DoS protection.

Common network threats:
Eavesdropping/Sniffing: Intercepting unencrypted traffic. Anyone on the same network can capture packets using tools like Wireshark. Solution: encrypt all sensitive traffic (HTTPS, VPN).

Man-in-the-Middle (MitM): Attacker positions themselves between two communicating parties, intercepting and potentially modifying messages. ARP poisoning is a classic technique — the attacker sends fake ARP replies to redirect traffic through their machine. Solution: certificate pinning, HSTS, VPNs.

DoS/DDoS: Denial of Service floods a target with traffic, exhausting its resources. Distributed DoS uses thousands of compromised devices (botnets). Solutions: rate limiting, traffic scrubbing services (Cloudflare, Akamai).

Phishing: Tricking users into revealing credentials via fake websites or emails. The most successful attacks combine phishing with network exploits.

SQL Injection: Inserting malicious SQL into input fields to manipulate databases — though this is an application-layer attack, network monitoring can detect patterns.

Defense layers (Defense in Depth): No single security measure is sufficient. Layer multiple defenses — firewalls, IDS/IPS, VPNs, encryption, access control — so that compromising one layer doesn't mean compromising the entire system."""
},
intermediate={
    "title": "Firewalls, IDS/IPS, and Network Segmentation",
    "body": """Firewalls are the gatekeepers of network security, controlling traffic flow based on rules. Understanding the evolution of firewall technology reveals why modern networks need multiple layers of protection.

Packet Filtering (Generation 1): Inspects each packet independently based on source/destination IP, port, and protocol. Fast but stateless — doesn't understand connection context. A packet pretending to be a response to a non-existent request can slip through.

Stateful Inspection (Generation 2): Maintains a connection state table. Tracks TCP handshakes — only allows return traffic if an outbound connection was established first. More secure and still commonly used.

Application Layer / NGFW (Generation 3/4): Next-Generation Firewalls inspect application content regardless of port. Can identify and block Skype even on port 443, detect malware signatures, decrypt and inspect SSL traffic (SSL inspection), and apply user-based policies.

IDS (Intrusion Detection System) monitors network traffic for suspicious patterns and alerts administrators. Passive — doesn't block traffic. Signature-based detection matches known attack patterns; anomaly-based establishes a baseline of normal behavior and flags deviations.

IPS (Intrusion Prevention System) actively blocks detected threats in real-time. The detection engine is the same as IDS, but the response is automatic blocking rather than alerting.

Network Segmentation divides a network into isolated segments to limit damage from breaches. DMZ (Demilitarized Zone): Publicly accessible servers (web, mail) placed in a separate segment. If compromised, attackers can't directly reach the internal network.

VLANs provide logical segmentation on the same physical infrastructure. Microsegmentation extends this to individual workloads — even two VMs on the same host can't communicate unless explicitly allowed. Zero Trust architecture takes this further: trust nothing by default, verify everything."""
},
advanced={
    "title": "PKI, Certificate Authorities, and Zero Trust Security",
    "body": """Public Key Infrastructure (PKI) is the framework enabling secure communication over untrusted networks. Understanding PKI is essential for understanding HTTPS, VPNs, email signing, and code signing.

Asymmetric cryptography uses key pairs: a public key (shareable with anyone) and a private key (kept secret). Data encrypted with the public key can only be decrypted with the corresponding private key. Data signed with the private key can be verified by anyone with the public key.

Digital Certificates bind a public key to an identity. A certificate contains: subject (who it belongs to), public key, validity period, and the issuer's digital signature. Browsers trust certificates signed by trusted Certificate Authorities (CAs).

Certificate Authorities (CAs) are trusted third parties that verify identities and issue certificates. The CA chain: Root CAs (offline, heavily protected) → Intermediate CAs → End-entity certificates. Browser root stores contain ~100-150 trusted root CAs.

TLS Handshake (TLS 1.3):
1. Client sends ClientHello (supported cipher suites, random)
2. Server sends ServerHello (chosen cipher suite), Certificate, CertificateVerify, Finished
3. Client verifies certificate, sends Finished
4. Both derive session keys from key exchange

TLS 1.3 reduces handshake to 1 RTT (from 2 in TLS 1.2). 0-RTT resumption allows zero-round-trip reconnection using session tickets.

Zero Trust Security: Traditional perimeter security assumes everything inside the network is trusted. Zero Trust assumes breach — verify every request regardless of where it originates. "Never trust, always verify."

Zero Trust principles: Verify explicitly (authenticate and authorize every request using all available data points — identity, location, device health). Use least privilege access. Assume breach (minimize blast radius, use microsegmentation, encrypt end-to-end).

BeyondCorp (Google's Zero Trust implementation) shifted security from the perimeter to individual devices and users — employees work securely from any network without VPN."""
})

seed_content("Wireless Networks",
foundational={
    "title": "WiFi Fundamentals: How Wireless Networks Work",
    "body": """Wireless networking allows devices to connect to a network without physical cables, using radio waves to transmit data through the air. WiFi has become so ubiquitous that it's hard to imagine modern life without it.

How WiFi works: A wireless access point (AP) connects to the wired network and broadcasts radio signals at specific frequencies. Devices with WiFi adapters detect these signals and communicate with the AP. The AP acts as a bridge between wireless devices and the rest of the network.

WiFi Standards (IEEE 802.11):
802.11b (1999): 2.4 GHz, up to 11 Mbps. The original widely-adopted WiFi standard.
802.11g (2003): 2.4 GHz, up to 54 Mbps. More channels, backward compatible.
802.11n (2009) / WiFi 4: 2.4 & 5 GHz, up to 600 Mbps. Introduced MIMO (multiple antennas).
802.11ac (2013) / WiFi 5: 5 GHz, up to 3.5 Gbps. Multi-user MIMO, wider channels.
802.11ax (2019) / WiFi 6: 2.4, 5 & 6 GHz, up to 9.6 Gbps. OFDMA for better efficiency in dense environments.
WiFi 7 (2024): Up to 46 Gbps. Multi-Link Operation across multiple bands simultaneously.

Frequency Bands:
2.4 GHz: Longer range, better wall penetration, but only 3 non-overlapping channels and heavy congestion from microwaves, baby monitors, Bluetooth.
5 GHz: Shorter range, more channels (24 non-overlapping), less congestion, faster speeds.
6 GHz (WiFi 6E): New, clean spectrum with 59 non-overlapping channels. Minimal interference but limited range.

SSID (Service Set Identifier) is the network name you see when scanning for WiFi. An AP can broadcast multiple SSIDs (e.g., one for employees, one for guests) using different VLANs on the same hardware."""
},
intermediate={
    "title": "WiFi Security Protocols and Wireless Attack Vectors",
    "body": """Wireless networks present unique security challenges because anyone within range can attempt to intercept or connect to your network. Understanding WiFi security protocols is essential for protecting wireless communications.

Evolution of WiFi Security:
WEP (Wired Equivalent Privacy, 1997): The original WiFi security protocol. Fatally flawed — uses static keys and weak RC4 encryption. An attacker can crack WEP in minutes by capturing enough packets. Completely obsolete — never use WEP.

WPA (WiFi Protected Access, 2003): Emergency replacement for WEP. Uses TKIP (Temporal Key Integrity Protocol) which generates a new encryption key for each packet. Better than WEP but still vulnerable to TKIP attacks. Deprecated.

WPA2 (2004): Replaced TKIP with AES-CCMP encryption — significantly stronger. Two modes: Personal (pre-shared key/passphrase) and Enterprise (802.1X authentication with RADIUS server). WPA2-Personal is secure with a strong passphrase. WPA2-Enterprise provides per-user authentication.

WPA3 (2018): Addresses WPA2 weaknesses. Uses SAE (Simultaneous Authentication of Equals) replacing PSK — resistant to offline dictionary attacks. Even if someone captures the handshake, they can't brute-force the password offline. Forward secrecy: past sessions remain secure even if the key is later compromised.

Common Wireless Attacks:
Evil Twin Attack: Set up an AP with the same SSID as a legitimate network, stronger signal forces clients to connect. Intercept all traffic.
Deauthentication Attack: Send spoofed deauth frames (unauthenticated in 802.11!) to disconnect clients. Force reconnection to capture handshake for offline cracking.
WPS PIN Attack: WPS (WiFi Protected Setup) has a design flaw — the 8-digit PIN is checked in two 4-digit halves, reducing guesses from 10^8 to 10^4 + 10^3 = 11,000. WPS should be disabled.

Enterprise defenses: 802.1X with RADIUS authentication, certificate-based EAP methods (EAP-TLS), wireless IDS to detect rogue APs and deauth attacks."""
},
advanced={
    "title": "OFDMA, MU-MIMO, and WiFi 6/7 Technical Deep Dive",
    "body": """WiFi 6 (802.11ax) fundamentally changed how APs communicate with multiple clients simultaneously. Understanding these technologies explains why WiFi 6 dramatically outperforms WiFi 5 in dense environments.

OFDM (Orthogonal Frequency Division Multiplexing) divides the channel into many subcarriers transmitted simultaneously. Each subcarrier carries a small portion of the data. The "orthogonal" property means subcarriers don't interfere with each other.

WiFi 4/5 used OFDM where each transmission occupies the entire channel. One client uses all subcarriers at once.

WiFi 6 introduces OFDMA (Orthogonal Frequency Division Multiple Access) — divide subcarriers among multiple clients simultaneously within a single transmission. Instead of clients taking turns using the full channel, multiple clients share the channel in parallel. Dramatically improves efficiency in dense environments (airports, stadiums, offices with many connected devices).

Resource Units (RUs): The minimum allocation in OFDMA. A 20 MHz channel has 242 subcarriers, divided into RUs of 26, 52, 106, or 242 subcarriers. A client needing little bandwidth (IoT sensor) gets a small RU; a client streaming video gets a large RU.

MU-MIMO (Multi-User MIMO) allows an AP to communicate with multiple clients simultaneously using spatial streams. WiFi 5: 4 downstream spatial streams. WiFi 6: 8 spatial streams (both up and downstream). Beamforming directs signal energy toward specific clients rather than broadcasting omnidirectionally, improving signal quality.

Target Wake Time (TWT) is a WiFi 6 power management feature. The AP and client negotiate specific times when the client will wake to receive data. IoT devices can sleep for extended periods and wake on schedule, extending battery life dramatically.

WiFi 7 (802.11be) Multi-Link Operation (MLO) allows devices to simultaneously use 2.4, 5, and 6 GHz bands in one connection — aggregating bandwidth and enabling seamless failover between bands. 4K-QAM (vs 1024-QAM in WiFi 6) encodes more bits per symbol for 20% speed improvement."""
})

seed_content("Network Management",
foundational={
    "title": "Network Monitoring and Management Fundamentals",
    "body": """Network management encompasses the activities, methods, and tools used to maintain the health, performance, and security of a network. As organizations grow, managing networks manually becomes impossible — automation and monitoring tools become essential.

The FCAPS model describes five areas of network management:

Fault Management: Detect, isolate, and correct network faults. Set up alerts when a device goes down, a link fails, or error rates spike. Tools: SNMP traps, syslog, network monitoring platforms (Nagios, Zabbix, PRTG).

Configuration Management: Track and manage device configurations. Version control for router/switch configs. Detect unauthorized changes. Automate configuration deployment. Tools: Ansible, Puppet, SolarWinds NCM.

Accounting Management: Track network resource usage. Who is using how much bandwidth? Which applications generate the most traffic? Billing for metered services. Tools: NetFlow, IPFIX, sFlow.

Performance Management: Measure and optimize network performance. Monitor bandwidth utilization, latency, jitter, packet loss. Establish baselines, detect anomalies, predict capacity needs. Tools: Grafana, LibreNMS, Thousand Eyes.

Security Management: Monitor for threats and manage security policies. IDS/IPS alerts, firewall log analysis, vulnerability scanning. Tools: SIEM systems (Splunk, IBM QRadar), vulnerability scanners (Nessus).

SNMP (Simple Network Management Protocol) is the standard protocol for network device monitoring. Agents on devices collect data (interface counters, CPU load, memory) into a MIB (Management Information Base). The management station polls agents (SNMP GET) or receives alerts (SNMP traps) when thresholds are exceeded."""
},
intermediate={
    "title": "NetFlow, SNMP, and Network Performance Analysis",
    "body": """Understanding traffic flows in your network is essential for capacity planning, troubleshooting, and security. Several protocols capture and analyze network flow data.

NetFlow (developed by Cisco) captures metadata about each network conversation: source/destination IP, ports, protocol, byte count, packet count, start/end time, and interface. Unlike packet capture, NetFlow doesn't store packet payloads — it stores flow summaries. 

A "flow" is identified by the 5-tuple: source IP, destination IP, source port, destination port, protocol. NetFlow records all five elements plus timing and volume data.

NetFlow exporters (routers, switches) cache flow data and periodically send it to a NetFlow collector. The collector stores and analyzes the data. NetFlow v9 and IPFIX (its standardized version) support templates, allowing flexible field definitions.

Applications: Identify which application consumes most bandwidth, detect port scans (one source to many destinations on many ports), detect data exfiltration (large outbound flows to unusual destinations), capacity planning (historical traffic trends).

SNMP Deep Dive:
Community strings (SNMPv1/v2c) are basically passwords — "public" for read, "private" for write. These travel in cleartext — a major security issue. SNMPv3 adds authentication (MD5/SHA) and encryption (DES/AES).

MIB (Management Information Base) defines the structure of management data. The OID (Object Identifier) uniquely identifies each data point. e.g., 1.3.6.1.2.1.2.2.1.10 is the standard OID for interface octets received.

Network Baseline: Document normal behavior — typical bandwidth utilization by hour/day/week, normal CPU and memory ranges for each device type, typical error rates. Baselines make anomalies obvious. Without a baseline, you don't know what's abnormal."""
},
advanced={
    "title": "AIOps, Network Automation, and Observability",
    "body": """Modern networks generate more data than humans can analyze manually. Network automation and AIOps (Artificial Intelligence for IT Operations) are transforming how networks are managed.

Network Automation with Python and APIs: Traditional network management required SSH into each device and manual command entry — slow, error-prone, and non-scalable. Modern automation approaches:

NETCONF/YANG: XML-based protocol for programmatic network device configuration. YANG models define the structure of configuration data. NETCONF provides the transport. Allows atomic transactions — either all changes succeed or none do.

RESTCONF: REST API version of NETCONF. Uses HTTP verbs (GET, PUT, POST, DELETE) and JSON/XML. Much easier to work with programmatically.

Ansible for Network Automation: Agentless automation using playbooks. Cisco, Juniper, Arista all provide Ansible modules. "Infrastructure as Code" — store network configurations in version-controlled repositories. Roll out consistent configurations across hundreds of devices in minutes.

Observability vs Monitoring: Monitoring asks predefined questions about known metrics. Observability allows you to ask new questions about system state based on its outputs — metrics, logs, and traces.

The Three Pillars of Observability:
Metrics: Numeric measurements over time (bandwidth, CPU, error rate).
Logs: Timestamped records of events.
Traces: End-to-end tracking of a request across distributed systems.

AIOps applies machine learning to network operations:
Anomaly detection: Identify unusual traffic patterns without manually defining thresholds.
Root cause analysis: Correlate events across multiple systems to identify the true cause of an outage.
Predictive analytics: Predict failures before they occur based on trends and patterns.
Automated remediation: Automatically respond to incidents (restart a service, reroute traffic) faster than human operators."""
})


# ══════════════════════════════════════════════
# OS
# ══════════════════════════════════════════════

seed_content("OS Overview",
foundational={
    "title": "What is an Operating System and Why Do We Need One?",
    "body": """An operating system (OS) is the most fundamental software on a computer — it manages all hardware resources and provides an environment where application software can run. Without an OS, every application would need to directly control hardware, making software development enormously complex.

Think of the OS as the government of a computer: it creates and enforces rules, allocates resources (like a government allocates land, money, and services), and provides infrastructure that everyone shares without conflict.

What does an OS actually do?

Process Management: The OS creates, schedules, and terminates processes (running programs). Your computer runs many programs simultaneously — email, browser, music player — but might have only one CPU. The OS rapidly switches between them, creating the illusion of parallelism.

Memory Management: Programs need RAM to run. The OS allocates memory to programs that need it and takes it back when they're done. It prevents programs from accessing each other's memory (a bug in one program shouldn't crash others).

File System Management: The OS organizes data on disk into files and directories, handles reading and writing, and enforces access permissions. Without this, each program would need to manage raw disk sectors.

Device Management: Every hardware device needs software to control it — a driver. The OS provides a standard interface so applications don't need to know the specific details of your GPU, printer, or network card.

Security and Access Control: The OS enforces who can access what — which users can log in, which files they can read or write, which programs can run with elevated privileges.

Popular OS families: Windows (dominant desktop, enterprise), macOS (Apple hardware), Linux (servers, Android, embedded systems), iOS/Android (mobile)."""
},
intermediate={
    "title": "OS Architecture: Monolithic, Microkernel, and Hybrid Designs",
    "body": """The kernel is the core of the OS — the part that runs with full hardware privileges. How the kernel is structured affects security, performance, and reliability. Three main architectural approaches:

Monolithic Kernel: All OS services (file systems, device drivers, network stack, memory management, process scheduling) run in kernel space with full hardware access. A single large program handles everything.

Advantages: High performance — service calls don't require context switches between kernel components. Components can directly call each other.
Disadvantages: A bug in any component can crash the entire system. Large codebase is harder to maintain and audit. Adding a new driver requires modifying the kernel.

Examples: Linux, original Unix. Despite the disadvantages, Linux's monolithic approach is highly successful because of its modular design (loadable kernel modules) and extensive code review.

Microkernel: Only the most fundamental services run in kernel space: memory management, process scheduling, and IPC (inter-process communication). Everything else — file systems, drivers, network stack — runs as user-space processes.

Advantages: Isolation — a faulty driver crashes only itself, not the whole system. Easier to verify (smaller trusted computing base). Better for embedded/safety-critical systems.
Disadvantages: More context switches between user-space servers reduce performance. Serenity OS, QNX (used in BlackBerry, automotive systems), MINIX.

Hybrid Kernel: Runs more services in kernel space than pure microkernel but less than monolithic. Aims for the performance of monolithic with some isolation benefits of microkernel.

Examples: Windows NT (and all modern Windows versions), macOS/XP (based on Mach microkernel + BSD monolithic services in kernel space).

Exokernel: Research architecture where the kernel only manages hardware multiplexing, leaving all abstraction to libraries. Applications have maximum control over resources. Used to explore performance limits."""
},
advanced={
    "title": "System Calls Deep Dive, Interrupts, and Kernel Bypass",
    "body": """System calls are the primary interface between user space and the kernel. Understanding their implementation reveals how operating systems achieve both security and performance.

System Call Mechanism (x86-64 Linux):
User application executes syscall instruction with syscall number in rax register, arguments in rdi, rsi, rdx, r10, r8, r9.
CPU switches from ring 3 (user) to ring 0 (kernel) privilege level — protected mode transition.
Kernel looks up syscall number in the system call table (sys_call_table).
Kernel function executes with full hardware access.
CPU switches back to ring 3, return value in rax.

This privilege boundary is the fundamental security mechanism. Programs cannot directly access hardware or other processes' memory — they must ask the kernel via system calls.

Performance cost: Each system call takes ~100-1000ns due to privilege switching, cache effects (TLB flush), and spectre mitigations. High-frequency operations minimize system calls — read() large buffers rather than one byte at a time.

Interrupts allow hardware to asynchronously notify the CPU. When a network packet arrives, disk read completes, or timer fires, the device raises an interrupt. The CPU suspends current execution, saves state, jumps to the interrupt handler (ISR), handles the event, and restores state.

NAPI (New API) in Linux network stack reduces interrupt overhead for high-speed networking: after the first interrupt for a batch of packets, switch to polling mode. Process all available packets, then return to interrupt mode. Reduces per-packet overhead at high packet rates.

Kernel Bypass (DPDK, RDMA): For maximum performance (10M+ packets/second), eliminate kernel overhead entirely. DPDK (Data Plane Development Kit) runs network drivers in user space, with dedicated CPU cores polling for packets. Bypasses the kernel network stack entirely. Used in high-frequency trading, telco 5G, cloud providers."""
})

seed_content("Process Management",
foundational={
    "title": "Processes: The Foundation of Multitasking",
    "body": """A process is a program in execution — it's the basic unit of work in an operating system. When you open your browser, the OS creates a process for it. When you open a text editor, another process is created. The OS juggles all these processes to make it appear they run simultaneously.

A program is just static code on disk — a text file of instructions. A process is a program that has been loaded into memory and is running, with its own:
Memory space: Code segment (program instructions), data segment (global variables), heap (dynamically allocated memory), and stack (local variables, function calls).
CPU state: Current instruction (program counter), register values.
OS resources: Open files, network connections, process ID.

Process States:
New: The process is being created.
Ready: Loaded in memory, waiting for the CPU to be assigned.
Running: Instructions are currently being executed.
Waiting/Blocked: Waiting for some event (I/O completion, another process signal).
Terminated: Process has finished execution, but its entry remains until the parent reads its exit code.

The Process Control Block (PCB) is the OS's data structure for tracking each process. It stores all the information needed to save and restore a process: process ID, state, program counter, CPU registers, memory maps, open file descriptors, and accounting information.

Every process has a unique Process ID (PID). In Linux, PID 1 is init/systemd — the first process started by the kernel. All other processes are descendants. The PID 0 is the scheduler itself (not a user process).

Viewing processes: Use Task Manager (Windows) or ps/top/htop (Linux/macOS) to see running processes, their PIDs, CPU and memory usage."""
},
intermediate={
    "title": "Process Creation, IPC, and Signals",
    "body": """Process creation in Unix/Linux systems uses the fork-exec model. Understanding this model reveals how the shell works and why Unix system programming has the design it does.

fork() creates an exact copy of the calling process. Both parent and child continue execution from the point after fork(). The return value distinguishes them: parent receives child's PID (positive number), child receives 0. This copy-on-write — actual memory copying is deferred until a process modifies its data, avoiding unnecessary copying for processes that immediately exec.

exec() replaces the current process's memory image with a new program. The process keeps its PID but its code, data, and stack are completely replaced. The fork-exec combination creates a new process running a different program.

Shell workflow: When you type 'ls -la' in a shell:
Shell calls fork().
Child process calls exec("/bin/ls", {"-la"}).
Parent (shell) calls wait() to pause until child finishes.
When ls exits, parent resumes and prints the prompt.

Inter-Process Communication (IPC) allows processes to exchange data and synchronize:

Pipes: Unidirectional data channel. Output of one process → input of another. Shell pipe (ls | grep .txt) creates a pipe connecting ls's stdout to grep's stdin. Anonymous pipes work between related processes; named pipes (FIFOs) work between unrelated processes.

Shared Memory: Fastest IPC — map the same physical memory into multiple processes' address spaces. No copying — one process writes, another reads immediately. Requires synchronization (semaphores/mutexes) to prevent race conditions.

Message Queues: Processes exchange discrete messages. More structured than pipes. POSIX message queues provide priority-based message delivery.

Signals: Asynchronous notifications sent to a process. SIGTERM (terminate gracefully), SIGKILL (cannot be caught/ignored, force kill), SIGSEGV (segfault — illegal memory access), SIGALRM (timer expired). Signal handlers can override default behavior."""
},
advanced={
    "title": "Advanced Process Management: Namespaces, cgroups, and Containers",
    "body": """Linux namespaces provide the isolation primitive underlying containers. A namespace wraps a global system resource in an abstraction — processes in a namespace see only the resources in their namespace, not the global resource.

Linux namespace types:
PID namespace: Processes see only other processes in their namespace. PID 1 inside a container is the container's init process, not the host's systemd.
Network namespace: Independent network stack — interfaces, routing tables, firewall rules. Containers have their own virtual network interfaces.
Mount namespace: Independent file system view. A container sees only its own file system, not the host's.
UTS namespace: Independent hostname and domain name.
User namespace: Map user/group IDs — root inside the container maps to an unprivileged user on the host (rootless containers).
IPC namespace: Independent System V IPC and POSIX message queues.

cgroups (Control Groups) limit and account for resource usage by groups of processes:
CPU: Limit maximum CPU usage percentage, set relative weights.
Memory: Hard limits (OOM kill if exceeded) or soft limits (pressure).
I/O: Throttle disk read/write rates.
Network: Rate limiting (combined with traffic control).

How Docker uses namespaces and cgroups: Each container gets its own set of namespaces (isolation) and a cgroup (resource limits). The Docker daemon manages namespace creation and cgroup configuration. The container runtime (runc) actually creates the process within these namespaces.

Seccomp (Secure Computing Mode): Filters system calls available to a process. Docker's default seccomp profile blocks ~300 syscalls not needed by typical containers (e.g., keyctl, ptrace, perf_event_open). Reduces attack surface if container is compromised.

eBPF (Extended Berkeley Packet Filter) has revolutionized Linux observability and security. Small programs run safely in the kernel without modifying kernel source. Used for: network packet filtering (Cilium), performance tracing (bpftrace), security policy enforcement (Falco, Tetragon)."""
})

seed_content("CPU Scheduling",
foundational={
    "title": "CPU Scheduling: Deciding Who Runs Next",
    "body": """CPU scheduling is one of the most critical functions of an operating system. With multiple processes wanting to run simultaneously but limited CPU cores, the scheduler decides which process runs, when, and for how long.

Why scheduling matters: Poor scheduling leads to some processes never getting CPU time (starvation), slow response times for interactive applications, and poor overall system throughput. Good scheduling balances fairness, performance, and responsiveness.

Scheduling Goals:
CPU Utilization: Keep the CPU as busy as possible. Idle CPU time is wasted. Target: 40-90%.
Throughput: Number of processes completed per time unit.
Turnaround Time: Total time from process submission to completion.
Waiting Time: Total time spent in the ready queue waiting for CPU.
Response Time: Time from request submission to first response — critical for interactive processes.

FCFS (First Come, First Served): Simplest algorithm — processes run in arrival order, like a FIFO queue. Non-preemptive (once running, continues until completion or voluntary yield).

Problem: Convoy effect. If a long process arrives first, all subsequent short processes wait even though they could complete quickly. Average waiting time can be very high.

Example: Processes P1(24ms), P2(3ms), P3(3ms) arrive simultaneously.
FCFS order: P1, P2, P3. Waiting times: P1=0, P2=24, P3=27. Average=17ms.
SJF order: P2, P3, P1. Waiting times: P2=0, P3=3, P1=6. Average=3ms.

SJF (Shortest Job First): Schedule the process with the smallest CPU burst next. Optimal average waiting time. But requires knowing burst time in advance (difficult in practice) and can starve long processes."""
},
intermediate={
    "title": "Priority Scheduling, Multilevel Queues, and Completely Fair Scheduler",
    "body": """Priority Scheduling assigns a priority number to each process. The scheduler runs the highest-priority ready process. Two variants:

Preemptive Priority: If a new process arrives with higher priority than the current process, immediately preempt.
Non-preemptive: Current process finishes its CPU burst before higher-priority processes get a chance.

Problem: Starvation — low-priority processes may never run if high-priority processes keep arriving. Solution: Aging — gradually increase the priority of waiting processes over time.

Multilevel Queue Scheduling: Divide the ready queue into multiple queues based on process type. Each queue has its own scheduling algorithm:
Real-time queue: Highest priority, preempts everything.
System processes: Second priority.
Interactive processes: Round robin within the queue.
Batch processes: FCFS, lowest priority.

Scheduling between queues: Fixed priority (higher queues always preempt lower) or time slicing (80% of CPU to interactive queue, 20% to batch).

Multilevel Feedback Queue: Processes can move between queues based on behavior. A process using too much CPU time is demoted to a lower-priority queue. I/O-bound and interactive processes stay in high-priority queues. This dynamically separates CPU-bound and I/O-bound processes without requiring prior knowledge.

Linux's CFS (Completely Fair Scheduler): Linux uses CFS for regular processes — the goal is to give each process exactly its fair share of CPU time. CFS uses a red-black tree ordered by "virtual runtime" (time each process has run, weighted by priority/nice value). Always schedule the process with the minimum virtual runtime (leftmost in the tree). When a process runs, its virtual runtime increases. When it blocks, it stops increasing. When it becomes runnable again, it re-enters at its virtual runtime — which may now be smaller than others, giving it CPU time quickly."""
},
advanced={
    "title": "Real-Time Scheduling, Multicore Scheduling, and NUMA",
    "body": """Real-time systems must respond to events within guaranteed time bounds. Hard real-time: missing a deadline is catastrophic (aircraft control systems, medical devices, automotive brakes). Soft real-time: missing a deadline degrades quality but isn't catastrophic (video streaming).

Real-time scheduling algorithms:
EDF (Earliest Deadline First): Schedule the process whose deadline is earliest. Optimal for preemptive uniprocessor — can achieve 100% CPU utilization if the total CPU demand doesn't exceed 100%. Dynamic priority assignment.

Rate Monotonic Scheduling (RMS): Assign priority based on period — shorter period = higher priority. Static priority. Optimal for static-priority algorithms. The schedulability bound for n tasks: CPU utilization ≤ n(2^(1/n) - 1). For large n, this approaches ln(2) ≈ 69%.

Priority Inversion: A high-priority task is blocked waiting for a resource held by a low-priority task that is itself preempted by a medium-priority task. The Mars Pathfinder mission experienced a reset caused by priority inversion. Solution: Priority Inheritance Protocol — the low-priority task temporarily inherits the highest priority of tasks waiting for its resource.

Multicore Scheduling challenges:
Load balancing: Distribute work evenly across cores. Push migration (overloaded core pushes tasks to idle cores) or pull migration (idle core pulls from busy cores).

Processor Affinity: A process tends to stay on the same core (soft affinity) or is forced to (hard affinity). Cache warmth — a process's data is already in that core's cache, avoiding expensive cache misses.

NUMA (Non-Uniform Memory Access): In multi-socket servers, each CPU socket has local RAM (fast access) and remote RAM (accessed through interconnect, 2-3x slower). NUMA-aware schedulers keep processes and their memory on the same NUMA node. Linux's NUMA balancing detects and corrects hot pages being accessed remotely."""
})

seed_content("Memory Management",
foundational={
    "title": "Memory Management: How the OS Handles RAM",
    "body": """Memory management is one of the most complex and important functions of an operating system. The OS must juggle multiple programs sharing limited physical RAM while providing each program with the illusion of having the entire memory to itself.

Physical Memory: The actual RAM chips in your computer. Every byte has a unique physical address. Modern computers have gigabytes of RAM, but it's still finite.

Virtual Memory: Each process gets its own virtual address space — the illusion of a large, private memory. A 64-bit process can address up to 16 exabytes, far more than any physical RAM. The OS maps virtual addresses to physical addresses.

Why virtual memory?
Protection: Processes can't access each other's memory — each has its own virtual space. A bug in one program can't corrupt another.
Abstraction: Programs don't need to know physical memory locations. They use virtual addresses and the OS handles the rest.
More than RAM: Programs can use more memory than physically available through paging to disk.

Paging divides virtual address space into fixed-size chunks called pages (typically 4KB). Physical memory is divided into frames of the same size. The OS maintains a page table mapping virtual pages to physical frames. Not all pages need to be in physical memory simultaneously — some can be on disk.

The Memory Management Unit (MMU) is hardware that translates virtual addresses to physical addresses. Given a virtual address, the MMU splits it into a page number and offset. It looks up the page number in the page table to find the physical frame, then adds the offset to get the physical address. This translation happens for every memory access — hardware makes it extremely fast."""
},
intermediate={
    "title": "Page Tables, TLB, and Page Replacement Algorithms",
    "body": """Page tables map virtual pages to physical frames. With 4KB pages in a 64-bit address space, a flat page table would require 2^52 entries × 8 bytes = 32 petabytes per process — clearly impossible. Modern architectures use multi-level page tables.

Multi-level Page Tables: Split the virtual address into multiple indexes. x86-64 uses 4-level page tables (PGD → PUD → PMD → PTE). Each level is a 4KB table with 512 entries. Only allocate intermediate tables when needed — a process using only a small fraction of virtual space has a very sparse, memory-efficient page table.

TLB (Translation Lookaside Buffer): Translating every memory access through the page table hierarchy requires 4 memory accesses (for 4-level page tables) before reaching the actual data. Multiplying all memory accesses by 5 would be catastrophic.

The TLB is a hardware cache storing recent virtual-to-physical translations. A TLB hit provides translation in 1 cycle. A TLB miss requires walking the page table (4+ memory accesses) — expensive.

TLB size is typically 64-1024 entries. TLB coverage depends on page size: 512 4KB pages × 4KB = 2MB. Modern systems add support for huge pages (2MB, 1GB) to increase TLB coverage for memory-intensive applications.

Context switches flush the TLB (or use ASIDs — Address Space Identifiers — to tag TLB entries with process ID, avoiding full flush).

Page Replacement: When physical memory is full and a new page must be loaded, the OS must evict a page to disk. Which page to evict?

Optimal (OPT): Evict the page not used for the longest time in the future. Perfect but requires future knowledge — used as a benchmark.

LRU (Least Recently Used): Evict the page not used for the longest time in the past. Excellent approximation of OPT. Hardware LRU is expensive; software approximations (clock algorithm, aging) are practical.

Clock Algorithm (Second Chance): Circular list of pages with a reference bit. If reference bit is 0, evict. If 1, clear to 0 and advance. Used in Linux."""
},
advanced={
    "title": "Huge Pages, Memory-Mapped Files, and NUMA Memory Management",
    "body": """Huge Pages dramatically improve performance for memory-intensive applications by reducing TLB pressure. Standard 4KB pages mean an application using 1GB of memory needs 262,144 page table entries and generates many TLB misses. Huge pages (2MB on x86-64) reduce this to 512 entries.

Linux Huge Page support:
Static huge pages: Pre-allocated huge pages that applications explicitly request (mmap with MAP_HUGETLB). Most control but least flexible.
Transparent Huge Pages (THP): Kernel automatically backs anonymous memory with 2MB huge pages when possible. Applications need no changes. Background daemon (khugepaged) combines adjacent 4KB pages into 2MB pages.
HugeTLBfs: File system for huge page management, used by databases and VMs.

Performance impact: Redis, MySQL, MongoDB, Java JVM, and KVM virtual machines all benefit significantly from huge pages — 10-30% performance improvement is common.

Memory-Mapped Files (mmap): Map file contents directly into virtual address space. Access file data as if it were memory — no read/write system calls needed. The OS handles paging — pages are loaded from disk when accessed (demand paging) and written back lazily.

Benefits: Eliminates copies between kernel and user space (zero-copy for file access). Allows multiple processes to share the same physical pages (shared libraries loaded once, used by all processes). The OS can evict and reload pages transparently.

Memory Overcommit: Linux by default allows processes to allocate more memory than physically available, betting they won't all use it simultaneously. When memory is actually needed, the OS either uses swap space or invokes the OOM (Out Of Memory) killer, which terminates processes to free memory.

OOM killer scoring: The process to kill is selected based on memory usage, swap usage, CPU time, nice value, and whether it's a child of another process. The goal: free the most memory by killing the fewest important processes."""
})

seed_content("File Systems",
foundational={
    "title": "File Systems: Organizing Data on Storage",
    "body": """A file system is the method an operating system uses to organize and store data on storage devices. Without a file system, a disk would be a featureless sequence of sectors with no way to find or organize data. File systems provide the familiar abstraction of files and directories.

What is a file? A named collection of related data. The OS tracks each file's name, location on disk, size, permissions, and timestamps. From an OS perspective, a file is just a sequence of bytes — the OS doesn't care if it's text, an image, or an executable.

File types:
Regular files: Data files, programs, configuration files.
Directories: Special files containing a list of (filename, inode number) pairs for files within them.
Symbolic links: A file containing the path to another file — like a shortcut.
Device files: Represent hardware devices (in Linux, /dev/sda is your disk, /dev/null discards everything written to it).
Pipes and sockets: Used for IPC.

Directory structure: File systems organize files in a hierarchy of directories. The root directory (/ in Linux, C:\ in Windows) is the starting point. Path names describe the location: /home/user/documents/report.txt

File operations: create, delete, open, close, read, write, seek (move to position), stat (get metadata). The OS provides system calls for these operations; programming languages wrap them in higher-level APIs.

File permissions (Unix): Three categories — owner (u), group (g), others (o). Three permission types — read (r=4), write (w=2), execute (x=1). rwxr-xr-x means: owner can read/write/execute; group can read/execute; others can read/execute. Represented numerically as 755."""
},
intermediate={
    "title": "File System Internals: Inodes, Journaling, and VFS",
    "body": """Understanding file system internals reveals how the OS efficiently stores and retrieves data, and how it recovers from crashes.

Inode (Index Node): The data structure representing a file. Each file has exactly one inode containing: file size, owner UID/GID, permission bits, timestamps (creation, modification, access), link count (how many directory entries point to this inode), and pointers to data blocks.

Critically, the inode does NOT contain the filename. The filename is stored in the directory — a directory is a mapping of filenames to inode numbers. Multiple directory entries can point to the same inode — this is a hard link.

Block Pointers in ext2/ext3:
12 direct pointers → point directly to data blocks.
1 single indirect pointer → points to a block of pointers.
1 double indirect pointer → pointer to a block of pointers to blocks of pointers.
1 triple indirect pointer → three levels of indirection.
This scheme handles files from tiny to several terabytes.

Modern file systems (ext4, XFS, BTRFS) use extents instead of block pointers — a start block and length describing a contiguous run of blocks. Much more efficient for large files.

Journaling prevents file system corruption from unexpected shutdowns. Before modifying the file system, write the intended changes to a journal (circular log on disk). If power fails mid-operation, replay the journal on next mount to complete or undo partial operations.

Journal modes: writeback (journal metadata only), ordered (metadata journaled, data flushed before journal commit), data (both data and metadata journaled — safest but slowest).

VFS (Virtual File System): Linux's abstraction layer allowing multiple file systems to coexist. Applications call read()/write() system calls; VFS translates to the appropriate file system's operations (ext4_read, nfs_write, etc.). This is why you can mount ext4, NTFS, FAT32, NFS, and proc in the same directory tree."""
},
advanced={
    "title": "Copy-on-Write File Systems, ZFS, and Storage Technology",
    "body": """Copy-on-Write (CoW) file systems represent a fundamental rethinking of file system design. Instead of modifying data in place, CoW systems always write new data to new locations, then update metadata to point to the new location. Old data is only discarded when all references to it are gone.

Benefits of CoW:
Crash consistency: Since data is always written to new locations before metadata is updated, the file system is always in a consistent state. No journaling needed.
Snapshots: Taking a snapshot requires only saving a reference to the current metadata root — essentially free (O(1)). New writes create new blocks while the snapshot preserves the old blocks.
Data integrity: CoW file systems (ZFS, BTRFS) checksumming every block. Detect silent data corruption (bit rot) — RAID can't detect this because it doesn't know which copy is correct.
Deduplication: Identify identical blocks and store only one copy, updating all references to point to it.

ZFS (Zettabyte File System) combines CoW file system with volume manager:
Pools (zpools): Aggregate physical storage (disks, SSDs) into pools. Manage RAID configurations (mirrors, RAIDZ — ZFS's parity RAID). Automatically handle disk failures.
Datasets: Create multiple file systems (datasets) and block volumes within a pool, each with their own properties (compression, encryption, quotas, reservations).
ARC (Adaptive Replacement Cache): ZFS's intelligent in-memory cache that adapts between recently-used and frequently-used data.
L2ARC: SSD tier of caching between RAM and spinning disk.
ZIL (ZFS Intent Log): SSD-backed write log for synchronous write performance.

NVMe and Storage Evolution: NVMe (Non-Volatile Memory Express) connects SSDs directly to PCIe bus, achieving ~7GB/s sequential reads vs ~550MB/s for SATA SSDs. Queue depth of 64,000 vs 32 for AHCI. Latency drops from ~100μs to ~20μs.

The storage hierarchy (fastest to slowest): CPU registers → L1/L2/L3 cache → DRAM → NVMe SSD → SATA SSD → HDD → Tape."""
})

seed_content("Concurrency",
foundational={
    "title": "Concurrency and Synchronization: Managing Shared Resources",
    "body": """Concurrency is about managing multiple tasks that can be in progress simultaneously. When multiple threads or processes access shared data, we must carefully coordinate their actions to prevent incorrect results.

Why concurrency is hard: Consider two threads both incrementing a counter:
Thread 1: READ counter (gets 5)
Thread 2: READ counter (gets 5)
Thread 1: ADD 1 (gets 6)
Thread 2: ADD 1 (gets 6)
Thread 1: WRITE 6 to counter
Thread 2: WRITE 6 to counter
Result: counter = 6, but we expected 7!

This race condition occurs because the increment operation is not atomic — it's actually three operations (read, modify, write). The result depends on the unpredictable interleaving of threads.

Critical Section: A section of code that accesses shared resources and must not be executed by more than one thread at a time. We need mutual exclusion — only one thread in the critical section at a time.

Mutex (Mutual Exclusion Lock): A mutex protects a critical section. A thread acquires the mutex before entering, and releases it when done. Other threads that try to acquire a locked mutex are blocked until it's released.

Properties required for correct mutual exclusion:
Mutual Exclusion: Only one thread in the critical section at a time.
Progress: If no thread is in the critical section, one of the waiting threads must eventually get in.
Bounded Waiting: A thread must not wait indefinitely — there's a limit to how many times other threads can enter before this one gets a turn.
Performance: Shouldn't unnecessarily delay threads not trying to enter the critical section."""
},
intermediate={
    "title": "Semaphores, Monitors, and Classic Synchronization Problems",
    "body": """Semaphores are a more general synchronization primitive than mutexes. A semaphore has an integer value and two atomic operations: wait (P) which decrements the value and blocks if it would go negative, and signal (V) which increments the value and wakes a waiting thread.

Binary semaphore (value 0 or 1): Equivalent to a mutex.
Counting semaphore: Allows a fixed number of threads to access a resource simultaneously. Initialize with N — up to N threads can acquire simultaneously.

Classic synchronization problems test understanding of concurrent programming:

Producer-Consumer (Bounded Buffer): Producers add items to a buffer; consumers remove items. Buffer has fixed size. Need to prevent overflow (producer adding to full buffer) and underflow (consumer removing from empty buffer).
Solution: Use two semaphores — empty (initialized to buffer size) and full (initialized to 0) — plus a mutex for buffer access.

Readers-Writers: Multiple readers can read simultaneously, but a writer needs exclusive access. If writers are prioritized, readers may starve (and vice versa).
Basic solution: A reader holds a read lock (shared), a writer holds a write lock (exclusive). Track reader count — first reader acquires write-mutex, last reader releases it.

Dining Philosophers: Five philosophers around a table, alternately thinking and eating. Two chopsticks between each pair. A philosopher needs both neighboring chopsticks to eat. How to prevent deadlock and starvation?
Solutions: Allow only 4 philosophers to try simultaneously, acquire chopsticks in order (break circular wait), or use a waiter (centralized coordinator).

Monitors: High-level synchronization construct where shared data is encapsulated with the methods that access it. Only one thread can be active in the monitor at a time (mutual exclusion is automatic). Condition variables allow threads to wait inside the monitor for a condition to become true."""
},
advanced={
    "title": "Lock-Free Programming, Memory Models, and Transactional Memory",
    "body": """Lock-free programming eliminates locks to avoid deadlock, priority inversion, and lock contention overhead. Instead of preventing concurrent access, it allows concurrent operations and uses atomic operations to handle conflicts.

Compare-And-Swap (CAS): The foundation of lock-free programming. Atomically: if memory[addr] == expected, write new_value and return true; otherwise return false (don't modify). Implemented as a single atomic CPU instruction.

Lock-free stack push:
1. Read current head.
2. Set new node's next to current head.
3. CAS(head, current_head, new_node). If fails (head changed), retry from step 1.

ABA Problem: CAS checks only the value, not if the value changed and changed back. Thread 1 reads A from head. Thread 2 pops A, pushes B, pops B, pushes A back. Thread 1's CAS succeeds (head is still A) but the state changed beneath it.
Solution: Tagged pointers — attach a version counter to the pointer. ABA becomes A:1 → B:2 → A:3, which CAS detects.

Memory Models define how operations on shared memory are ordered across threads. Modern CPUs reorder memory operations for performance. Out-of-order execution, store buffers, and cache coherence protocols all affect visibility.

x86 has a strong memory model (Total Store Order): stores from a single thread are visible to other threads in program order. ARM/Power have weaker models with more reordering.

Memory barriers (fences) prevent reordering. acquire fence: all reads/writes after the fence happen after it. release fence: all reads/writes before the fence happen before it. Full fence: both directions.

C++ memory_order enum controls fence strength in atomic operations: relaxed (no ordering guarantees, just atomicity), acquire/release (suitable for producer-consumer), seq_cst (strongest, all operations globally ordered — default, safest).

Hardware Transactional Memory (HTM): CPU hardware (Intel TSX, IBM POWER) executes code speculatively as a transaction. If no conflicts occur, commit atomically. If conflict detected, abort and retry (or fall back to locks). Simplifies lock-free programming dramatically for short critical sections."""
})

seed_content("Deadlock",
foundational={
    "title": "Deadlock: When Processes Freeze Waiting for Each Other",
    "body": """A deadlock is a situation where a set of processes are all permanently blocked, each waiting for a resource held by another process in the set. No process can proceed — they're all waiting forever.

The classic real-world analogy: two cars on a single-lane bridge, one going each direction. Each car has entered the bridge and neither can back up (hold and wait). Neither car can move forward because the other is in the way (circular wait). This is a deadlock.

Four necessary conditions (Coffman conditions) — ALL must hold simultaneously for deadlock:

Mutual Exclusion: At least one resource is non-shareable — only one process can use it at a time. (A printer can only print one job at a time.)

Hold and Wait: A process is holding at least one resource and waiting to acquire additional resources held by other processes.

No Preemption: Resources cannot be forcibly taken from a process — they must be voluntarily released when the process is done.

Circular Wait: A circular chain of processes exists where each process holds a resource that the next process in the chain needs.

Deadlock example:
Process P1 holds Resource R1 and wants R2.
Process P2 holds Resource R2 and wants R1.
P1 waits for P2 to release R2. P2 waits for P1 to release R1. Neither releases. Deadlock!

Resource Allocation Graph: A graphical representation of the state of resources and processes. Circles are processes, rectangles are resources (with dots for instances). P → R (request edge) means process P is waiting for resource R. R → P (assignment edge) means resource R is currently assigned to process P. A cycle in this graph indicates a potential deadlock (definite deadlock if each resource has only one instance)."""
},
intermediate={
    "title": "Deadlock Prevention, Avoidance, and Detection Strategies",
    "body": """Three main strategies handle deadlock: prevention (ensure at least one Coffman condition never holds), avoidance (dynamically check that each allocation keeps the system safe), and detection/recovery (allow deadlock but find and recover from it).

Deadlock Prevention:
Eliminate Mutual Exclusion: Make resources sharable. Works for read-only resources (multiple processes can read simultaneously) but not for writable resources.

Eliminate Hold and Wait: Require processes to request all resources at once before starting. If not all available, the process waits without holding anything. Drawback: low resource utilization (holding resources not yet needed) and potential starvation.

Allow Preemption: If a process holding resources can't get the next resource it needs, preempt all its resources and wait for them all again. Works for resources whose state can be saved/restored (CPU registers, memory).

Eliminate Circular Wait: Impose a total ordering on resource types. Processes must request resources in increasing order. If P1 holds R1 (type 2) and wants R2 (type 5), fine. But P2 holding R2 (type 5) cannot request R1 (type 2) — it must release R2 first. This prevents circular chains from forming.

Deadlock Avoidance — Banker's Algorithm:
Named after a banker deciding whether to grant a loan. Before granting a resource, determine if the resulting state is "safe" — is there some ordering of all processes such that each can eventually complete?

Safe state: there exists a sequence of processes <P1, P2, ..., Pn> where for each Pi, the resources Pi still needs can be satisfied by currently available resources plus resources held by all Pj (j < i).

Banker's Algorithm steps:
1. When a process requests resources, pretend to grant them.
2. Run the safety algorithm on the new state.
3. If safe: grant. If unsafe: make the process wait.

Deadlock Detection: Allow deadlock to occur, periodically run detection algorithm (check for cycles in resource allocation graph). When detected: abort one or more processes or preempt resources."""
},
advanced={
    "title": "Distributed Deadlocks and Real-World Deadlock Case Studies",
    "body": """Distributed systems face deadlock challenges that are fundamentally harder than single-machine deadlocks because no single node has global knowledge of all resource allocations and wait relationships.

Distributed Deadlock Detection: Each node maintains a local wait-for graph (WFG) — which local processes are waiting for which other local processes. Periodically, nodes share their partial WFGs. A central coordinator merges them to look for global cycles. Decentralized algorithms (Chandy-Misra-Haas) propagate probe messages along wait edges; if a probe returns to its sender, a deadlock cycle exists.

Two-Phase Locking (2PL): The standard concurrency control protocol in databases. Growing phase: transaction can only acquire locks, not release. Shrinking phase: transaction can only release locks, not acquire.

Strict 2PL (used by most databases): Hold all locks until transaction commits or aborts. Prevents cascading aborts. Guarantees serializability but can cause deadlocks when two transactions need each other's locks.

Deadlock in databases: Most database systems (PostgreSQL, MySQL InnoDB) use lock-wait timeouts and deadlock detection. InnoDB builds a wait-for graph and detects cycles. When detected, it rolls back the transaction with the smallest rollback cost (fewest changes to undo).

Real-world deadlock incidents:
Mars Pathfinder (1997): A priority inversion (not true deadlock but related) caused the spacecraft's computer to reset repeatedly. A high-priority meteorological data thread was blocked waiting for a mutex held by a low-priority bus management thread, which was preempted by a medium-priority communications thread. Fixed by enabling priority inheritance.

PostgreSQL and lock escalation: Application-level deadlocks from implicit table locks during schema migrations. Lesson: use application-level timeouts, prefer online schema change tools (pg_repack, gh-ost).

Deadlock vs Livelock vs Starvation: Deadlock — processes blocked forever. Livelock — processes actively running but making no progress (both keep yielding to each other). Starvation — a process never gets resources due to other processes always being preferred."""
})

seed_content("I/O Management",
foundational={
    "title": "I/O Management: Connecting Software to Hardware",
    "body": """Input/Output (I/O) management is how the operating system handles communication between the CPU/memory system and external devices — keyboards, displays, disks, network cards, USB devices.

The challenge: I/O devices are thousands to millions of times slower than the CPU. A CPU can execute billions of instructions per second. A disk seek takes 5-10 milliseconds. A network round trip might take 100 milliseconds. If the CPU just waited for each I/O operation, it would be idle 99.9% of the time.

Types of I/O devices:
Character devices: Transfer data one character/byte at a time — keyboards, serial ports, some sensors.
Block devices: Transfer data in fixed-size blocks — hard drives, SSDs, USB drives.
Network devices: Send/receive variable-size packets — Ethernet cards, WiFi adapters.

I/O Methods:
Programmed I/O (PIO): CPU continuously polls the device status register to check if I/O is complete. Simple but wastes CPU cycles. Only practical for very fast devices where waiting is brief.

Interrupt-Driven I/O: CPU initiates I/O and continues doing other work. When I/O completes, device raises an interrupt. CPU saves current state, executes interrupt handler, resumes. Much more efficient than polling.

DMA (Direct Memory Access): For bulk transfers, DMA controller handles the entire transfer autonomously. CPU tells DMA: "transfer N bytes from disk sector X to memory address Y." CPU continues working. When complete, DMA raises an interrupt. CPU involved only at start and end — not for every byte.

Device Drivers: Software that understands how a specific hardware device works. Translates OS's generic I/O requests into device-specific commands. Hardware vendors write drivers for their devices. The driver model is why you can plug in any USB keyboard and it works — the OS has a generic HID (Human Interface Device) driver."""
},
intermediate={
    "title": "Disk Scheduling Algorithms and I/O Queuing",
    "body": """Hard disk drives (HDDs) have mechanical components — a spinning platter and a moving read/write head. Seek time (moving the head to the correct track) and rotational latency (waiting for the sector to rotate under the head) dominate I/O time. Disk scheduling algorithms optimize the order of disk accesses to minimize total head movement.

FCFS (First Come, First Served): Process requests in arrival order. Fair but can result in excessive head movement — requests might be scattered across the disk.

Example: Head at cylinder 53. Requests: 98, 183, 37, 122, 14, 124, 65, 67.
FCFS order: 53→98→183→37→122→14→124→65→67. Total movement: 640 cylinders.

SSTF (Shortest Seek Time First): Always service the request closest to current head position. Reduces average head movement but can starve distant requests if closer ones keep arriving.
Same example with SSTF: 53→65→67→98→122→124→37→14→183. Total movement: 236 cylinders. Much better!

SCAN (Elevator Algorithm): Head moves in one direction, servicing requests until it reaches the end, then reverses direction. Like an elevator — picks up passengers going the same direction.
Same example with SCAN: 53→65→67→98→122→124→183→37→14. Total: 208.

C-SCAN (Circular SCAN): Head moves in one direction only. When it reaches the end, jumps back to the beginning without servicing requests. More uniform wait times than SCAN.

SSDs change the calculus: No mechanical parts means no seek time or rotational latency. Random and sequential access have nearly identical performance. FCFS often works fine. NVMe SSDs have 64,000 command queues with queue depth 64,000 each — multiple requests can be handled simultaneously. Wear leveling algorithms distribute writes evenly across flash cells to maximize lifespan."""
},
advanced={
    "title": "I/O Scheduling in Linux, io_uring, and Storage Performance",
    "body": """Linux I/O Scheduler evolution reflects the changing storage landscape:

CFQ (Completely Fair Queuing): The default scheduler for many years. Maintains a queue per process, allocates equal time slices to each, provides fairness. Good for desktop workloads but poor for SSDs (unnecessary complexity) and databases (poor latency).

Deadline Scheduler: Maintains sorted queues by sector (for efficiency) plus FIFO queues with deadlines. Guarantees requests are served within their deadline (500ms for reads, 5000ms for writes by default). Better for databases and SSDs.

BFQ (Budget Fair Queuing): Sophisticated scheduler that tracks per-process I/O budgets and provides excellent latency for interactive workloads. Default for HDDs in modern Linux.

None (mq-none): No scheduling — passes requests directly to the driver. Ideal for NVMe SSDs with their own internal queues and parallelism.

io_uring: The revolutionary Linux 5.1+ async I/O interface. Traditional async I/O in Linux was limited and inconsistent. io_uring uses two lock-free ring buffers shared between kernel and user space:
Submission Queue (SQ): User space writes I/O requests here.
Completion Queue (CQ): Kernel writes completion events here.

The key insight: For non-blocking operations, no system calls needed after setup. User space writes to SQ and reads from CQ without entering the kernel. A single io_uring_enter() system call can submit multiple operations at once.

Fixed buffers: Pre-register buffers with io_uring to avoid per-operation kernel mapping.
Fixed files: Pre-register file descriptors to avoid per-operation fd lookup.

Performance: io_uring can achieve millions of IOPS on NVMe SSDs with very low CPU overhead. Applications like QEMU, RocksDB, and nginx are adopting io_uring for maximum storage performance.

Storage Performance Analysis: Use iostat, blktrace, fio for benchmarking. Key metrics: IOPS (operations per second), throughput (MB/s), latency (microseconds), queue depth (how many outstanding operations). Understanding your workload pattern (sequential vs random, read vs write, large vs small blocks) determines the optimal storage solution."""
})

seed_content("Virtualization",
foundational={
    "title": "Virtualization: Running Multiple OS on One Machine",
    "body": """Virtualization allows multiple virtual machines (VMs), each running a complete operating system, to share a single physical computer's hardware. From each VM's perspective, it appears to have dedicated hardware — it doesn't know or care about other VMs on the same machine.

Why virtualization matters:
Before virtualization: A company needed 10 servers but each ran at 5-15% capacity — 85-95% of hardware went unused. Energy, cooling, and hardware costs were enormous.
With virtualization: All 10 workloads run on 2-3 physical servers at 70-80% utilization. Massive cost and energy savings.

What gets virtualized:
CPU: The hypervisor schedules VMs onto physical CPUs, giving each VM the illusion of dedicated processors.
Memory: Each VM has its own virtual memory address space mapped to physical RAM.
Storage: VMs see virtual disks (files on the host's storage) as if they were real disks.
Network: Virtual network interfaces connect to virtual switches, which connect to physical network interfaces.

Hypervisor (Virtual Machine Monitor): The software layer that creates and manages VMs.

Type 1 (Bare-Metal): Runs directly on hardware, no host OS. VMs run on top. Examples: VMware ESXi, Microsoft Hyper-V, Citrix XenServer, KVM (Linux kernel).
Type 2 (Hosted): Runs as an application on a host OS. Easier to install and use. Examples: VMware Workstation, Oracle VirtualBox, Parallels Desktop.

Type 1 hypervisors have less overhead (no host OS layer) and are used in production data centers. Type 2 hypervisors are easier to set up and are used for development and testing.

Snapshots: Virtual machines can be "frozen" at any point in time. The entire state (memory, disk, CPU registers) is saved. You can revert to the snapshot later — invaluable for testing (try a risky change, revert if it breaks something) and backup."""
},
intermediate={
    "title": "How Hypervisors Work: CPU, Memory, and I/O Virtualization",
    "body": """Implementing a hypervisor requires virtualizing every hardware component a guest OS might use. Understanding how this works reveals both the elegance and complexity of modern virtualization.

CPU Virtualization:
x86 processors have four privilege levels (rings 0-3). OSes run in ring 0 (most privileged); applications in ring 3. A guest OS also wants to run in ring 0, but the hypervisor must intercept privileged operations.

Ring deprivileging: Run the guest OS in ring 1 (or 3 for user-mode virtualization). Privileged instructions cause a trap to the hypervisor (ring 0). The hypervisor emulates the instruction and returns control.

Problem: Some x86 instructions behave differently when executed in ring 3 vs ring 0, but don't trap — they silently fail or return wrong values. VMware's original approach: binary translation — scan the guest's binary code and replace problematic instructions with safe equivalents.

Hardware-Assisted Virtualization (Intel VT-x, AMD-V): Modern CPUs add a new privilege level below ring 0: VMX root mode (hypervisor) and VMX non-root mode (guest). Guest OS runs in non-root ring 0 with its own virtual ring 0 — no deprivileging needed. VM exits (traps to the hypervisor) only for truly privileged operations. 10-30% performance overhead, dramatically reduced from software-only virtualization.

Memory Virtualization:
Guest OS manages guest virtual → guest physical address mapping (guest page tables).
Hypervisor manages guest physical → host physical mapping (extended page tables or shadow page tables).
2D address translation: guest virtual → guest physical → host physical.

Intel EPT (Extended Page Tables) / AMD NPT (Nested Page Tables): Hardware support for 2D page table walking. Single TLB miss now walks two page tables but hardware handles both levels. Much faster than shadow page tables.

I/O Virtualization:
Pure emulation: Hypervisor emulates standard devices (e.g., Intel e1000 NIC). Guest uses standard drivers. High compatibility but high CPU overhead.
Paravirtualization (virtio): Guest knows it's virtualized. Uses optimized virtual device interface (virtio). Requires modified guest drivers but dramatically better performance.
SR-IOV (Single Root I/O Virtualization): Physical NIC presents multiple independent virtual functions (VFs) directly to VMs. Near-native performance — hypervisor not in the data path for I/O."""
},
advanced={
    "title": "Container Internals, KVM Architecture, and Live Migration",
    "body": """KVM (Kernel-based Virtual Machine) is Linux's built-in hypervisor, integrated since Linux 2.6.20. Its architecture is elegantly simple: it turns the Linux kernel itself into a Type 1 hypervisor by loading a kernel module.

KVM architecture:
The KVM kernel module (/dev/kvm) provides the virtualization infrastructure.
QEMU (Quick EMUlator) provides device emulation and management.
Together, QEMU+KVM creates complete VMs: KVM handles CPU/memory virtualization (using hardware VT-x/AMD-V), QEMU handles device emulation (disk, network, USB).
Each VM is a standard Linux process from the host's perspective — schedulable, monitored with ps/top, killable.

Memory management in KVM:
Each VM is a Linux process with a large memory mapping (the guest's physical RAM).
Linux's memory management applies — VMs benefit from huge pages, NUMA affinity, KSM (Kernel Samepage Merging).
KSM scans memory of all VMs and merges identical pages (copy-on-write). Multiple VMs running the same OS share identical OS pages — significant memory savings.

Live Migration: Moving a running VM from one physical host to another without detectable downtime. This is one of virtualization's most powerful capabilities.

Pre-copy migration process:
1. Iteratively copy memory pages from source to destination while the VM continues running.
2. Track dirty pages (modified since last copy). Copy dirty pages, which generates new dirty pages.
3. As iteration count increases, remaining dirty pages decrease.
4. At some threshold (dirty pages small enough to copy very quickly), pause the VM.
5. Copy final dirty pages, CPU state, and device state.
6. Resume VM on destination.
7. Total pause time: typically 10-100ms — imperceptible to most applications.

Post-copy (newer approach): Transfer CPU state first, start VM immediately on destination with almost no memory. Fetch memory pages on demand (page faults trigger remote page fetch from source). Shorter total migration time but requires network reliability.

Container vs VM security comparison: VMs provide stronger isolation (full kernel separation, hardware-enforced boundaries) but more overhead. Containers share the host kernel — a kernel vulnerability can potentially escape the container. Defense-in-depth for containers: seccomp, AppArmor/SELinux, read-only root filesystems, rootless containers, gVisor (runs container in a user-space kernel)."""
})


# ══════════════════════════════════════════════
# SE
# ══════════════════════════════════════════════

seed_content("SDLC Models",
foundational={
    "title": "Software Development Life Cycle Models",
    "body": """The Software Development Life Cycle (SDLC) is the process used to plan, create, test, and deliver software. Without a structured process, projects tend to run over budget, miss deadlines, and fail to meet user needs. SDLC models provide frameworks that guide development from initial concept to deployed product.

Core phases present in most SDLC models:
Planning: Define the project scope, resources, timeline, and cost estimates. What are we building and why?
Requirements Analysis: Understand what the software must do. Gather requirements from stakeholders.
System Design: Plan how the software will be built — architecture, database design, technology choices.
Implementation (Coding): Actually build the software following the design.
Testing: Verify the software works correctly and meets requirements.
Deployment: Release the software to users.
Maintenance: Fix bugs, add features, adapt to changing needs.

Waterfall Model: The original SDLC model, developed in the 1970s. Phases are completed sequentially — you finish one phase completely before starting the next, like water flowing down a waterfall.

Strengths: Clear milestones, extensive documentation, easy to understand and manage. Works well when requirements are stable and well-understood.
Weaknesses: Inflexible — requirements changes late in the project are expensive. Users don't see the product until the end. Discovering fundamental design flaws during testing is very costly.

When to use Waterfall: Government contracts with fixed requirements, embedded systems with well-understood requirements, projects where full documentation is required (medical devices, aircraft systems).

Iterative and Incremental Development: Instead of delivering everything at once, deliver the software in pieces (increments). Each increment adds new functionality. Feedback from users after each increment guides the next one. Better than pure Waterfall for handling changing requirements."""
},
intermediate={
    "title": "Agile, Scrum, and Kanban: Modern Development Approaches",
    "body": """The Agile Manifesto (2001) was a response to the failures of heavyweight, rigid processes like Waterfall. It established four values and twelve principles that have transformed software development.

Agile Values:
Individuals and interactions over processes and tools.
Working software over comprehensive documentation.
Customer collaboration over contract negotiation.
Responding to change over following a plan.

Scrum is the most widely adopted Agile framework. It organizes work into Sprints — time-boxed iterations typically 1-4 weeks long. At the end of each sprint, a potentially shippable product increment is delivered.

Scrum roles:
Product Owner: Represents stakeholders. Defines and prioritizes the Product Backlog (the ordered list of all desired features). Decides what gets built next.
Scrum Master: Facilitates the Scrum process. Removes impediments. Coaches the team. Not a project manager — serves the team.
Development Team: Self-organizing cross-functional team (developers, testers, designers). Decides how to accomplish the Sprint Goal.

Scrum ceremonies:
Sprint Planning: Team selects items from Product Backlog for the Sprint, creates Sprint Backlog.
Daily Standup: 15-minute daily sync — what did I do yesterday, what will I do today, what's blocking me.
Sprint Review: Demonstrate completed work to stakeholders, gather feedback.
Sprint Retrospective: Team reflects on how to improve — process, tools, relationships.

Kanban: Visualize workflow on a board (columns: To Do, In Progress, Done). Limit work-in-progress (WIP limits) to prevent overloading the team. Focus on flow — move cards through the board smoothly. No prescribed iteration lengths. Better for operations/support work with unpredictable arrivals.

Scrumban: Hybrid combining Scrum's planning structure with Kanban's flow-based WIP limits."""
},
advanced={
    "title": "DevOps, Continuous Delivery, and Software Quality Metrics",
    "body": """DevOps is the philosophy and practice of breaking down silos between Development and Operations teams. Traditionally, developers wrote code and "threw it over the wall" to operations, who deployed and maintained it. This created friction, slow deployments, and blame-shifting. DevOps integrates both disciplines.

DevOps CALMS framework:
Culture: Shared responsibility, collaboration, learning from failures (blameless postmortems).
Automation: Automate everything possible — builds, tests, deployments.
Lean: Eliminate waste, optimize flow, reduce batch size.
Measurement: Measure everything — deployment frequency, lead time, MTTR, change failure rate.
Sharing: Share knowledge, tools, success, and failure across teams.

The Four Key DevOps Metrics (DORA metrics):
Deployment Frequency: How often do you deploy to production? Elite: on-demand (multiple per day). Low: less than monthly.
Lead Time for Changes: How long from commit to production? Elite: less than 1 hour.
Mean Time to Restore (MTTR): How long to recover from an incident? Elite: less than 1 hour.
Change Failure Rate: What percentage of deployments cause incidents? Elite: 0-15%.

Continuous Integration (CI): Developers frequently merge code to the main branch (multiple times per day). Each merge triggers an automated build and test suite. Broken builds are fixed immediately — never leave the build broken. Prevents "integration hell" from long-lived feature branches.

Continuous Delivery (CD): Every commit that passes CI is automatically deployed to a staging/pre-production environment and is ready to deploy to production at any time. Deployment to production is a business decision, not a technical one.

Continuous Deployment: Every commit that passes CI/CD automatically deploys to production without human intervention. Netflix, Facebook, Amazon do this — deploying thousands of times per day.

Feature Flags (Feature Toggles): Deploy code to production without activating it. Turn features on/off per user segment. Decouple deployment from release. Dark launches — deploy and test with internal users before public release."""
})

seed_content("Requirements Analysis",
foundational={
    "title": "Gathering and Documenting Software Requirements",
    "body": """Requirements analysis is the process of understanding what a software system must do and defining those needs clearly. It's the foundation of the entire development process — if you build the wrong thing perfectly, you've still failed.

The requirements disaster: Studies consistently show that requirements errors are the most expensive type of software defect to fix. A requirement error caught during analysis costs $1 to fix. The same error caught in testing costs $10. In production: $100-$200. Getting requirements right early has enormous ROI.

Types of Requirements:
Functional Requirements: What the system must do. Specific behaviors, features, and functions. "The system shall allow users to register with email and password." "Users shall be able to search products by name, category, or price range."

Non-functional Requirements (Quality Attributes): How well the system performs. Performance: "The search must return results in under 500ms for 99% of queries." Security: "All passwords must be stored as bcrypt hashes." Availability: "The system must be available 99.9% of the time." Scalability: "The system must support 100,000 concurrent users."

Business Requirements: Why the system is being built. Goals and objectives from the business perspective. "Reduce customer checkout time to increase conversion rate by 15%."

User Requirements: What users need to accomplish. Typically expressed as use cases or user stories.

Stakeholders: Everyone with an interest in the system — customers, end users, managers, developers, operations, legal, security. Each group has different requirements that may conflict. The requirements analyst's job is to gather, reconcile, and prioritize these needs.

Requirements elicitation techniques: Interviews (most common), workshops (collaborative sessions with multiple stakeholders), observation (watch users do their current job), questionnaires, prototyping (build a rough version to elicit feedback), document analysis (study existing system documentation)."""
},
intermediate={
    "title": "User Stories, Acceptance Criteria, and Requirements Prioritization",
    "body": """User stories are the dominant format for expressing requirements in Agile development. They're short, user-centered descriptions written from the perspective of who benefits from the feature.

User story format: "As a [type of user], I want [some goal] so that [some reason]."
Example: "As a registered customer, I want to save my payment information so that I can checkout faster on future purchases."

Why user stories work: They force teams to think about who uses the feature and why. They're small enough to fit in a sprint. They invite conversation. They defer implementation details until needed.

INVEST criteria for good user stories:
Independent: Can be developed in any order without dependencies.
Negotiable: Not a contract — details are worked out through conversation.
Valuable: Delivers value to users or business.
Estimable: Team can estimate the effort required.
Small: Fits within a single sprint.
Testable: Can write acceptance criteria that clearly define "done."

Acceptance Criteria define specifically when a user story is complete. They're the conditions that must be satisfied for the story to be accepted.

Gherkin format (Given-When-Then):
Given [the user is on the checkout page and has items in their cart]
When [the user clicks "Save Payment Information"]
Then [the payment information is saved to their account] and [the user sees a confirmation message] and [the payment info appears in their account settings]

Story mapping: Arrange user stories into a 2D map. Horizontal axis: user activities in sequence (from left to right represents the user's journey). Vertical axis: priority within each activity. Horizontal slices represent releases. Great for planning incremental delivery."""
},
advanced={
    "title": "Domain-Driven Design and Requirements Modeling Techniques",
    "body": """Domain-Driven Design (DDD) is an approach to software development where the domain model — the conceptual model of the business domain — is the primary focus of design. Complex business domains require deep understanding before designing software.

Ubiquitous Language: The core concept of DDD. Develop a shared vocabulary that is used consistently by developers and domain experts. Not "user entity" but "Customer." Not "product table" but "Catalog." The code should reflect the language of the business. If a domain expert says "invoice is submitted for payment" the code should have submitForPayment() on an Invoice class.

Bounded Contexts: Large domains can't be modeled as a single unified model — different parts of the business use the same terms differently. A "Customer" in the Sales context (potential buyer) is different from a "Customer" in the Fulfillment context (entity with orders to ship).

Bounded contexts explicitly define where a particular domain model applies. Within each context, terms have precise meanings. Context maps describe how bounded contexts integrate — shared kernel, customer/supplier, conformist, anticorruption layer.

Event Storming: A collaborative workshop technique for exploring complex business domains. Put domain experts and developers in a room. Use sticky notes to map Domain Events (things that happen in the business — OrderPlaced, PaymentProcessed, ItemShipped). Group events into Aggregates (consistent units of state). Identify Commands (what triggers events), Read Models (what users need to see), and External Systems.

Behavior-Driven Development (BDD): Extends TDD by writing tests in natural language that all stakeholders can read. Tests serve as living documentation. Gherkin scenarios (Given-When-Then) become executable tests using frameworks like Cucumber or SpecFlow. BDD bridges the communication gap between business stakeholders and developers."""
})

seed_content("UML Design",
foundational={
    "title": "UML Diagrams: Visualizing Software Systems",
    "body": """UML (Unified Modeling Language) is a standardized visual language for modeling software systems. Created in the 1990s by merging three competing object-oriented modeling languages (Booch, OMT, OOSE), UML became the industry standard for documenting software architecture.

Why use UML? Complex software systems are difficult to describe in text alone. A diagram can communicate structure and behavior that would require pages of text. UML provides standardized notation that any trained developer understands.

UML diagram categories:

Structural Diagrams (static view — what the system is):
Class Diagram: The most common UML diagram. Shows classes, their attributes and methods, and relationships between them. The blueprint of object-oriented design.
Component Diagram: Shows how software components are organized and their dependencies.
Deployment Diagram: Shows how software is deployed on hardware — which servers run which components.
Package Diagram: Shows how classes are organized into packages/modules.

Behavioral Diagrams (dynamic view — what the system does):
Use Case Diagram: Shows system functionality from the user's perspective. Actors and their interactions with the system.
Sequence Diagram: Shows how objects interact in time-ordered sequence of messages.
Activity Diagram: Shows workflow and business processes — similar to flowcharts.
State Machine Diagram: Shows the states an object can be in and transitions between states.

Interaction Diagrams (subset of behavioral — showing object interactions):
Sequence Diagram: Time-ordered message exchanges.
Communication Diagram: Same information as sequence but emphasizes relationships.
Timing Diagram: Shows state changes over time — useful for real-time systems.

You don't need to use all 14 UML diagram types. In practice, class diagrams, sequence diagrams, and use case diagrams cover most documentation needs. Choose diagrams that add value — don't create diagrams for their own sake."""
},
intermediate={
    "title": "Class Diagrams: Relationships, Patterns, and Best Practices",
    "body": """Class diagrams are the foundation of object-oriented design documentation. Mastering class diagram notation enables clear communication of system structure.

Class notation: A box divided into three sections.
Top: Class name (in bold, CamelCase). Abstract classes are italicized or marked {abstract}.
Middle: Attributes (field name: type). Visibility: + public, - private, # protected, ~ package.
Bottom: Methods (methodName(parameters): returnType).

Relationships — from loosest to strongest coupling:

Dependency (dashed arrow →): The weakest relationship. Class A uses class B temporarily (as a parameter or local variable). "A depends on B." A change to B might require changes to A.

Association (solid line): A structural relationship — class A has a reference to class B. Can be navigable (arrow) or bidirectional (no arrow). Label with role names and multiplicity: 1 (exactly one), * (zero or more), 1..* (one or more), 0..1 (zero or one).

Aggregation (hollow diamond on "whole" side): "Has-a" relationship with independent lifecycles. A Car has Wheels, but Wheels exist independently of the Car. The diamond is on the "whole" (Car) side.

Composition (filled diamond): Stronger "has-a" relationship with dependent lifecycles. A House has Rooms. If the House is destroyed, Rooms don't exist independently. Child cannot exist without parent.

Inheritance/Generalization (hollow triangle arrow): "Is-a" relationship. Points to the parent class. Dog extends Animal. The ArrowHead points to the superclass.

Realization/Implementation (dashed line with hollow triangle): A class implements an interface. Dashed because interface has no implementation.

Design Principles in Class Diagrams:
Single Responsibility: Each class has one reason to change.
Open/Closed: Open for extension, closed for modification.
Liskov Substitution: Subtypes must be substitutable for their base types.
Interface Segregation: Many specific interfaces over one general interface.
Dependency Inversion: Depend on abstractions, not concretions."""
},
advanced={
    "title": "Architecture Documentation: C4 Model and ADRs",
    "body": """Modern software architecture documentation has evolved beyond UML. Teams need documentation that's easy to create, maintain, and understand at different levels of detail.

The C4 Model (Context, Containers, Components, Code) by Simon Brown provides a hierarchical approach to architecture diagrams that maps to natural "zoom levels."

Level 1 — System Context Diagram: The "big picture." Show the software system in the center, with the people who use it and other systems it interacts with around it. Answers "what does this system do and who uses it?" Even non-technical stakeholders can understand this.

Level 2 — Container Diagram: Zoom into the system. Show the major technical building blocks (containers — web apps, databases, microservices, message queues). Each container is separately deployable/runnable. Answers "what are the major pieces and how do they communicate?"

Level 3 — Component Diagram: Zoom into a single container. Show the components (groupings of related code) inside it and their relationships. Answers "how is this container structured internally?"

Level 4 — Code: UML class diagrams or similar showing implementation details. Often auto-generated from code. Only create for the most complex or important components.

Architecture Decision Records (ADRs): Document important architectural decisions in lightweight structured text files stored in the code repository.

ADR format:
Title: Short noun phrase describing the decision.
Status: Proposed, Accepted, Deprecated, Superseded.
Context: What situation led to this decision? What forces are at play?
Decision: What is the decision? State it in full sentences.
Consequences: What are the positive and negative results of this decision?

Why ADRs matter: Months later, no one remembers why a decision was made. New team members wonder "why do we do it this way?" ADRs provide institutional memory. They force explicit reasoning about trade-offs.

Architecture fitness functions (Evolutionary Architecture): Automated tests that verify architectural characteristics are maintained. Check that no cyclic dependencies exist, all components stay within defined layers, performance thresholds are met. Prevent architectural decay from accumulating refactoring debt."""
})

seed_content("Testing Strategies",
foundational={
    "title": "Software Testing: Why, What, and How",
    "body": """Software testing is the process of evaluating a system to find defects and verify that it meets its requirements. Every significant software system has bugs — testing helps find and fix them before users encounter them.

Why testing matters: The cost of fixing a defect increases dramatically the later it's found. A requirement error caught immediately costs $1 to fix. The same error found by a customer costs $100-$1000 and damages reputation. Testing is insurance — you pay a small cost now to avoid a large cost later.

Types of bugs testing can find:
Functional bugs: Feature doesn't work as specified.
Performance bugs: Feature works but is too slow.
Security vulnerabilities: Feature can be exploited.
Usability issues: Feature works but is confusing to users.
Compatibility issues: Feature works on some platforms but not others.

Testing levels (from bottom to top of the testing pyramid):

Unit Testing: Test individual units (functions, methods, classes) in isolation. Fast (milliseconds per test), cheap to write, precise (narrow down exactly what's broken). Should constitute the majority of your tests.

Integration Testing: Test how multiple units work together. Verify that database queries work correctly, APIs integrate properly, services communicate as expected. Slower than unit tests.

System Testing (End-to-End): Test the complete system from a user's perspective. Simulate real user interactions through the UI. Slowest, most expensive to write and maintain, but most closely validates actual user experience.

Acceptance Testing: Verify the system meets business requirements. Often involves actual users or domain experts. User Acceptance Testing (UAT) is the final validation before deployment.

The testing pyramid: Many unit tests → fewer integration tests → few end-to-end tests. Inverted pyramids (many E2E tests) are common anti-patterns — expensive to maintain, slow to run, and brittle."""
},
intermediate={
    "title": "Test-Driven Development, Mocking, and Test Quality",
    "body": """Test-Driven Development (TDD) is a development technique where tests are written before the code they test. This sounds counterintuitive but has profound effects on software design and quality.

The TDD cycle (Red-Green-Refactor):
Red: Write a failing test. It should fail because the feature doesn't exist yet. The test defines exactly what behavior is needed.
Green: Write the minimum amount of code to make the test pass. Don't worry about elegance — just make it work.
Refactor: Improve the code while keeping all tests passing. Improve design, remove duplication, clarify intent.
Repeat: Write the next test.

Benefits of TDD:
Design: Writing the test first forces you to think about the interface before implementation. This leads to more modular, loosely-coupled design — because tightly coupled code is hard to test.
Coverage: Tests written first naturally have high coverage.
Safety net: A comprehensive test suite lets you refactor confidently.
Documentation: Tests serve as living documentation of expected behavior.

Test Doubles: Controlled replacements for real dependencies in tests:
Fake: A working implementation suitable for testing but not production (in-memory database instead of real PostgreSQL).
Stub: Returns hardcoded values for specific method calls. Doesn't verify anything.
Mock: Verifies that specific methods were called with specific arguments. The test will fail if the expected calls weren't made.
Spy: Records all interactions for later assertion.

When to mock: Mock external dependencies (databases, APIs, file systems) to make tests fast and deterministic. Don't mock your own code — if you feel the need to mock the thing being tested, your design needs improvement.

Test quality indicators:
Tests should be deterministic (same result every run).
Tests should be independent (not depend on other tests).
Tests should test behavior, not implementation.
Test names should clearly describe what they verify."""
},
advanced={
    "title": "Property-Based Testing, Mutation Testing, and Performance Testing",
    "body": """Property-Based Testing: Instead of writing specific examples, define properties that must always hold for all inputs. The testing framework generates hundreds of random inputs and verifies the property holds.

Example: For a sorting function, instead of testing sort([3,1,2]) == [1,2,3], define properties:
The output has the same length as the input.
The output is in non-decreasing order.
Every element in the output was in the input.
The framework (QuickCheck in Haskell, Hypothesis in Python, fast-check in JavaScript) generates thousands of random inputs and verifies all three properties.

Property-based testing finds edge cases you'd never think to test manually: empty lists, single elements, duplicates, maximum values, unicode characters.

Mutation Testing: Measures the quality of your test suite. The tool automatically creates "mutants" — copies of your code with small modifications (change + to -, flip a boolean, remove a conditional). For each mutant, run your tests. If the tests catch the mutation (fail), the mutant is "killed." If tests still pass, the mutant "survived."

A high mutation score (percentage of mutants killed) means your tests are actually verifying behavior. Surviving mutants reveal tests that don't assert anything meaningful or coverage that doesn't actually test the logic.

Performance Testing types:
Load Testing: Verify system behavior under expected load. Establish baseline performance.
Stress Testing: Push beyond normal limits to find breaking points. Where does the system fail?
Spike Testing: Sudden large increases in load. Can the system handle sudden viral traffic?
Soak Testing: Extended periods of normal load. Find memory leaks, resource exhaustion over time.
Chaos Engineering (Netflix): Intentionally introduce failures in production (kill servers, introduce latency) to verify the system handles failures gracefully. Builds confidence in resilience."""
})

seed_content("Version Control",
foundational={
    "title": "Git: Version Control for Modern Software Development",
    "body": """Version control systems (VCS) track changes to code over time, allow multiple people to collaborate without overwriting each other's work, and enable reverting to previous states. Git is the dominant version control system used in virtually all modern software development.

Why version control is essential:
History: Every change is recorded — who changed what, when, and why. Invaluable for debugging ("when did this break?").
Collaboration: Multiple developers work on the same codebase without conflicts.
Branching: Experiment with new features without affecting stable code.
Recovery: Accidentally deleted important code? Git has it.

Git fundamentals:

Repository: A directory tracked by Git. Contains all files and the complete history of every change.

Working Directory: Your local files as they appear on disk. You edit files here.

Staging Area (Index): A preparation area for commits. You explicitly add files to the staging area before committing. This allows you to craft precise commits.

Repository (Local): Your local database of all commits, branches, and history.

Remote: A repository on another server (GitHub, GitLab, Bitbucket). Multiple people can push/pull changes.

Basic workflow:
git init or git clone — create or copy a repository.
Edit files in the working directory.
git add file.txt — stage changes.
git commit -m "description" — save a snapshot to history.
git push — upload commits to remote.
git pull — download and merge changes from remote.

Commits: A commit is a snapshot of all tracked files at a specific point in time. Each commit has a unique SHA hash, author, timestamp, and commit message. Good commit messages are crucial — "fixed bug" is useless; "Fix null pointer exception in user authentication when email contains unicode" is valuable.

.gitignore: A file listing patterns of files Git should not track — compiled binaries, log files, environment variables (.env), IDE configuration files, node_modules, etc."""
},
intermediate={
    "title": "Branching Strategies, Merging, and Collaborative Workflows",
    "body": """Branching allows multiple streams of development to happen simultaneously. A branch is a lightweight, movable pointer to a specific commit. Creating a branch doesn't copy any files — it just creates a new pointer.

Common branch types:
main/master: The primary branch. Always production-ready.
feature branches: "feature/user-authentication", "feature/payment-system". For developing new features.
bugfix branches: "bugfix/login-error". For fixing specific bugs.
release branches: "release/v2.0". For preparing a release.
hotfix branches: "hotfix/security-patch". For urgent production fixes.

Merging strategies:

Fast-forward merge: When the feature branch is directly ahead of main (no divergent commits), Git simply moves the main pointer forward. No merge commit. Creates linear history. Clean but loses information about when a branch was merged.

Three-way merge: When branches have diverged (both have commits the other doesn't), Git creates a merge commit combining both histories. Records that a branch was merged. History is more informative but less linear.

Rebase: Instead of creating a merge commit, rebase replays the feature branch commits on top of main. Creates linear history as if the feature was always developed after the current main. Cleaner history but rewrites commit hashes — never rebase shared branches.

Squash: Combine all feature branch commits into a single commit before merging. Clean main branch history with atomic feature commits. Loses granular development history.

Pull Request (PR) workflow:
1. Create a feature branch.
2. Implement changes, commit frequently.
3. Push branch to remote.
4. Open a Pull Request — describe changes, add reviewers.
5. Reviewers comment, request changes, or approve.
6. Address feedback, push more commits.
7. Once approved, merge into main.
8. Delete feature branch.

Code review in PRs serves multiple purposes: catch bugs, improve design, share knowledge, maintain standards. Great code reviews are thorough but constructive — review the code, not the person."""
},
advanced={
    "title": "Git Internals, Monorepos, and Advanced Workflows",
    "body": """Understanding Git's internal data model reveals why it's so powerful and flexible. Git is fundamentally a content-addressable filesystem — a key-value store where the key is the SHA-1 hash of the content.

Git Object Types:
Blob: Stores file content. Nothing else — no filename, no permissions. Two files with identical content share one blob.
Tree: Stores a directory listing — maps filenames to blobs (files) or other trees (subdirectories). References blobs and trees by their SHA hashes.
Commit: Points to a tree (root directory snapshot), references parent commits, stores author, committer, timestamp, and message.
Tag: Names a specific commit.

Every commit stores the complete snapshot of all tracked files, not just the diff. This sounds wasteful but is efficient because identical files share blobs. Git compresses and packs objects in packfiles for efficient storage.

Reflog: Git maintains a reference log of all changes to HEAD and branch pointers. Even "deleted" commits remain accessible through the reflog for 90 days. This is how you recover from accidental git reset --hard or branch deletion.

Monorepos: Storing multiple related projects in a single repository. Used by Google (single repository for all code), Facebook, Uber, Twitter.

Advantages: Atomic cross-project commits ("fix API and update all clients in one commit"), shared tooling, simplified dependency management, easier code sharing.
Disadvantages: Repository size, slower git operations, complex CI/CD (don't want to build everything on every change).

Tools for monorepo management: Turborepo (JavaScript/TypeScript), Bazel (Google's build system), Nx, Lerna.

Git LFS (Large File Storage): Git is not designed for large binary files — they bloat the repository since git stores every version. Git LFS stores large files on a separate server, keeping only a pointer in the git repo. Essential for repositories with design files, game assets, or ML models.

Advanced git commands worth knowing: git bisect (binary search through commits to find when a bug was introduced), git stash (temporarily save uncommitted changes), git cherry-pick (apply a specific commit to the current branch), git worktree (multiple working directories from one repository)."""
})

seed_content("Agile & Scrum",
foundational={
    "title": "Agile and Scrum: How Modern Teams Build Software",
    "body": """Agile is a set of values and principles for software development that emphasizes flexibility, collaboration, and delivering value quickly. Scrum is the most popular Agile framework — a structured way to implement Agile principles.

The problem Agile solves: Traditional Waterfall projects would spend months or years defining requirements, designing, and building before users saw anything. By then, requirements had changed, the business landscape had shifted, and often what was built didn't match what was needed. The longer between requirement and delivery, the more expensive the mistakes.

Agile's core insight: Deliver working software frequently. Get feedback early. Adapt based on what you learn. Embrace change as a competitive advantage.

Scrum in a nutshell: Work is organized into Sprints — typically 2-week time-boxed iterations. At the start of each Sprint, the team selects work from the Product Backlog (the prioritized list of everything to be built). The team commits to a Sprint Goal and works to achieve it. At the end, they demo working software, gather feedback, and plan the next Sprint.

Scrum values:
Commitment: Team members commit to the Sprint Goal.
Courage: Do the right thing even when it's difficult.
Focus: Focus on Sprint work and team goals.
Openness: Transparency about work and challenges.
Respect: Respect each other's competence and independence.

Velocity: The amount of work a team completes in a Sprint, measured in story points. Track velocity over several sprints to predict how much can be done in future sprints. Velocity is a planning tool, not a performance metric — don't compare velocities between teams."""
},
intermediate={
    "title": "Advanced Scrum: Backlog Refinement, Estimation, and Scaling",
    "body": """Backlog refinement (previously "grooming") is the ongoing process of detailing, estimating, and reprioritizing Product Backlog items. It's not a one-time event but a continuous activity.

Good backlog items (using INVEST criteria):
Independent: Can be developed in any order.
Negotiable: Details are discussed, not fixed contracts.
Valuable: Delivers business or user value.
Estimable: Team can estimate effort.
Small: Fits comfortably in one Sprint.
Testable: Has clear acceptance criteria.

Story Point Estimation: Story points are a relative measure of effort, complexity, and uncertainty — not time. Teams use the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) because it reflects uncertainty — small differences in small items, large differences in large items.

Planning Poker: Each team member privately estimates a story using cards. All reveal simultaneously. Discuss significant differences. Re-estimate. Prevents anchoring (first number biases others) and groupthink.

T-shirt sizing (XS, S, M, L, XL): Faster than story points for initial backlog sizing. Useful when the backlog is large and needs rough relative ordering quickly.

Splitting stories: Large stories (epics) must be broken into smaller ones. Techniques: by workflow steps, by data variations, by user roles, by operating platform, by quality attributes (implement basic functionality first, then performance).

Scaling Scrum for large projects:
SAFe (Scaled Agile Framework): Multi-team coordination through Program Increments (PI planning — all teams plan 5 sprints together). Complex but widely adopted.
LeSS (Large Scale Scrum): Applies Scrum principles to multiple teams with minimal additional roles or artifacts. Keep it simple.
Nexus: Three to nine Scrum teams working on a single product. Adds Nexus Integration Team and Sprint to coordinate integration.

Definition of Done (DoD): Shared understanding of what "done" means for any story — code reviewed, tests written and passing, documentation updated, deployed to staging, performance tested. Prevents partial work being called "done" and technical debt accumulating."""
},
advanced={
    "title": "Lean Software Development, Flow Metrics, and Continuous Improvement",
    "body": """Lean Software Development applies principles from Lean Manufacturing (Toyota Production System) to software development. The seven Lean principles provide a framework for eliminating waste and delivering value efficiently.

Seven Lean Principles:
Eliminate Waste: Remove anything that doesn't add customer value. Types of software waste: partially done work, extra features nobody asked for, relearning, handoffs, task switching, defects, waiting.
Amplify Learning: Software development is a learning process. Create feedback loops, use iterative development, pair programming accelerates learning.
Decide as Late as Possible: Keep options open as long as possible. Don't commit to designs until you have enough information. This is different from procrastinating — it's about informed decision-making.
Deliver as Fast as Possible: Speed creates a feedback loop. Fast delivery means fast feedback, faster learning, faster adaptation.
Empower the Team: Teams closest to the work make the best technical decisions. Management's role is to support, not micromanage.
Build Integrity In: Refactoring, continuous integration, and testing build integrity. Don't let technical debt accumulate.
See the Whole: Optimize the whole system, not individual parts. Local optimization can hurt global performance.

Flow Metrics provide objective data about how work flows through a system:
Cycle Time: How long from when work starts to when it's done. Not calendar time — actual working time. Shorter cycle time = faster delivery = faster feedback.
Throughput: How many items completed per time period. Increasing throughput without reducing quality is the goal.
Work In Progress (WIP): Number of items started but not completed. Little's Law: Cycle Time = WIP / Throughput. Reducing WIP reduces cycle time — one of the most powerful levers in Lean.
Flow Efficiency: Active time / (Active time + Wait time). Most organizations have 5-15% flow efficiency — work spends most of its time waiting, not being worked on.

Retrospectives done right: The most critical Scrum ceremony for continuous improvement. Not just "what went well/badly" — use techniques like the 5 Whys (drill to root causes), fishbone diagrams (categorize causes), ORID (structured reflection: Objective, Reflective, Interpretive, Decisional). Track action items, verify completion, measure impact."""
})


print("\n" + "="*60)
print("✅ ALL CONTENT SEEDED SUCCESSFULLY!")
print("="*60)
print("\n📊 Coverage:")
print("   DSA:      8 modules × 3 levels = 24 content sections")
print("   Networks: 7 modules × 3 levels = 21 content sections")
print("   OS:       9 modules × 3 levels = 27 content sections")
print("   SE:       6 modules × 3 levels = 18 content sections")
print("   TOTAL:    90 real content sections!")
print("\n💡 Each module now has:")
print("   - Foundational: Clear explanations for beginners")
print("   - Intermediate: Deeper technical content")
print("   - Advanced: Expert-level material")

db.close()