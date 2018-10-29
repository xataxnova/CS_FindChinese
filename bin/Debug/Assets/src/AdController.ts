import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class AdController {
    static me: AdController;
    static bannAdId: string;//''
    static videoAdId: string;//''

    bannerAd: any;
    videoAd: any;
    constructor() {
        AdController.me = this;
    }

    public onstart() {
        this.createBanner();
    }

    //创建视频广告
    private createBanner() {
        if (window['wx'] == undefined || AdController.bannAdId == "") {
            return;
        }

        var sysInfo = window['wx'].getSystemInfoSync();
        var dis = 16;
        this.bannerAd = window['wx'].createBannerAd({
            adUnitId: AdController.bannAdId,
            style: {
                left: 0,
                width: 200,//sysInfo.screenWidth - dis,
                top: sysInfo.windowHeight - 110
            }
        });
        var that = this;
        this.bannerAd.onResize(function (res) {
            // debugger
            that.bannerAd.style.top = sysInfo.windowHeight - res.height - dis * 0.5;
            that.bannerAd.style.left = (sysInfo.screenWidth - that.bannerAd.style.realWidth) * 0.5;
            // that.bannerAd.style.left = sysInfo.screenWidth * 0.5 - res.width * 0.5;
        });
        this.bannerAd.hide();
    }

    public showBanner() {
        this.bannerAd && this.bannerAd.show();
    }

    public hideBanner() {
        this.bannerAd && this.bannerAd.hide();
    }

    public playVideoAd(callback, ifAdErr) {
        if (window['wx'] == undefined) {
            callback();
            return;
        }

        if (AdController.videoAdId == "") {
            ifAdErr();
            return;
        }

        var wx = window['wx'];
        if (this.videoAd == undefined) {
            // delete this.videoAd;
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: AdController.videoAdId,
            });
        }

        var that = this;
        this.videoAd.load()
            .then(() => {
                that.videoAd.offLoad();
                that.videoAd.show();
            })
            .catch(err => {
                that.videoAd.load()
                    .then(() => {
                        that.videoAd.offLoad();
                        that.videoAd.show();
                    })
            })
        this.videoAd.onError(function (err) {
            that.videoAd.offError();
            console.log('@error: 当前已没有可以浏览的广告');
            ifAdErr();
        });

        this.videoAd.onClose(function (res) {
            that.videoAd.offClose();//关掉这个，否则会有多次回调产生
            if ((res && res.isEnded) || res === undefined) {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                callback();
                Game.me.lifeCount = 3;//VersionController.FreeReviveTimes;//看了完整视频，也给一定的免费生命
            } else {//播放中途退出
                WxController.me.showToast(localization.string_1);
            }
        });
    }
}
