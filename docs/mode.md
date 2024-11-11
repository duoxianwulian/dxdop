<p align="right">
    <b>English</b>| <a href="./mode_CN.md">中文</a>
</p>

# dejaOS System Mode Overview

## Overview

The dejaOS system offers four operating modes, each with distinct behaviors. Modes can be switched among one another:

- Safe Mode (safe)
- Development Mode (dev)
- Production Mode (prod)
- Test Mode (test)

## 1. Safe Mode

Safe mode is similar to the BIOS mode on a PC. When the device starts, there is a 2-second delay during which it can enter safe mode by connecting a PC tool via a serial cable. The primary functions of safe mode include:

- **Installing DPK Applications**: This is the main function of safe mode.
- **Switching System Modes**: Modes can be changed using the tool.
- **Retrieving System Information**: Basic information about OS and  installed applications can be accessed.

![App Installation](image/app_install2.png)

## 2. Development Mode

Development mode is the default mode for development devices. In development mode:

- **No Default App Start**: The device does not automatically start any app upon reboot.
- **No UI Display**: If the device has a screen, it does not display any app-related interface.
- **Debug App**: A built-in debug app is automatically launched to enable interaction with VSCode via a USB cable. This mode is intended for synchronizing JavaScript code from VSCode to the device.

Safe mode allows switching to development mode manually through the tool.

## 3. Production Mode

Production mode is the default mode for production devices. In production mode:

- **Starts Production App**: The device automatically starts the corresponding production app upon reboot.
- **Displays App Interface**: If the device has a screen, it shows the app-related interface.
- **Disables Debugging**: The debug app will not launch, and code cannot be synchronized from VSCode to the device.

Switching to production mode can be done manually in safe mode using the tool.

## 4. Test Mode

In test mode, both the production app and the debug app are launched, typically for testing purposes. In this mode:

- **Starts Production App**: The device automatically starts the corresponding production app and displays the app interface if it has a screen.
- **Launches Debug App**: The debug app also launches, allowing code to be synchronized from VSCode to the device.

Switching to test mode can be done manually in safe mode using the tool.

## Switching Modes Through Code

Modes can also be switched through code, triggered by methods such as scanning a QR code or other protocols. Use the `setMode` function in the `dxCommon` module to switch modes:

```javascript
import common from '../dxmodules/dxCommon.js';

common.setMode("dev"); // Supported parameters: dev, test, prod, safe
```