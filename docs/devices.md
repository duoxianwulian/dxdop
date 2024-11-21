<p align="right">
    <b>English</b>| <a href="./device_CN.md">中文</a>
</p>

# Introduction to dejaOS-Compatible Devices  
Before understanding dejaOS, we need to distinguish the concept of a development board. Embedded developers are typically familiar with development boards, which are provided by chip manufacturers and contain designed circuit boards and a compatible operating system. Developers build upon this foundation, integrating various modules (such as Bluetooth, WiFi, etc.). However, developers often need to design additional circuit boards and enclosures, then integrate everything together, requiring a specialized hardware team and a longer development cycle. Even if application developers manage to implement functionality on the development board, what they end up with is often a collection of scattered hardware, making it difficult to create a stable product.  

In contrast, dejaOS is based on mature, industrial-grade hardware, much like developing on a smartphone. These devices have undergone rigorous design and testing, such as waterproofing, dustproofing, and adaptation to extreme temperatures, meeting various industrial standards. Therefore, application developers can develop directly on these devices, and the final product can be smoothly deployed in production environments.  

dejaOS requires specific devices to run, and it is currently compatible mainly with devices from Cool Beans IoT. dejaOS serves as a JavaScript runtime environment, implemented in C/C++ at its core, allowing it to be compiled and run on different SOCs. However, adaptation work is still required for different chips, systems, and modules.  

## Development Devices and Production Devices  
There is not much difference between development devices and production devices, except that certain development device models come with an additional USB cable. This cable is essential for communication with VSCode, enabling real-time code transmission and debugging.  
Another difference is that the firmware applications within the devices vary. The production device comes with a built-in app that automatically launches and enters the app interface upon startup. However, the development device does not have a built-in app and will not display any interface when it starts up. 

## Microprocessor Support Categories  
1. MIPS architecture [Ingenic](https://www.ingenic.com.cn/) chips  
2. ARM architecture [EasyTech](https://www.eeasytech.com/) chips  

For devices from other manufacturers using these two chip types, adapting dejaOS is relatively easier.  

## Device Usage Categories  
1. **Control Board**: Interacts with the application system via the network, while controlling one or more devices through serial ports on the south side, supporting GPIO input/output. These devices typically do not have screens. For example, model CC101

2. **Reader**: Typically controlled by a control board, with capabilities for card and QR code recognition, as well as network functionality. It interacts with the application system on the north side. These devices usually do not have screens. For example, model Q350

3. **Facial Recognition Device**: Built-in facial recognition hardware and software, equipped with a screen of 6 inches or larger, with network functionality. The main internal application is facial recognition. For example, model VF105

4. **Multi-Function Panel**: Can be applied in various scenarios, providing a comprehensive range of interfaces including network, NFC, Bluetooth, serial port, GPIO, QR code, and more, along with a screen. For example, model DW200

> The standard applications built into the above devices are also developed using dejaOS, and we will open source them. It will be much simpler for everyone to make corresponding modifications based on these.  
