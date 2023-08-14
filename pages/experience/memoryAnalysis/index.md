# 谷歌浏览器内存分析 - Memory Profiles

## Profile type

### heap snapshot

> 是一个静态分析工具，用于查看JavaScript堆中所有对象的内存使用情况。通过在JavaScript代码执行期间捕获堆快照，可以了解哪些对象正在使用大量内存以及它们的引用情况。堆快照可以提供一些基本的内存统计信息，例如对象数量、总内存使用量、内存泄漏情况等

- 分析面板

  > Summary：显示JavaScript堆内存使用情况的概览信息，包括内存占用总量、对象数量、构造函数调用次数等。它还提供了两个视图：构造函数视图和类视图，用于查看构造函数和类之间的关系。

    - "Constructor"（构造函数）指的是对象在内存中的构造函数。
    - "Distance"（距离）表示对象与选定的根对象之间的距离。
    - "Shallow Size"（浅层大小）指的是对象本身在内存中占用的空间大小。
    - "Retained Size"（保留大小）表示如果对象被从内存中删除，与之相关的其他对象也需要一起删除的空间大小。

  > Comparison：比较两个堆快照之间的内存使用情况，显示新创建的、删除的和变化的对象数量。它还提供了两个视图：Diff视图和Allocation View视图，用于查看堆快照之间的差异。

    - "Constructor"（构造函数）指的是对象在内存中的构造函数。
    - "New"：表示在当前 Heap Profiler Snapshot 中新创建的对象数量。
    - "Deleted"：表示在当前 Heap Profiler Snapshot 中被删除的对象数量。
    - "Delta"：表示从上一个 Heap Profiler Snapshot 到当前 Heap Profiler Snapshot 之间，增加或减少的对象数量。
    - "Alloc. Size"（分配大小）指的是当前内存池中已经分配的内存的大小，即已分配但尚未使用的内存大小。
    - "Free Size"（空闲大小）指的是当前内存池中可用的空闲内存的大小。
    - "Size Delta"（大小差异）表示自上一个 Heap Profiler Snapshot 到当前 Heap Profiler Snapshot 之间，内存使用情况增加或减少的大小。

  > Containment：查看一个对象的引用关系和被引用关系，包括直接引用和间接引用。它可以帮助定位内存泄漏和循环引用等问题。

    - Object：代表在 Heap Profiler 中分析到的 JavaScript 对象。
    - Distance：代表对象与根节点之间的最短路径长度，即从根节点开始依次访问每一个包含当前对象的父节点，经过的边数即为 Distance。
    - Shallow Size：代表对象本身所占的字节数，不包括对象引用的其他对象的大小。
    - Retained Size：代表一个对象及其子对象在 Heap 中总共占用的内存大小，即对象及其所有子对象被引用的内存总和，同时还考虑了循环引用的情况。

  > Statistics：提供一些常用的统计信息，包括JavaScript对象类型、构造函数调用次数、对象占用的内存大小等。它可以帮助了解应用程序的内存使用情况。

### Allocation instrumentation on timeline

> 是一个动态分析工具，它可以记录JavaScript代码执行期间的内存分配情况，并将其显示在时间轴上。使用这个工具可以帮助你了解JavaScript代码在何时和何处分配了大量的内存，从而定位内存问题并进行优化。在Chrome DevTools中开启Allocation Instrumentation on Timeline后，可以在Memory面板上查看详细的内存使用情况和分配情况，并进行比较和分析。

- 分析面板: 类似于 heap snapshot 的 Summary

### Allocation sampling

> 它采用了采样的方式，定期对JavaScript对象进行采样，记录下每个采样时刻的堆内存使用情况，从而分析出内存泄漏和对象过多的情况。
