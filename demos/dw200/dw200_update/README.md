# Overview
This is a demo for upgrading the current application by scanning a QR code. The steps are as follows:

1. Build the new code into a compressed package.
2. Upload the compressed package at a network address and obtain an MD5 hash value.
3. Convert the network address and MD5 into a QR code.
5. The device scans the QR code to obtain the network address and MD5, then calls the dxOta.update() function,the function will :
    - to download the compressed package and verify its completeness using the MD5 hash.
    - Decompress the package and overwrite the existing code.
6. Restart the device, and the new code will take effect.

# Files:

1. upadte.zip is update package file,the md5 value is '06e4c5e07a7dc0a9dc8d548ccbbd5260',the download url = http://101.200.139.97:12346/download/update.zip
2. updateqrcode.png is the qrcode,the content = {"url":"http://101.200.139.97:12346/download/update.zip","md5":"06e4c5e07a7dc0a9dc8d548ccbbd5260"}
3. beforeupdate/afterupdate.png is the running result compare