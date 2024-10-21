<p align="right">
    <b>English</b>| <a href="./dxide_CN.md">中文</a>
</p>

# Introduction to DXIDE  
DXIDE is a plugin based on VSCode. After installation, to activate the plugin's features, you need to open a directory that must contain the `app.dxproj` file, which serves as a specific project descriptor for our dejaOS applications.  

## Unconnected Device Status  
![Unconnected Device Status](image/ide-1.png)  

Before connecting a device, you can still edit code, but you won't be able to run it, as there is currently no support for simulators. In this state, there are three buttons in the lower-left corner:  
1. **`install`**: Similar to `npm install`, this button downloads the dependent modules defined in the `app.dxproj` file.  
2. **`build`**: After development, this button is used to package the application. Since it is script code, no compilation is necessary; building simply compresses the relevant code and resource files.  
3. **`connect`**: After connecting the device via USB and once it has booted, clicking this button establishes a connection with the device. Notifications about the connection's success or failure will pop up in the lower-right corner. Once connected, you'll enter the connected device status.  

## Connected Device Status  
![Connected Device Status](image/ide-2.png)  

After connecting the device, four additional buttons appear in the lower-left corner:  
1. **`start`**: Launch the application on the device.  
2. **`stop`**: Stop the application on the device.  
3. **`sync`**: Synchronize changes in the code to the device.  
4. **`syncAll`**: Synchronize all code to the device.  

Typically, before the first launch of the application, you need to use `syncAll` to transfer all code to the device, which may take some time. A progress indicator is displayed next to the button. For subsequent minor code changes, the `sync` button will only transfer modified files to the device.  

## Viewing Logs  
You can check the logs in the `OUTPUT` tab at the bottom of the VSCode main interface.  
![Log Output](image/ide-3.png)  

## Visual GUI Editing  
In VSCode, you can also generate GUIs through visual drag-and-drop functionality, as shown below:  
![Visual GUI Editing](image/ide-4.png)  

Simply name the file with a `.dxui` extension and click on it to open the editing page.  

> Currently, the visual editing feature is not fully developed, so it is recommended to construct GUIs using JavaScript code. We will gradually improve this feature in the future.
