!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.majidai=t():e.majidai=t()}(global,function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(s,o,function(t){return e[t]}.bind(null,o));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports={SESSION_VAR:{sessionId:"__KSESID",csrfToken:"__TOKEN",userId:"__ID",lastAccess:"__TM",isUserLogged:"__LG"},MSG:{ERR_NOT_VALID_ROUTING:"not valid routing(use numbers,letters,-,_)",ERR_ROUTING_DEFINED_MULTIPLE:"same routing is defined multiple time",ERR_NOT_VALID_CUSTOM_ROUTING:"not valid custom routing. First Arg should be object of structure \n{method:['GET', 'POST'], routing:'/dashboard'}",ERR_NOT_SUPPORTED_CONTENT_TYPE:"not supported content type",ERR_INVALID_ROUTING:"routing is not valid",ERR_INVALID_CONFIGURATION:"configuration is not valid",ERR_INVALID_DATA_TYPE_PORT:"port should be number type",ERR_INVALID_DATA_TYPE_HOST:"host should be string type",ERR_INVALID_DATA_TYPE_PUBLIC_DIR:"publicDir should be string type",ERR_INVALID_PUBLIC_DIR:"publicDir should be different from ROOT directory",ERR_INVALID_DATA_TYPE_IS_PRODUCTION:"isProduction should be boolean type",ERR_INVALID_DATA_TYPE_SESSION_TIME:"timeOut should be number type",ERR_INVALID_DATA_TYPE_SESSION_ACTIVATION:"activate should be boolean type",ERR_INVALID_SESSION_TIME:"sessionTime should be greater then zero",ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE:"maxBodySize should be number type",ERR_INVALID_MAX_BODY_SIZE:"maxBodySize should be greater then zero"}}},function(e,t){e.exports=require("path")},function(e,t,r){const s=r(4),o=r(5),i=r(6),n=r(0),a=r(2),h=r(7),l=r(8),c=r(11),u=r(13),p=r(14),d=r(15),f=r(16),g=r(17),_=r(1).MSG;e.exports=class{constructor(...e){this._config=new d,this._getRouting=new Map,this._postRouting=new Map,this._rootDir=a.dirname(process.argv[1]);var t=e.length>0&&"object"==typeof e[0]&&e[0];t&&this._config.applyUserConfig(t),this._session=new c(this._config.session),this._logger=new u(this._config.log),this._reqResp=new l(this._config),this.userObj=p(this._session,this._logger,this._reqResp)}_validateRouting(e){if(null==e||"object"!=typeof e)throw new TypeError(_.ERR_INVALID_ROUTING);if(e.length<2)throw new TypeError(_.ERR_INVALID_ROUTING);if("string"!=typeof e[0]||"function"!=typeof e[1])throw new TypeError(_.ERR_INVALID_ROUTING);if(!/^[a-zA-Z0-9-_{}\/]+$/.test(e[0]))throw new TypeError(_.ERR_NOT_VALID_ROUTING)}get(...e){this._validateRouting(e);var t=e[0];if(t.length>1&&"/"==t[t.length-1]&&(t=t.substring(0,t.length-1)),this._getRouting.has(t))throw new TypeError(_.ERR_ROUTING_DEFINED_MULTIPLE);var r=[],s=t.match(/{[^}]*}/g),o=s?t.substr(0,t.indexOf(s[0])-1):t;s&&s.forEach(e=>r.push(e.replace(/[{|}]/g,""))),this._getRouting.set(o,{next:e[1],params:r})}post(...e){if(this._validateRouting(e),this._postRouting.has(e[0]))throw new TypeError(_.ERR_ROUTING_DEFINED_MULTIPLE);this._postRouting.set(e[0],e[1])}customRouting(...e){var t=e[0].method||[],r=e[0].routing||"";if(!t.length||!r||"object"!=typeof t)throw new TypeError(_.ERR_NOT_VALID_CUSTOM_ROUTING);t.forEach(t=>{this._config.allowedMthod.includes(t)&&("GET"===t&&this.get(r,e[1]),"POST"===t&&this.post(r,e[1]))})}start(){try{let e=this.userObj;process.on("uncaughtException",function(t){try{return e.logger.error(t.stack||t.message),e.respond.error(500)}catch(t){console.error(t)}}),this._config.ssl.http&&(this._server=s.createServer((e,t)=>this.handle(e,t)),this._server.listen(this._config.port,this._config.host),this._logger.info(`Server Listening at http://${this._config.host}:${this._config.port}`)),this._config.ssl.isActivate&&(this._config.ssl.http2?(i.createSecureServer({key:this._config.ssl.key,cert:this._config.ssl.cert},(e,t)=>this.handle(e,t)).listen(this._config.ssl.port,this._config.host),this._logger.info(`Server Listening at https://${this._config.host}:${this._config.ssl.port} with h2 protocol`)):(o.createServer({key:this._config.ssl.key,cert:this._config.ssl.cert},(e,t)=>this.handle(e,t)).listen(this._config.ssl.port,this._config.host),this._logger.info(`Server Listening at https://${this._config.host}:${this._config.ssl.port}`))),this._config.session.isActivate&&setInterval(()=>{try{this._session.validateAll()}catch(e){}},36e5)}catch(e){throw e}}stop(){this._server.close(),this._logger.info("Server Stopped Listening."),process.exit(0)}onError(e){if("function"!=typeof e)throw new Error("parameter should be function");this._reqResp.overrideError(e)}isSecure(e){return!!n.statSync(e).isFile()&&0===e.indexOf(a.resolve(this._config.publicDir))&&!n.statSync(e).isSymbolicLink()}handle(e,t){try{let l=this._reqResp;if(l.setRequest(e),l.setResponse(t),e=t=null,this._config.log.isWriteAccess){const e=(new Date).toLocaleString()+","+l.ip()+","+l.hostName()+","+l.userAgent()+","+l.method()+","+l.referrer()+","+l.url();this._logger.access(e)}if(!f(this.userObj,this._config))return;this._config.session.isActivate&&(this.userObj.cookieId=g(l,this._session));let c=l.homePath(),u=this.userObj,p=l.request;var r=function(e){if(null!=e)return"string"==typeof e?u.respond.plainText(e):u.respond.json(e)};if("GET"==l.request.method){let e=a.join(this._rootDir,this._config.publicDir,c);if(n.existsSync(e)&&this.isSecure(e))return l.sendStaticResponse(e);if(this._getRouting.get(c)){u.data.setGetParam(l.getParamAll());let e=this._getRouting.get(c).next(this.userObj);return r(e)}for(const[e,t]of this._getRouting)if(c.startsWith(e+"/")&&t.params.length>0){var s=l.getParamAll(),o=c.substr(e.length),i=[];o.split("/").forEach(e=>e&&i.push(e)),i.forEach((e,r)=>{r<t.params.length&&(s[t.params[r]]=e)}),u.data.setGetParam(s);let n=this._getRouting.get(e).next(this.userObj);return r(n)}l.respondErr(404)}else if("POST"==l.request.method){if(!this._postRouting.has(c))return l.respondErr(404);let e="",t=this._postRouting;if(l.request.headers["content-type"].includes("multipart/form-data")){let e=t.get(c)(u);return r(e)}l.request.on("data",function(t){e+=t}),l.request.on("end",()=>{try{let s=function(e,t){if(e["content-type"].includes("application/json"))try{return JSON.parse(t)}catch(e){}return h.parse(t)}(p.headers,e);u.data.setPostParam(s);let o=t.get(c)(u);return r(o)}catch(e){throw e}})}}catch(e){throw e}}}},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("https")},function(e,t){e.exports=require("http2")},function(e,t){e.exports=require("querystring")},function(e,t,r){const s=r(9),o=r(10);e.exports=class extends o{constructor(...e){super(e)}setRequest(e){this.request=e}parseCookie(){var e=new Map;try{let t=this.request.headers.cookie||null;if(null==t)throw Error("no cookies found.");t.split(";").map(e=>e.trim()).forEach(t=>{var r=t.split("=").map(e=>e.trim());2==r.length&&""!=r[0]&&e.set(r[0],r[1])})}catch(e){}return e}getCookie(e){var t=this.parseCookie();return e&&null!=e?t.has(e)?t.get(e):"":t}homePath(){return s.parse(this.request.url,!0).pathname}getParamAll(){return s.parse(this.request.url,!0).query||{}}getParam(e,t=""){var r=s.parse(this.request.url,!0);for(let t in r.query)if(null!=t&&t==e)return this.request.getParams[t];return t}method(){return this.request.method||""}ip(){return this.request.headers["x-forwarded-for"]||this.request.connection.remoteAddress||this.request.socket.remoteAddress||(this.request.connection.socket?this.request.connection.socket.remoteAddress:null)}hostName(){return this.request.headers.host||""}userAgent(){return this.request.headers["user-agent"]||""}url(){return this.request.url||""}referrer(){return this.request.headers.referrer||this.request.headers.referer||""}}},function(e,t){e.exports=require("url")},function(e,t,r){const s=r(0),o=r(2),i={".html":"text/html",".css":"text/css",".js":"text/javascript",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".gif":"image/gif",".ico":"image/x-icon",".pdf":"application/pdf"},n=[".jpg",".jpeg",".png",".gif",".ico",".pdf"];Date.prototype.addYears=function(e){var t=new Date;return new Date(t.setFullYear(t.getFullYear()+e))};e.exports=class{constructor(...e){this.config=e[0][0]}setResponse(e){for(var t in this.response=e,this.config.header)this.response.setHeader(t,this.config.header[t])}overrideError(e){this._errorCallback=e}setCookie(e,t){this.response.setHeader("Set-Cookie",[`${e}=${t}; HttpOnly; Path=/; expires=${(new Date).addYears(1)}`])}addCookie(e){var t=`${e.key}=${e.value};`+(e.hasOwnProperty("httpOnly")&&e.httpOnly?" HttpOnly;":"")+(e.hasOwnProperty("secure")&&e.secure?" Secure;":"")+(e.hasOwnProperty("path")?` Path=${e.path};`:"")+(e.hasOwnProperty("domain")?` Domain=${e.domain};`:"")+(e.hasOwnProperty("expireDate")?` Expires=${e.expireDate};`:"");this.response.getHeader("Set-Cookie")||this.response.setHeader("Set-Cookie",[]),this.response.getHeader("Set-Cookie").push(t)}deleteCookie(e){this.response.setHeader("Set-Cookie",[`${e}=; expires=${new Date(0)}`])}redirectUrl(e){this.isHeadersSent()||(this.response.writeHead(303,{Location:e}),this.response.end())}sendJsonResponse(e,t=200){this.sendResp("application/json",JSON.stringify(e),t)}sendResp(e,t,r=200){this.isHeadersSent()||(this.response.statusCode=r,this.response.setHeader("Content-Type",`${e}; charset=utf-8`),this.response.write(t),this.response.end())}sendStaticResponse(e){try{if(this.isHeadersSent())return;if(s.existsSync(e)&&!s.statSync(e).isSymbolicLink()&&s.statSync(e).isFile()){let t=o.extname(e).toLocaleLowerCase();if(Object.keys(i).includes(t)){let r=i[t];return this.response.statusCode=200,this.response.setHeader("Content-Type",`${r}; charset=utf-8`),void(n.includes(t)?s.createReadStream(e).pipe(this.response):s.createReadStream(e,"utf-8").pipe(this.response))}}}catch(e){}this.respondErr(404)}respondErr(...e){if(!(e.length<1)&&"number"==typeof e[0]){var t,r={contentType:3==e.length&&"string"==typeof e[2]?e[2]:"text/plain",errMsg:e[1]||(400==(t=e[0])?"Bad Request.":401==t?"Unauthorized Access.":403==t?"Request Forbidden.":404==t?"Not Found.":405==t?"Method Not Allowed.":413==t?"Payload Too Large.":500==t?"Internal Server Error.":"Woops! Something went wrong."),errCode:e[0]};"function"==typeof this._errorCallback&&(r=this._errorCallback(r)),this.sendResp(r.contentType,r.errMsg,r.errCode)}}isHeadersSent(){return this.response.headersSent}}},function(e,t,r){const s=r(12),o=r(1).SESSION_VAR,i=o.lastAccess;e.exports=class{constructor(e){this.config=e,this.data=new Map,this.allowedTime=e.timeOut||3e5,this.vars=o}uniqueId(e){return null!=e&&"number"==typeof e||(e=8),s.randomBytes(e).toString("hex")}genId(){let e=`${this.uniqueId(16)}${+new Date}`;return this.createUser(e),e}createUser(e){this.data.set(e,{[i]:+new Date})}validateUser(e){let t=this.data.get(e);void 0!==t&&(t[i]<+new Date-this.allowedTime?this.createUser(e):t[i]=+new Date)}validateAll(){for(let[e,t]of this.data)userData[i]<+new Date-this.allowedTime&&this.data.has(e)&&this.data.delete(e)}regenId(e){return this.destroy(e),this.genId()}put(e,t,r){if(null==e||null==e||""==e||t==i)return!1;if(null==t||"string"!=typeof t||""==t.trim())return!1;if(null==r)return!1;let s=this.getAll(e);return"object"==typeof s&&(Object.defineProperty(s,t,{value:r,enumerable:!0,configurable:!0}),!0)}get(e,t){if(null==e||null==e||""==e)return"";var r=this.getAll(e);return null==t||null==t||""==t?r:r.hasOwnProperty(t)?r[t]:""}getAll(e){return this.data.get(e)||{}}delete(e,t){if(null==e||null==e||""==e)return;if(null==t||"string"!=typeof t)return;let r=this.getAll(e);"object"==typeof r&&r.hasOwnProperty(t)&&delete r[t]}destroy(e){this.data.has(e)&&this.data.delete(e)}}},function(e,t){e.exports=require("crypto")},function(e,t,r){const s=r(0);e.exports=class{constructor(e){try{this._config=e,this._logFile=e.folder+"/app.log",s.existsSync(e.folder)||(s.mkdirSync(e.folder),this.info(`【log folder】「${e.folder}」 is created.`))}catch(e){throw e}}_write(e,t){try{s.appendFile(e,t+"\n",function(e){e&&console.error(e)})}catch(e){console.error(e)}}error(e){if(this._config.isProduction||console.error(e),"string"!=typeof e)return!1;e="ERROR,"+(new Date).toLocaleString()+","+e,this._write(this._logFile,e)}debug(e){if(this._config.isProduction||console.debug(e),"string"!=typeof e)return!1;e="DEBUG,"+(new Date).toLocaleString()+","+e,this._write(this._logFile,e)}info(e){if(this._config.isProduction||console.info(e),"string"!=typeof e)return!1;e="INFO,"+(new Date).toLocaleString()+","+e,this._write(this._logFile,e)}warn(e){if(this._config.isProduction||console.warn(e),"string"!=typeof e)return!1;e="WARNING,"+(new Date).toLocaleString()+","+e,this._write(this._logFile,e)}access(e){return this._config.isProduction||console.log(e),!this._config.isWriteAccess||"string"==typeof e&&void this._write(`${this._config.folder}/${(()=>{const e=e=>e.toString().length<2?Array(2).join("0")+e:e,t=new Date;return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`})()}.access`,e)}}},function(e,t){e.exports=function(e,t,r){let s=Object.create(null);var o,i;return s.logger=t,Object.defineProperty(s,"data",{value:{setGetParam:e=>o=e,setPostParam:e=>i=e,getParams:function(e){return e?e in o?o[e]:"":o},postParams:function(e){return e?i&&e in i?i[e]:"":i}}}),Object.defineProperty(s,"respond",{value:{static:e=>r.sendStaticResponse(e),error:(e,t="")=>r.respondErr(e,t),plainText:e=>r.sendResp("text/plain",e),html:e=>r.sendResp("text/html",e),json:e=>r.sendJsonResponse(e),redirect:e=>r.redirectUrl(e)}}),e.config.isActivate&&(s.cookieId="",Object.defineProperty(s,"session",{value:{put:(t,r)=>e.put(s.cookieId,t,r),delete:t=>e.delete(s.cookieId,t),get:function(t){var r=e.getAll(s.cookieId);return t?r.hasOwnProperty(t)?r[t]:"":r},regenId:function(){s.cookieId=e.regenId(s.cookieId),r.setCookie(e.vars.sessionId,s.cookieId)},destroy:()=>e.destroy(s.cookieId)}}),Object.defineProperty(s,"triggerAuthCheck",{value:function(t){return s.cookieId=e.regenId(s.cookieId),r.setCookie(e.vars.sessionId,s.cookieId),e.put(s.cookieId,e.vars.isUserLogged,1)}}),Object.defineProperty(s,"mustBeAuthorized",{value:function(t){return!!e.get(s.cookieId,e.vars.isUserLogged)||(t?"string"==typeof t?r.respondErr(401,t):"object"==typeof t&&t.hasOwnProperty("url")?r.redirectUrl(t.url):(s.logger.error("parameter for mustBeAuthorized is invalid",!0),r.respondErr(401)):r.respondErr(401))}})),Object.defineProperty(s,"native",{value:{request:()=>r.request,response:()=>r.response}}),Object.defineProperty(s,"client",{value:{ip:()=>r.ip(),hostName:()=>r.hostName(),userAgent:()=>r.userAgent(),referrer:()=>r.referrer(),url:()=>r.url(),getCookie:e=>{var t=r.getCookie();if(!e){var s={};return t.forEach((e,t)=>s[t]=e),s}return t.has(e)?t.get(e):""},method:()=>r.method(),headers:e=>e?e in r.request.headers?r.request.headers[e]:"":r.request.headers,addCookie:(...e)=>{if(1===e.length&&"object"==typeof e[0]){if(e[0].hasOwnProperty("key")&&e[0].hasOwnProperty("value"))return r.addCookie(e[0]),!0}else if(2===e.length&&"string"==typeof e[0]&&"string"==typeof e[1])return r.addCookie({key:e[0],value:e[1]}),!0;return!1},deleteCookie:e=>r.deleteCookie(e)}}),s}},function(e,t,r){const s=r(0),o=r(1).MSG;e.exports=class{constructor(){this.port=80,this.host="0.0.0.0",this.publicDir="./public",this.isProduction=!0,this.maxBodySize=102400,this.header={"x-content-type-options":"nosniff","x-frame-options":"SAMEORIGIN","x-xss-protection":"1; mode=block",server:"majidai@1.0","Access-Control-Allow-Origin":"*",Accept:"*/*"},this.allowedMthod=["GET","POST"],this.allowedContentType=["application/x-www-form-urlencoded","application/json","multipart/form-data"],this.session={isActivate:!0,timeOut:18e5},this.log={folder:"./log",isWriteAccess:!1,isProd:this.isProduction},this.ssl={key:"ssl/key.pem",cert:"ssl/cert.pem",port:443,isActivate:!1,http:!0,http2:!1}}applyUserConfig(e){if(e.hasOwnProperty("port")){if("number"!=typeof e.port)throw new TypeError(o.ERR_INVALID_DATA_TYPE_PORT);this.port=e.port}if(e.hasOwnProperty("host")){if("string"!=typeof e.host)throw new TypeError(o.ERR_INVALID_DATA_TYPE_HOST);this.host=e.host}if(e.hasOwnProperty("publicDir")){if("string"!=typeof e.publicDir)throw new TypeError(o.ERR_INVALID_DATA_TYPE_PUBLIC_DIR);if(path.resolve(e.publicDir)==this._rootDir)throw new TypeError(o.ERR_INVALID_PUBLIC_DIR);this.publicDir=e.publicDir}if(e.hasOwnProperty("isProduction")){if("boolean"!=typeof e.isProduction)throw new TypeError(o.ERR_INVALID_DATA_TYPE_IS_PRODUCTION);this.isProduction=e.isProduction}if(e.hasOwnProperty("session")){this._validateObject(this.session,e.session);for(const t in this.session)Object.keys(e.session).includes(t)||(e.session[t]=this.session[t]);if(this.session=e.session,"number"!=typeof this.session.timeOut)throw new TypeError(o.ERR_INVALID_DATA_TYPE_SESSION_TIME);if(this.session.timeOut<1)throw new TypeError(o.ERR_INVALID_SESSION_TIME);if("boolean"!=typeof this.session.isActivate)throw new TypeError(o.ERR_INVALID_DATA_TYPE_SESSION_ACTIVATION)}if(e.hasOwnProperty("maxBodySize")){if("number"!=typeof e.maxBodySize)throw new TypeError(o.ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE);if(e.maxBodySize<1)throw new TypeError(o.ERR_INVALID_MAX_BODY_SIZE);this.maxBodySize=e.maxBodySize}if(e.hasOwnProperty("log")){this._validateObject(this.log,e.log);for(const t in this.log)Object.keys(e.log).includes(t)||(e.log[t]=this.log[t]);this.log=e.log,this.log.isProd=this.isProduction}if(e.hasOwnProperty("header")){this._validateObject(this.header,e.header);for(const t in this.header)Object.keys(e.header).includes(t)||(e.header[t]=this.header[t]);this.header=e.header}e.hasOwnProperty("ssl")&&(this._validateObject(this.ssl,e.ssl),this.ssl.key=s.readFileSync(e.ssl.key),this.ssl.cert=s.readFileSync(e.ssl.cert),this.ssl.port=e.ssl.port,"http"in e.ssl&&"boolean"==typeof e.ssl.http&&(this.ssl.http=e.ssl.http),"http2"in e.ssl&&"boolean"==typeof e.ssl.http2&&(this.ssl.http2=e.ssl.http2),this.ssl.isActivate=!0)}_validateObject(e,t){if(null==t||"object"!=typeof t)throw new TypeError(o.ERR_INVALID_CONFIGURATION);for(const r in t)if(t.hasOwnProperty(r)&&!e.hasOwnProperty(r))throw new TypeError(o.ERR_INVALID_CONFIGURATION)}}},function(e,t,r){const s=r(1).MSG;e.exports=function(e,t){if(e.data.setGetParam({}),e.data.setPostParam({}),e.native.request().on("error",e=>{throw Error(e)}),e.native.response().on("error",e=>{throw Error(e)}),!t.allowedMthod.includes(e.client.method()))return e.respond.error(405);if(e.client.headers("content-length")>t.maxBodySize)return e.respond.error(413);if("POST"==e.client.method()){var r=e.client.headers("content-type").split(";")[0].trim();if(!t.allowedContentType.includes(r))return e.respond.error(400,s.ERR_NOT_SUPPORTED_CONTENT_TYPE)}return!0}},function(e,t){e.exports=function(e,t){let r=e.getCookie(t.vars.sessionId);return""==r?(r=t.genId(),e.setCookie(t.vars.sessionId,r)):0===Object.keys(t.getAll(r)).length?t.createUser(r):t.validateUser(r),r}}])});