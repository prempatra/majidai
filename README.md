# majidai
A simple and light web framework for nodejs  
with less then 30KB(npm install).  
No extra libraries are required.  

※日本語の場合は、画面の下の部分までスクロールしてください。

[![Build Status](https://travis-ci.com/dakc/majidai.svg?branch=develop)](https://travis-ci.com/dakc/majidai)
[![npm](https://img.shields.io/npm/v/majidai.svg)](https://www.npmjs.com/package/majidai) 
[![GitHub license](https://img.shields.io/github/license/dakc/majidai.svg?style=popout)](https://github.com/dakc/majidai/blob/master/LICENSE) 

## 1. Installation
```
npm install majidai
```

## 2. Start
With just few lines of code, server is READY.
```
// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

// get routing
server.get("/", function (app) {
    return "Hello majidai";
});

// get routing with parameters
server.get("/books/{year}/{price}", function (app) {
    // parameters enclosed with {} can be accessed directly from data.getParams
    var yearParam = app.data.getParams("year");
    console.log(yearParam);
    var priceParam = app.data.getParams("price");
    console.log(priceParam);

    // get all GET parameters
    var getParams = app.data.getParams();
    // response GET data as JSON data
    return getParams;
});

// post routing
server.post("/", function (app) {
    // get all POST parameters
    var postParams = app.data.postParams();
    
    // do something
    // ..
    
    // response data as JSON data
    return postParams;
});

// start listening server
server.start();
```
Open browser and access to http://localhost/
It should show "Hello majidai".

## 3. Features
The "app" parameter received inside routing has a lot of features that will help to manipulate with requests and responses.
The Tree Structure for the features of majidai is as following
```
app
|------data
|             |-------getParams
|             |-------postParams
|------session
|             |-------put
|             |-------get
|             |-------delete
|             |-------destroy
|             |-------regenId
|------logger
|             |-------access
|             |-------error
|             |-------debug
|             |-------warn
|             |-------info
|------respond
|             |-------static
|             |-------error
|             |-------plainText
|             |-------html
|             |-------json
|             |-------redirect
|------client
|             |-------ip
|             |-------hostName
|             |-------userAgent
|             |-------referrer
|             |-------url
|             |-------method
|             |-------headers
|             |-------getCookie
|             |-------addCookie
|             |-------deleteCookie
|------native
|             |-------request
|             |-------response
|------triggerAuthCheck
|------mustBeAuthorized
```

## 4. Samples
Please refer to following link for general usage of majidai. File name will represent the summary of content inside it.
https://github.com/dakc/majidai/tree/master/example

## 5. Docker
Create container with name majidai and run on interactive mode.
```
docker run -it --rm -p 8000:80 --name majidai dakc/majidai sh
```
Open Browser and access to access to http://localhost:8000/

## TODO
- https, http/2 support  
- support for other http methods like PUT,DELETE,etc  

# Documentaion - https://dakc.github.io/majidai.html

&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
----------------------------------------------------------------------------------------------------
# 日本語
nodejs用のシンプルかつ軽量なWebフレームワークです。  
NODEの標準環境で動作するため、ほかのライブラリーが不要です。  
30KB以下ですのでとても軽いです(npm経由でインストールした場合)。

#### インストール
```
npm install majidai
```

#### 使い方
```
// majidaiの読み込み
const majidai = require("majidai");

// インスタンス化
const server = new majidai();

// ルーティングの定義
server.METHOD("ROUTING", function (app) {
    // 引数のappは様々なプロパティとメソッドを持っています。
    // 機能一覧に説明があります。
    
    // ここに指定のルーティングに関する処理を記述します。
});

// 受付開始
server.start();
```
METHODをgetまたはpostに変更します。  
ROUTINGを適切なパスに変更します。
[書き方については、「2. start」を参考にしてください。](#2-start)

##### パラメータ付きルーティング
```
// {}の中のものがその名前のキーでデータを取得する事ができます。
server.get("/books/{year}/{price}", function (app) {
    var getParams = app.data.getParams();
    var yearParam = getParams.year;
    console.log(yearParam);
    var priceParam = getParams.price;
    console.log(priceParam);

    return getParams;
});
```
##### エラー処理のカスタマイズ
```
// 受け取った引数の中身を変えて変えすだけです
server.onError(function (errObj) {

    //  管理者にメールで通知するなどの処理
    // ..

    // content-typeをtext/htmlにする
    errObj.contentType = "text/html";
    
    // エラー内容を以下のようにHTML文章にする
    errObj.errMsg = `
    <html>
    <head>
    <title>custom error</title>
    </head>
    <body>
        <h1><span style='color:#ff0000'>Woops!</span> Something Went Wrong</h1>
        <p>${errObj.errMsg}</p>
    </body>
    </html>
    `;
    
    // 中身を変えた引数を返す
    return errObj;
});
```
書き方については、[サンプル custom-error.js](./example/custom-error.js)を参考にしてください。

#### 機能一覧
###### 1. データ管理
クライアントから送られて来るデータを「data」属性が管理します。以下のメソッドを持ちます。
- getParams - GETメソッドで送られて来たデータの取得
- postParams - POSTメソッドで送られて来たデータの取得

###### 2. セッション管理
セッションについては「session」属性が管理します。以下のメソッドを持ちます。
- put - セッションに情報を格納する
- get - セッションに情報を取得
- delete - 指定のキーをセッションから削除する
- destroy - セッションに情報を全て削除する
- regenId - セッションIDを再作成する

###### 3. ログ管理
ロギングについては「logger」属性が管理します。以下のメソッドを持ちます。
- access - クライアント端末とリクエストの情報をログとして出力する
- error - エラーログの出力
- debug - デバッグ用のログの出力
- warn - 警告用のログの出力
- info - 一般用ログの出力

###### 4. クライアント情報
クライアントPCについては「client」属性が管理します。以下のメソッドを持ちます。
- ip - クライアントPCのIPアドレス
- hostName - クライアントPCのホスト名
- userAgent - ブラウザの情報
- referrer - リファラー
- url - アクセス中のURL
- method - アクセスしてきたHTTPのメソッド(GETかPOSTか等)
- headers - ヘッダー情報（キーを指定する事で特定のヘッダーのみ取得することも可能）
- getCookie - Cookie情報取得
- addCookie - Cookieの追加
- deleteCookie - Cookieの削除

###### 5. 認証処理
- triggerAuthCheck - 許可したアクセスかどうかチェックするトリガー
- mustBeAuthorized - 上のtriggerAuthCheck設定したページをアクセスせず、mustBeAuthorizedを設定したページにアクセスすると（パラメータで指定したURLにリダイレクトされ、それ以降のコードが実行されない。
書き方については、[サンプル-authentication.js](./example/authentication.js)を参考にしてください

###### 6. レスポンス
クライアントへのレスポンスについては「respond」属性が管理します。
- static - 静的ファイルをレスポンスする
- error - エラーをレスポンスする
- plainText - テキストをレスポンスする
- html - 文字列を「text/html」としてレスポンスする
- json - jsonデータをレスポンスする
- redirect - 指定尾アドレスへリダイレクトする

###### 7. nodeの標準応答機能
node標準のhttpモジュールのrequestとresponseについては「native」属性が管理します。
- request - node標準のhttpモジュールのrequest機能
- response - node標準のhttpモジュールのresponse機能

ツリービューにまとめると、[「3. Features」のようになります。](#3-features)


#### sample
下記のリンクに色々サンプルデータをおいています。ファイル名がその中身の概要を表しています。
https://github.com/dakc/majidai/tree/master/example

#### Docker
下記の１行のコマンドでコンテナーを作成し、起動します。
```
docker run -it --rm -p 8000:80 --name majidai dakc/majidai sh
```
ブラウザーを開いて、http://localhost:8000/
にアクセスすると「Hello majidai」が表示されます。

#### DOCUMENTATION
詳細については以下のページに記載しています。
https://dakc.github.io/majidai.html <-- 英語のみです。ごめんなさい。

### Todos
 - HTTPS,HTTP/2の対応  
 - ほかのHTTPメソッド（PUT、DELETE）の対応  

##### License - [MIT](LICENSE)