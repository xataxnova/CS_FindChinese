import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class HttpController {
    public static me: HttpController;
    public static baseURL: string = 'http://192.168.1.100:8055/';
    public static getConfigURL: string = 'getConfig';
    public static code2SessionURL: string = 'code2Session';
    public static ticketParseURL: string = 'ticketParse';
    public static getShareDataURL:string = 'getShareData';

    constructor() {
        HttpController.me = this;
    }

    private fetchAHttpObj(): laya.net.HttpRequest {//从池子中取出一个对象
        var obj: laya.net.HttpRequest = laya.utils.Pool.getItemByClass("httpRequest", laya.net.HttpRequest);
        obj.offAll();
        obj['clear']();
        // var obj:laya.net.HttpRequest = new laya.net.HttpRequest();
        return obj;
    }
    private releaseAHttpObj(xhr: laya.net.HttpRequest) {//把这个http对象放回到池子中
        xhr["clear"]();//clear方法是一个protected方法，所以只能用此下策
        xhr.offAll();
        laya.utils.Pool.recover("httpRequest", xhr);
        // xhr = null;
    }

    //根据传入的对象来生成url参数串
    private genParam(dataObj) {
        // var param = '';

        /*
        var paraCount = 0;
        for (var k in dataObj) {
            paraCount++;
            if (paraCount > 1) {
                param = param + '&';
            }
            param = param + encodeURIComponent(k) + '=' + encodeURIComponent(dataObj[k]);
        }
        */
        return JSON.stringify(dataObj)
        // return param;
    }

    //通过get发送数据
    public simpleGet(url: string, dataObj: Object, callback: any, alertWhenErr: boolean = true) {
        var retryCount = 0;
        var sendFun = function () {
            var finalUrl = url + '?' + HttpController.me.genParam(dataObj);

            var xhr: laya.net.HttpRequest = HttpController.me.fetchAHttpObj();
            xhr.http.timeout = 5000;//设置超时时间；
            xhr.once(laya.events.Event.COMPLETE, this, function (data) {
                HttpController.me.releaseAHttpObj(xhr);
                callback(JSON.parse(data));
            });
            xhr.once(laya.events.Event.ERROR, this, function () {
                HttpController.me.releaseAHttpObj(xhr);
                retryCount++;
                if (retryCount >= 3) {
                    //重试了3次尚且失败，该弹出提示框了
                    if (alertWhenErr) {
                        // ErrorHandler.throwNetWorkErr(HttpController.me.simpleGet.bind(HttpController.me, url, dataObj, callback, alertWhenErr));
                    }
                    return;
                }
                sendFun();
            });
            xhr.send(finalUrl, null, "get", "text");
        }
        sendFun();
    }

    //通过post发送数据
    public simplePost(url: string, dataObj: Object, callback: any, alertWhenErr: boolean = true) {
        var retryCount = 0;
        var sendFun = function () {
            var xhr: laya.net.HttpRequest = HttpController.me.fetchAHttpObj();
            xhr.http.timeout = 5000;//设置超时时间；
            xhr.once(laya.events.Event.COMPLETE, this, function (data) {
                // Logger.log('post receive:', JSON.stringify(data));
                HttpController.me.releaseAHttpObj(xhr);
                callback(JSON.parse(data));
                // callback(data);
            });
            xhr.once(laya.events.Event.ERROR, this, function () {
                HttpController.me.releaseAHttpObj(xhr);
                retryCount++;
                if (retryCount > 2) {
                    //重试了3次尚且失败，该弹出提示框了
                    if (alertWhenErr && window['wx']) {
                        window['wx'].showModal({
                            title: localization.string_3,
                            content: localization.string_4,
                            cancelText: localization.string_5,
                            confirmText: localization.string_6,
                            success: (res) => {
                                if (res.confirm) {
                                    //重试
                                    HttpController.me.simplePost.call(HttpController.me, url, dataObj, callback, alertWhenErr);
                                } else if (res.cancel) {
                                    //取消
                                    // HttpController.me.simplePost.call(HttpController.me, url, dataObj, callback, alertWhenErr);
                                }
                            }//success
                        });
                        // ErrorHandler.throwNetWorkErr(HttpController.me.simplePost.bind(HttpController.me, url, dataObj, callback, alertWhenErr));
                    }
                    return;
                }
                sendFun();
            });
            xhr.send(url, HttpController.me.genParam(dataObj), 'post', 'text');
        }
        sendFun();
    }
}
