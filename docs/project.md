<p align="right">
    <b>English</b>| <a href="./project_CN.md">中文</a>
</p>

# Introduction to the Project Structure of dejaOS  
The application project structure in dejaOS is relatively simple and follows a fixed format, with certain directories and files that are essential. The structure is illustrated below:

![Project Structure](image/project-1.png)  

1. **`.temp` Directory**: This directory is automatically generated, and even if deleted, it will be recreated. Developers don't need to worry about this directory, as it contains temporary files that won't be synchronized to the device. Clicking the `package` button in the plugin will package the project into an installation file (.dpk) saved in this directory.
2. **`dxmodules` Directory**: This directory holds all the dependency-related files downloaded via the `install` button. It contains multiple `.js` and `.so` files, all prefixed with `dx`, hence the directory name. Developers don't need to manage this directory manually. When using `CTRL+Click` on functions from the dependencies in the code, it will navigate to the relevant `.js` files in this directory, where detailed comments can be found.  
3. **`src` Directory**: This directory is **mandatory**. All source code should be placed here, but you can also put resource files or other non-JS files in the same level as the `src` directory, which will be synchronized to the device.  
4. **`main.js`**: This file is the entry point of the entire program and is **essential**. It must reside in the `src` directory.  
5. **`app.dxproj`**: This file serves as the project configuration file and is also **required**. It is essentially a JSON file that opens a web page for easier modification when clicked, as shown below:

![Project Configuration](image/project-2.png)  

- **5.1 Project Name**: This can be filled in freely.  
- **5.2 Device Type**: This must be selected correctly from a dropdown menu. Different device types may correspond to different dependencies; while the JavaScript APIs might be consistent, the `.so` files can vary. Additionally, some dependencies are specific to particular devices, such as `dxFace`, which is unique to face recognition devices.  
- **5.3 Ignored Directories**: This refers to directories that will not be synchronized to the device. By default, only `.temp` is included. If you wish to add your own directories, you can separate them with commas.  
- **5.4 Ignored Files**: This refers to files that will not be synchronized to the device. You can add your own files by separating them with commas.  
- **5.5 Required Libraries (Components)**: You can add or remove components and their different versions using the `Add Component` button.  

>The new version of the plugin adds a version field to `app.dxproj`.

## Basic Components  
As shown in the above image, the following components are essential and typically required for every project:  
1. **dxLogger**: A logging component, which is crucial for development as logging is indispensable.  
2. **dxCommon**: This component is related to system operations and is also a dependency of `dxLogger`, making it essential.  
3. **dxDriver**: This is the driver library related to the device. It does not provide relevant APIs but is necessary.  
4. **dxStd**: This standard library is related to system I/O and is also indispensable.  
5. **dxMap**: This is a shared memory library and is a foundational component that other modules depend on.  

## Directory Structure on the Device  
- **/app/code/**: All project files will be synchronized to this directory. For example, the `dxmodules` directory in the IDE syncs to the device's `/app/code/dxmodules` directory. Typically, upgrading the application involves deleting all files in this directory and then upgrading to the latest application files.  

- **/app/data/**: Default data files generated during the application's runtime will be placed in this directory. Developers are encouraged to adhere to this convention (though it is not mandatory). Typically, restoring to the initial state involves deleting all files in this directory.  

- **Other Directories**: It is advisable not to access or modify other directories through the application to avoid potential system damage.  
