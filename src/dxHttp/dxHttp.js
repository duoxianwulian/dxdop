// http客户端组件
import { httpClass } from './libvbar-m-dxhttp.so'

const httpObj = new httpClass();

const http = {
    /**
     * get请求
     * @param {string} url 
     * @returns 
     */
    get: function (url) {
        if (!url) {
            throw new Error("url should not be null or empty")
        }
        return httpObj.request({ method: 0, url: url, })
    },
    /**
     * post请求,data为json格式
     * @param {string} url 
     * @param {string} data 
     * @returns 
     */
    post: function (url, data) {
        if (!url) {
            throw new Error("url should not be null or empty")
        }
        if (!data) {
            throw new Error("data should not be null or empty")
        }
        if (typeof data != 'string') {
            data = JSON.stringify(data)
        }
        return httpObj.request({ method: 1, url: url, data: data })
    },
    /**
     * 下载文件，本质是get请求
     * @param {string} url 
     * @param {string} path 目标路径(绝对路径)
     * @returns 下载文件有可能返回null，但是下载是成功的
     */
    download: function (url, path) {
        if (!url) {
            throw new Error("url should not be null or empty")
        }
        if (!path) {
            throw new Error("path should not be null or empty")
        }
        return httpObj.request({ method: 0, url: url, download: path })
    },

    /**
     * 上传文件，本质是post请求
     * @param {string} url 
     * @param {string} path 源路径(绝对路径)
     * @returns 
     */
    upload: function (url, path) {
        if (!url) {
            throw new Error("url should not be null or empty")
        }
        if (!path) {
            throw new Error("path should not be null or empty")
        }
        return httpObj.request({
            method: 1,
            url: url,
            headers: ["application/x-www-form-urlencoded; charset=UTF-8"],
            upload: path
        })
    },
    /**
     * 原生方式
     * 必填参数：method（0：get请求，1：post请求）、url
     * 可选参数：headers(字符串数组，覆盖默认header)、download（文件下载地址）、data(请求报文，post请求必填)、timeout(超时时间/ms,缺省:5000)、dns(缺省:"114.114.114.114,8.8.8.8")、upload
     * 默认header：Accept-Charset:utf-8、Content-Type:application/json;charset=utf-8、Connection:close
     * @param {object} param json
     *  如：let param={
                method:0,
                url:"http://192.168.10.122:8000/DW200_1_0.zip",
                download:"/testNet/aaa"
            }
     * @returns 
     */
    request: function (param) {
        return httpObj.request(param)
    },
}
export default http;
