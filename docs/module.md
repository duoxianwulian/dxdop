<p align="right">
    <b>English</b>| <a href="./module_CN.md">中文</a>
</p>

# Introduction to Modules in dejaOS  
The module import in dejaOS uses the `import` statement to bring in functionalities from other modules, while modules are exported using `export`. This method is very intuitive for developers familiar with JavaScript. For detailed information, please refer to the [relevant documentation](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import).  

> All modules in dejaOS are prefixed with `dx`.  

## Module Management:  
In terms of module management, dejaOS does not utilize the most commonly used JavaScript package manager, `npm`. The main reason for this is that applications on embedded devices typically do not require many third-party libraries. Since some modules are system-related (such as C/C++), these modules need to be recompiled for specific devices. Consequently, most applications rely on the built-in modules of dejaOS and depend on our own module management system.  

If third-party modules are needed, dejaOS only supports pure JavaScript modules. Developers can manually copy and download these modules into their projects. In the future, we also plan to integrate common third-party modules into dejaOS’s module management system for easier access.  

We provide a visual interface for module selection. The DXIDE plugin for VSCode supports selecting different modules or their versions via a web page, greatly simplifying the developer's workflow.  

![Manage Modules](image/module-1.png)  

![Select Modules](image/module-2.png)  

> In dejaOS, modules are often referred to as components.  

## Module Installation  
Similar to `npm install`, dejaOS facilitates module installation through a visual button provided by the DXIDE plugin in VSCode. Users can easily install the required modules by simply clicking this button, streamlining the development process.  

![Install](image/module-3.png)  

> An internet connection is required to download files from our web service. If real-time internet access is not available, please contact us, and we can provide files separately.  

## Conclusion  
The module management system in dejaOS is designed to offer an efficient and convenient development experience for embedded devices. Through a custom module management system and a visual interface, developers can quickly find and install the necessary modules, accelerating the development of embedded applications. We will continuously expand our module library to enhance the system's flexibility and usability.  
