!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.majidai=t():e.majidai=t()}(global,function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(s,o,function(t){return e[t]}.bind(null,o));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t){e.exports={SESSION_VAR:{sessionId:"__KSESID",csrfToken:"__TOKEN",userId:"__ID",lastAccess:"__TM",isUserLogged:"__LG"},MSG:{ERR_NOT_VALID_ROUTING:"not valid routing(use numbers,letters,-,_)",ERR_ROUTING_DEFINED_MULTIPLE:"same routing is defined multiple time",ERR_NOT_SUPPORTED_CONTENT_TYPE:"not supported content type",ERR_INVALID_ROUTING:"routing is not valid",ERR_INVALID_CONFIGURATION:"configuration is not valid",ERR_INVALID_DATA_TYPE_PORT:"port should be number type",ERR_INVALID_DATA_TYPE_HOST:"host should be string type",ERR_INVALID_DATA_TYPE_PUBLIC_DIR:"publicDir should be string type",ERR_INVALID_PUBLIC_DIR:"publicDir should be different from ROOT directory",ERR_INVALID_DATA_TYPE_IS_PRODUCTION:"isProduction should be boolean type",ERR_INVALID_DATA_TYPE_SESSION_TIME:"sessionTime should be number type",ERR_INVALID_SESSION_TIME:"sessionTime should be greater then zero",ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE:"maxBodySize should be number type",ERR_INVALID_MAX_BODY_SIZE:"maxBodySize should be greater then zero"}}},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("path")},function(e,t,r){const s=r(4),o=r(1),i=r(2),n=r(5),a=r(6),u=r(9),h=r(11),l=r(12),c=r(13),d=r(14),p=r(15),f=r(0).MSG;e.exports=class{constructor(...e){this._config=new c,this._getRouting=new Map,this._postRouting=new Map,this._rootDir=i.dirname(process.argv[1]);var t=e.length>0&&"object"==typeof e[0]&&e[0];t&&this._config.applyUserConfig(t),this._session=new u(this._config.sessionTime),this._logger=new h(this._config.log,this._config.isProduction),this._reqResp=new a,this.userObj=l(this._session,this._logger,this._reqResp)}_validateRouting(e){if(null==e||"object"!=typeof e)throw new TypeError(f.ERR_INVALID_ROUTING);if(e.length<2)throw new TypeError(f.ERR_INVALID_ROUTING);if("string"!=typeof e[0]||"function"!=typeof e[1])throw new TypeError(f.ERR_INVALID_ROUTING);if(!/^[a-zA-Z0-9-_{}\/]+$/.test(e[0]))throw new TypeError(f.ERR_NOT_VALID_ROUTING)}get(...e){this._validateRouting(e);var t=e[0];if(t.length>1&&"/"==t[t.length-1]&&(t=t.substring(0,t.length-1)),this._getRouting.has(t))throw new TypeError(f.ERR_ROUTING_DEFINED_MULTIPLE);var r=[],s=t.match(/{[^}]*}/g),o=s?t.substr(0,t.indexOf(s[0])-1):t;s&&s.forEach(e=>r.push(e.replace(/[{|}]/g,""))),this._getRouting.set(o,{next:e[1],params:r})}post(...e){if(this._validateRouting(e),this._postRouting.has(e[0]))throw new TypeError(f.ERR_ROUTING_DEFINED_MULTIPLE);this._postRouting.set(e[0],e[1])}start(){try{let e=this.userObj;process.on("uncaughtException",function(t){try{return e.logger.error(t.message,!0),e.respond.error(500)}catch(t){console.error(t)}}),s.createServer((e,t)=>this.handle(e,t)).listen(this._config.port,this._config.host),this._logger.debug(`Server Listening at http://${this._config.host}:${this._config.port}`),setInterval(()=>{try{this._session.validateAll()}catch(e){}},36e5)}catch(e){throw e}}isSecure(e){return!(!o.statSync(e).isFile()||0!==e.indexOf(i.resolve(this._config.publicDir))||o.statSync(e).isSymbolicLink()||i.dirname(e)==i.dirname(process.argv[1])&&".js"==i.extname(e).toLowerCase())}handle(e,t,r){try{if(this._reqResp.setRequest(e),this._reqResp.setResponse(t),this._reqResp.setHeader(this._config.header),e=t=null,this._logger.access(this.userObj.logger.getPrefix()),!d(this.userObj,this._config))return;this.userObj.cookieId=p(this._reqResp,this._session);let r=this._reqResp.homePath(),l=this.userObj,c=this._reqResp.request;var s=function(e){if(null!=e)return"string"==typeof e?l.respond.plainText(e):l.respond.json(e)};if("GET"==this._reqResp.request.method){let e=i.join(this._rootDir,this._config.publicDir,r);if(o.existsSync(e)&&this.isSecure(e))return this._reqResp.sendStaticResponse(e);if(this._getRouting.get(r)){l.data.setGetParam(this._reqResp.getParamAll());let e=this._getRouting.get(r).next(this.userObj);return s(e)}for(const[e,t]of this._getRouting)if(r.startsWith(e+"/")&&t.params.length>0){var a=this._reqResp.getParamAll(),u=r.substr(e.length),h=[];u.split("/").forEach(e=>e&&h.push(e)),h.forEach((e,r)=>{r<t.params.length&&(a[t.params[r]]=e)}),l.data.setGetParam(a);let o=this._getRouting.get(e).next(this.userObj);return s(o)}this._reqResp.respondErr(404)}else if("POST"==this._reqResp.request.method){if(!this._postRouting.has(r))return this._reqResp.respondErr(404);let e="",t=this._postRouting;if(this._reqResp.request.headers["content-type"].includes("multipart/form-data")){let e=t.get(r)(l);return s(e)}this._reqResp.request.on("data",function(t){e+=t}),this._reqResp.request.on("end",()=>{try{let o=function(e,t){if(e["content-type"].includes("application/json"))try{return JSON.parse(t)}catch(e){}return n.parse(t)}(c.headers,e);l.data.setPostParam(o);let i=t.get(r)(l);return s(i)}catch(e){l.logger.error(e.stack||e.message,!0),l.respond.error(500)}})}}catch(e){return this.userObj.logger.error(e.stack||e.message,!0),this._reqResp.respondErr(500)}}}},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("querystring")},function(e,t,r){const s=r(7),o=r(8);e.exports=class extends o{constructor(){super()}setRequest(e){this.request=e}parseCookie(){var e=new Map;try{let t=this.request.headers.cookie||null;if(null==t)throw Error("no cookies found.");t.split(";").map(e=>e.trim()).forEach(t=>{var r=t.split("=").map(e=>e.trim());2==r.length&&""!=r[0]&&e.set(r[0],r[1])})}catch(e){}return e}getCookie(e){var t=this.parseCookie();return t.has(e)?t.get(e):""}homePath(){return s.parse(this.request.url,!0).pathname}getParamAll(){return s.parse(this.request.url,!0).query||{}}getParam(e,t=""){var r=s.parse(this.request.url,!0);for(let t in r.query)if(null!=t&&t==e)return this.request.getParams[t];return t}method(){return this.request.method||""}ip(){return this.request.headers["x-forwarded-for"]||this.request.connection.remoteAddress||this.request.socket.remoteAddress||(this.request.connection.socket?this.request.connection.socket.remoteAddress:null)}hostName(){return this.request.headers.host||""}userAgent(){return this.request.headers["user-agent"]||""}url(){return this.request.url||""}referrer(){return this.request.headers.referrer||this.request.headers.referer||""}}},function(e,t){e.exports=require("url")},function(e,t,r){const s=r(1),o=r(2),i={".html":"text/html",".css":"text/css",".js":"text/javascript",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".gif":"image/gif",".ico":"image/x-icon",".pdf":"application/pdf"},n=[".jpg",".jpeg",".png",".gif",".ico",".pdf"];Date.prototype.addYears=function(e){var t=new Date;return new Date(t.setFullYear(t.getFullYear()+e))};e.exports=class{setResponse(e){this.response=e}setHeader(e){Object.keys(e).forEach(t=>{this.response.setHeader(t,e[t])})}setCookie(e,t){this.response.setHeader("Set-Cookie",[`${e}=${t}; HttpOnly; Path=/; expires=${(new Date).addYears(1)}`])}deleteCookie(e){this.response.setHeader("Set-Cookie",[`${e}=; HttpOnly; Path=/; expires=${new Date(0)}`])}redirectUrl(e){this.isHeadersSent()||(this.response.writeHead(303,{Location:e}),this.response.end())}sendJsonResponse(e,t=200){this.sendResp("application/json",JSON.stringify(e),t)}sendResp(e,t,r=200){this.isHeadersSent()||(this.response.statusCode=r,this.response.setHeader("Content-Type",`${e}; charset=utf-8`),this.response.write(t),this.response.end())}sendStaticResponse(e){try{if(this.isHeadersSent())return;if(s.existsSync(e)&&!s.statSync(e).isSymbolicLink()&&s.statSync(e).isFile()){let t=o.extname(e).toLocaleLowerCase();if(Object.keys(i).includes(t)){let r=i[t];return this.response.statusCode=200,this.response.setHeader("Content-Type",`${r}; charset=utf-8`),void(n.includes(t)?s.createReadStream(e).pipe(this.response):s.createReadStream(e,"utf-8").pipe(this.response))}}}catch(e){}this.send404Response()}respondErr(...e){if(!(e.length<1)&&"number"==typeof e[0]){var t,r=3==e.length&&"string"==typeof e[2]?e[2]:"text/plain",s=e[1]||(400==(t=e[0])?"Bad Request.":401==t?"Unauthorized Access.":403==t?"Request Forbidden.":404==t?"Not Found.":405==t?"Method Not Allowed.":413==t?"Payload Too Large.":500==t?"Internal Server Error.":"Woops! Something went wrong.");this.sendResp(r,s,e[0])}}isHeadersSent(){return this.response.headersSent}}},function(e,t,r){const s=r(10),o=r(0).SESSION_VAR,i=o.lastAccess;e.exports=class{constructor(e){this.data=new Map,this.allowedTime=e,this.vars=o}uniqueId(e){return null!=e&&"number"==typeof e||(e=8),s.randomBytes(e).toString("hex")}genId(){let e=`${this.uniqueId(16)}${+new Date}`;return this.createUser(e),e}createUser(e){this.data.set(e,{[i]:+new Date})}validateUser(e){let t=this.data.get(e);void 0!==t&&(t[i]<+new Date-this.allowedTime?this.createUser(e):t[i]=+new Date)}validateAll(){for(let[e,t]of this.data)userData[i]<+new Date-this.allowedTime&&this.data.has(e)&&this.data.delete(e)}regenId(e){return this.destroy(e),this.genId()}put(e,t,r){if(null==e||null==e||""==e||t==i)return!1;if(null==t||"string"!=typeof t||""==t.trim())return!1;if(null==r)return!1;let s=this.getAll(e);return"object"==typeof s&&(Object.defineProperty(s,t,{value:r,enumerable:!0,configurable:!0}),!0)}get(e,t){if(null==e||null==e||""==e)return"";var r=this.getAll(e);return null==t||null==t||""==t?r:r.hasOwnProperty(t)?r[t]:""}getAll(e){return this.data.get(e)||{}}delete(e,t){if(null==e||null==e||""==e)return;if(null==t||"string"!=typeof t)return;let r=this.getAll(e);"object"==typeof r&&r.hasOwnProperty(t)&&delete r[t]}destroy(e){this.data.has(e)&&this.data.delete(e)}}},function(e,t){e.exports=require("crypto")},function(e,t,r){const s=r(1);e.exports=class{constructor(e,t=!0){try{this._isProduction="boolean"!=typeof t||t,this._isDebug=!1,this._isAcccess=!1,this._isError=!0,this._logFolder="./log",this._validate(e)}catch(e){throw e}}_validate(e){null!=e&&"object"==typeof e&&0!==Object.keys(e).length&&(e.hasOwnProperty("folder")||(e.folder=this._logFolder),this._isDebug=e.hasOwnProperty("debug")?e.debug:this._isDebug,this._isAcccess=e.hasOwnProperty("access")?e.access:this._isAcccess,this._isError=e.hasOwnProperty("error")?e.error:this._isError,this._logFolder=e.folder,s.existsSync(e.folder)||(s.mkdirSync(e.folder),this.debug(`【log folder】「${e.folder}」 is created.`)))}_getFilename(){const e=e=>e.toString().length<2?Array(2).join("0")+e:e,t=new Date;return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}_write(e,t){var r=this._isProduction;setTimeout(()=>{s.appendFile(e,t+"\n",function(e){r||e&&console.error(e)||console.log(t)})},100)}_isEmptyString(e){return"string"==typeof e&&!!e.trim().length}error(e){return this._isProduction||console.error(e),!this._isError||!!this._isEmptyString(e)&&void this._write(`${this._logFolder}/${this._getFilename()}.error`,e)}debug(e){return this._isProduction||console.debug(e),!this._isDebug||!!this._isEmptyString(e)&&(e=(new Date).toLocaleString()+","+e,void this._write(`${this._logFolder}/${this._getFilename()}.debug`,e))}access(e){return!this._isAcccess||!!this._isEmptyString(e)&&void this._write(`${this._logFolder}/${this._getFilename()}.access`,e)}}},function(e,t){e.exports=function(e,t,r){let s=Object.create(null);var o,i;return s.cookieId="",Object.defineProperty(s,"logger",{value:{debug:function(e,r=!1){return r?t.debug(this.getPrefix()+NaN+e):t.debug(e)},error:function(e,r=!1){return r?t.error(this.getPrefix()+NaN+e):t.error(e)},getPrefix:function(){return(new Date).toLocaleString()+","+r.ip()+","+r.hostName()+","+r.userAgent()+","+r.method()+","+r.referrer()+","+r.url()}}}),Object.defineProperty(s,"session",{value:{put:function(t,r){return e.put(s.cookieId,t,r)},delete:function(t){return e.delete(s.cookieId,t)},get:function(t){var r=e.getAll(s.cookieId);return t?r.hasOwnProperty(t)?r[t]:"":r},regenId:function(){s.cookieId=e.regenId(s.cookieId),r.setCookie(e.vars.sessionId,s.cookieId)},destroy:function(t){return e.destroy(s.cookieId)}}}),Object.defineProperty(s,"data",{value:{setGetParam:function(e){o=e},setPostParam:function(e){i=e},getParams:function(e){return e?e in o?o[e]:"":o},postParams:function(e){return e?i&&e in i?i[e]:"":i}}}),Object.defineProperty(s,"respond",{value:{static:function(e){return r.sendStaticResponse(e)},error:function(e,t=""){return r.respondErr(e,t)},plainText:function(e){return r.sendResp("text/plain",e)},html:function(e){return r.sendResp("text/html",e)},json:function(e){return r.sendJsonResponse(e)},redirect:function(e){return r.redirectUrl(e)}}}),Object.defineProperty(s,"triggerLoginCheck",{value:function(t){return s.cookieId=e.regenId(s.cookieId),r.setCookie(e.vars.sessionId,s.cookieId),e.put(s.cookieId,e.vars.isUserLogged,1)}}),Object.defineProperty(s,"mustBeLoggedIn",{value:function(t){return!!e.get(s.cookieId,e.vars.isUserLogged)||(t?"string"==typeof t?r.respondErr(401,t):"object"==typeof t&&t.hasOwnProperty("url")?r.redirectUrl(t.url):(s.logger.error("parameter for mustBeLoggedIn is invalid",!0),r.respondErr(401)):r.respondErr(401))}}),Object.defineProperty(s,"native",{value:{request:()=>r.request,response:()=>r.response}}),Object.defineProperty(s,"client",{value:{ip:()=>r.ip(),hostName:()=>r.hostName(),userAgent:()=>r.userAgent(),referrer:()=>r.referrer(),url:()=>r.url(),getCookie:()=>r.getCookie(),method:()=>r.method(),headers:e=>e?r.request.headers.hasOwnProperty(e)?r.request.headers[e]:"":r.request.headers}}),s}},function(e,t,r){const s=r(0).MSG;e.exports=class{constructor(){this.port=80,this.host="0.0.0.0",this.log={folder:"./log",access:!1,debug:!1,error:!0},this.publicDir="./public",this.isProduction=!0,this.sessionTime=3e5,this.maxBodySize=102400,this.header={"x-content-type-options":"nosniff","x-frame-options":"SAMEORIGIN","x-xss-protection":"1; mode=block",server:"majidai@1.0","Access-Control-Allow-Origin":"*"},this.allowedMthod=["GET","POST"],this.allowedContentType=["application/x-www-form-urlencoded","application/json","multipart/form-data"]}applyUserConfig(e){if(e.hasOwnProperty("port")){if("number"!=typeof e.port)throw new TypeError(s.ERR_INVALID_DATA_TYPE_PORT);this.port=e.port}if(e.hasOwnProperty("host")){if("string"!=typeof e.host)throw new TypeError(s.ERR_INVALID_DATA_TYPE_HOST);this.host=e.host}if(e.hasOwnProperty("publicDir")){if("string"!=typeof e.publicDir)throw new TypeError(s.ERR_INVALID_DATA_TYPE_PUBLIC_DIR);if(path.resolve(e.publicDir)==this._rootDir)throw new TypeError(s.ERR_INVALID_PUBLIC_DIR);this.publicDir=e.publicDir}if(e.hasOwnProperty("isProduction")){if("boolean"!=typeof e.isProduction)throw new TypeError(s.ERR_INVALID_DATA_TYPE_IS_PRODUCTION);this.isProduction=e.isProduction}if(e.hasOwnProperty("sessionTime")){if("number"!=typeof e.sessionTime)throw new TypeError(s.ERR_INVALID_DATA_TYPE_SESSION_TIME);if(e.sessionTime<1)throw new TypeError(s.ERR_INVALID_SESSION_TIME);this.sessionTime=e.sessionTime}if(e.hasOwnProperty("maxBodySize")){if("number"!=typeof e.maxBodySize)throw new TypeError(s.ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE);if(e.maxBodySize<1)throw new TypeError(s.ERR_INVALID_MAX_BODY_SIZE);this.maxBodySize=e.maxBodySize}if(e.hasOwnProperty("log")){this._validateObject(this.log,e.log);for(const t in this.log)Object.keys(e.log).includes(t)||(e.log[t]=this.log[t]);this.log=e.log}if(e.hasOwnProperty("header")){this._validateObject(this.header,e.header);for(const t in this.header)Object.keys(e.header).includes(t)||(e.header[t]=this.header[t]);this.header=e.header}}_validateObject(e,t){if(null==t||"object"!=typeof t)throw new TypeError(s.ERR_INVALID_CONFIGURATION);for(const r in t)if(t.hasOwnProperty(r)&&!e.hasOwnProperty(r))throw new TypeError(s.ERR_INVALID_CONFIGURATION)}}},function(e,t,r){const s=r(0).MSG;e.exports=function(e,t){if(e.data.setGetParam({}),e.data.setPostParam({}),e.native.request().on("error",e=>{throw Error(e)}),e.native.response().on("error",e=>{throw Error(e)}),!t.allowedMthod.includes(e.client.method()))return e.respond.error(405);if(e.client.headers("content-length")>t.maxBodySize)return e.respond.error(413);if("POST"==e.client.method()){var r=e.client.headers("content-type").split(";")[0].trim();if(!t.allowedContentType.includes(r))return e.respond.error(400,s.ERR_NOT_SUPPORTED_CONTENT_TYPE)}return!0}},function(e,t){e.exports=function(e,t){let r=e.getCookie(t.vars.sessionId);return""==r?(r=t.genId(),e.setCookie(t.vars.sessionId,r)):0===Object.keys(t.getAll(r)).length?t.createUser(r):t.validateUser(r),r}}])});