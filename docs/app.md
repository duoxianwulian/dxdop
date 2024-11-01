<p align="right">
    <b>English</b>| <a href="./app_CN.md">中文</a>
</p>

# App Packaging、Installation、Upgrade

## Overview

Applications on dejaOS need to be packaged and installed on other devices after development. Taking DW200 as an example, the typical process is as follows:

1. Purchase a small number of DW200 development devices, possibly just one, to develop your own JavaScript code. Develop and debug until the expected requirements are met, then package the application.
2. Purchase multiple DW200 production devices and install the packaged application on these devices.
3. Deploy the production devices in the production environment. If an application upgrade is needed, it can be done by scanning a QR code or sending an upgrade command over the network. The device will download the latest application via the network and overwrite the old application.

There are differences in packaging, installation, and upgrading between the early and latest versions, which we will look at separately.

## Early Version
### 1. Application Packaging

The early packaging required manual completion, which involved compressing the project's `dxmodules` directory, `src`, and other custom directories into a zip file, as shown in the screenshot below:

![alt text](image/app_zip1.png)

### 2. Application Installation
Installing a self-developed application in the early version is relatively cumbersome:

1. First, package the application into an early version zip file, such as naming the file app1.zip, and calculate the md5 of this file using a tool. Assume this value is `4297f44b13955235245b2497399d7a93`.
2. Upload this file to a network address accessible by the device, for example, the URL `http://www.xxxx.com/app1.zip`.
3. Construct a string according to the rules with the following structure, noting that it is **not** a standard JSON structure:

    ``` json
    {update_flag=1,update_addr="http://www.xxxx.com/app1.zip",update_md5="4297f44b13955235245b2497399d7a93"}
    ```

4. Generate a QR code from this string using a tool; we will provide the corresponding tool.

![alt text](image/app_install1.png)

5. Connect the production device to the internet and ensure it can access the download address. Use the generated QR code from the previous step for the production device to scan, allowing it to download app1.zip and restart to upgrade to the latest version.

### 3. Application Upgrade

Application upgrades are implemented around the dxOTA component, which involves placing the new installation package at a download address on the internet and pushing this address to the device via QR code or other means. The device then downloads it via the network. However, the detailed process is encapsulated in the dxOTA component, and developers only need to call one function.

Use the `dxOTA.update()` function. Detailed documentation and code can be found at [GitHub](https://github.com/duoxianwulian/DejaOS/tree/main/demos/dw200/dw200_update).

## Latest Version

### 1. Application Packaging
The latest version can automatically generate a packaging file by clicking the `package` button in the plugin. The file is saved in the .temp directory with the extension .dpk. Essentially, it is still a compressed file, but the directory structure differs from that of the early version.

![alt text](image/app_zip2.png)


### 2. Application Installation

The latest version is much simpler:

1. Generate the dpk file using VSCode.
2. Connect the device to the computer via a serial connection, and use a burning tool on the computer to burn the dpk file to the device.

![alt text](image/app_install2.png)

 - Select the correct serial port
 - Open the serial port
 - Click to connect the device (a manual restart of the device may be needed)
 - Select the dpk file
 - Click install

### 3. Application Upgrade

Application upgrades are implemented around the dxOTA component, which involves placing the new installation package at a download address on the internet and pushing this address to the device via QR code or other means. The device then downloads it via the network. However, the detailed process is encapsulated in the dxOTA component, and developers only need to call one function.

Use the `dxOTa.updateHttp()` function. Detailed documentation and code can be found at [GitHub](https://github.com/duoxianwulian/DejaOS/tree/main/demos/dw200/dw200_update_new).
