//build:20240308
//Base64编解码工具
//依赖组件：无
//基本包括以下函数:
/**
 * 1. encode(str): 字符串转base64字符串，比如Base64.encode("aa的健康aab")得到YWHnmoTlgaXlurdhYWI=
 * 2. decode(b64): base64字符串转原字符串
 * 3. fromUint8Array(arr): byte数组转base64字符串
 * 4. toUnit8Array(b64):base64字符串转byte数组
 * 5. fromHexString(hex):16进制字符串（小写，无空格）转base64字符串
 * 6. toHexString(b64):base64字符串转16进制字符串（小写，无空格
 */
/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
let version = '3.7.7';
/**
 * @deprecated use lowercase `version`.
 */
let VERSION = version;
let _hasBuffer = typeof Buffer === 'function';
let _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
let _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
let b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
let b64chs = Array.prototype.slice.call(b64ch);
let b64tab = (function (a) {
    let tab = {};
    a.forEach(function (c, i) { return tab[c] = i; });
    return tab;
})(b64chs);
let b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
let _fromCC = String.fromCharCode.bind(String);
let _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : function (it) { return new Uint8Array(Array.prototype.slice.call(it, 0)); };
let _mkUriSafe = function (src) {
    return src
        .replace(/=/g, '').replace(/[+\/]/g, function (m0) { return m0 == '+' ? '-' : '_'; });
};
let _tidyB64 = function (s) { return s.replace(/[^A-Za-z0-9\+\/]/g, ''); };
/**
 * polyfill version of `btoa`
 */
let btoaPolyfill = function (bin) {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    let pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
let _btoa = typeof btoa === 'function' ? function (bin) { return btoa(bin); }
    : _hasBuffer ? function (bin) { return Buffer.from(bin, 'binary').toString('base64'); }
        : btoaPolyfill;
let _fromUint8Array = _hasBuffer
    ? function (u8a) { return Buffer.from(u8a).toString('base64'); }
    : function (u8a) {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        let maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
let fromUint8Array = function (u8a, urlsafe) {
    if (urlsafe === void 0) { urlsafe = false; }
    return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
};
let fromHexString = function (hexString) {
    let byteString = hexString.match(/.{1,2}/g);
    let byteArray = byteString.map(function (byte) {
        return parseInt(byte, 16);
    });
    let buffer = new Uint8Array(byteArray);
    return fromUint8Array(buffer)
}
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
let cb_utob = function (c) {
    if (c.length < 2) {
        let cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        let cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
let re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
let utob = function (u) { return u.replace(re_utob, cb_utob); };
//
let _encode = _hasBuffer
    ? function (s) { return Buffer.from(s, 'utf8').toString('base64'); }
    : _TE
        ? function (s) { return _fromUint8Array(_TE.encode(s)); }
        : function (s) { return _btoa(utob(s)); };
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
let encode = function (src, urlsafe) {
    if (urlsafe === void 0) { urlsafe = false; }
    return urlsafe
        ? _mkUriSafe(_encode(src))
        : _encode(src);
};
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
let encodeURI = function (src) { return encode(src, true); };
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
let re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
let cb_btou = function (cccc) {
    switch (cccc.length) {
        case 4:
            let cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
let btou = function (b) { return b.replace(re_btou, cb_btou); };
/**
 * polyfill version of `atob`
 */
let atobPolyfill = function (asc) {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
let _atob = typeof atob === 'function' ? function (asc) { return atob(_tidyB64(asc)); }
    : _hasBuffer ? function (asc) { return Buffer.from(asc, 'base64').toString('binary'); }
        : atobPolyfill;
//
let _toUint8Array = _hasBuffer
    ? function (a) { return _U8Afrom(Buffer.from(a, 'base64')); }
    : function (a) { return _U8Afrom(_atob(a).split('').map(function (c) { return c.charCodeAt(0); })); };
/**
 * converts a Base64 string to a Uint8Array.
 */
let toUint8Array = function (a) { return _toUint8Array(_unURI(a)); };
//
let toHexString = function (a) {
    let uint8 = toUint8Array(a)
    return Array.from(uint8)
        .map((i) => i.toString(16).padStart(2, '0'))
        .join('');;
}
let _decode = _hasBuffer
    ? function (a) { return Buffer.from(a, 'base64').toString('utf8'); }
    : _TD
        ? function (a) { return _TD.decode(_toUint8Array(a)); }
        : function (a) { return btou(_atob(a)); };
let _unURI = function (a) { return _tidyB64(a.replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/'; })); };
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
let decode = function (src) { return _decode(_unURI(src)); };
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
let isValid = function (src) {
    if (typeof src !== 'string')
        return false;
    let s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
let _noEnum = function (v) {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
let extendString = function () {
    let _add = function (name, body) { return Object.defineProperty(String.prototype, name, _noEnum(body)); };
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
let extendUint8Array = function () {
    let _add = function (name, body) { return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body)); };
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
let extendBuiltins = function () {
    extendString();
    extendUint8Array();
};
let gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    fromHexString: fromHexString,
    toHexString: toHexString,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins
};
export default gBase64