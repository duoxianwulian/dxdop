<p align="right">
     <b>English</b>| <a href="./quickjs_CN.md">中文</a>
</p>

# Introduction to the JavaScript Engine of dejaOS  

dejaOS uses the [QuickJS](https://bellard.org/quickjs/) engine, which is a small and embeddable JavaScript engine supporting the ES2023 specification, including modules, asynchronous generators, and proxies. Its author, Fabrice Bellard, is a renowned French computer programmer known for projects like FFmpeg and QEMU.  

The features of QuickJS make it highly suitable for running on resource-constrained embedded devices. In contrast, the JavaScript engine used by Node.js is V8, which requires more resources and cannot be run directly on common embedded devices. QuickJS is not only small in size but also has fast startup times and low memory usage, making it ideal for deployment in environments with limited memory and computational capacity.  

## Main Features of QuickJS:  
- **Compact and Efficient**: QuickJS has a small codebase and low memory footprint, enabling fast startup times, making it well-suited for embedded applications.  

- **Complete ES2023 Support**: It supports the latest JavaScript features, including modular programming, asynchronous functions, and generators, allowing developers to utilize modern JavaScript syntax.  

- **Embeddability**: QuickJS is designed to be easily embedded into C/C++ applications, facilitating integration with other systems, making it suitable for IoT devices, game engines, and other scenarios that require scripting support.  

- **High Performance**: Despite its small size, QuickJS provides good execution performance, making it suitable for applications with performance requirements.  

- **Ease of Extension**: Developers can easily extend QuickJS by adding custom C functions and objects to meet specific application needs.  

## Application Scenarios:  
QuickJS can be widely used in various embedded devices, IoT solutions, game development, desktop applications, and more, particularly in environments requiring low latency and fast response. Its support for asynchronous programming models enables the development of high-performance network applications.  

In summary, the choice of QuickJS as the JavaScript engine for dejaOS allows for leveraging its efficient performance while providing developers with a modern programming experience.  
