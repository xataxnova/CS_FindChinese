import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
enum ReviveStyle {
    direct = 0,
    ads,
    shareGroup
}
class reviveFrame extends ui.reviveUI {
    static rFrame: reviveFrame;
    static reviveTimes: number = 0;
    private howToRevive: ReviveStyle;
    private nowCount: number;
    constructor() {
        super();

        reviveFrame.rFrame = this;

        this.nowCount = 5;
        this.countDown.text = "" + this.nowCount;
        this.initReviveBtnLabel();

        this.btnRevive.on(Laya.Event.CLICK, this, this.reviveBtnCallback);
        this.btnGiveup.on(Laya.Event.CLICK, this, this.giveUp);
        this.btnClose.on(Laya.Event.CLICK, this, this.giveUp);
        Laya.timer.loop(1000, this, this.doCountDown);

        WxController.me.hideClub();
        AdController.me.showBanner();
    }

    //倒计时5,4,3
    private doCountDown() {
        this.nowCount--;
        // debugger
        if (this.nowCount < 1) {
            Laya.timer.clear(this, this.doCountDown);//有动作后就停止倒计时
            this.giveUp();
        }
        this.countDown.text = "" + this.nowCount;
    }

    private initReviveBtnLabel() {
        if (false) {
            // this.btnRevive.label = "直接复活";
            this.howToRevive = ReviveStyle.direct;
        } else {
            Game.me.lifeCount--;
            if (Game.me.lifeCount >= 0) {//默认会有一定次数免费复活，过了这个次数就拉倒了。
                // debugger
                this.howToRevive = ReviveStyle.direct;
                return;
            }

            reviveFrame.reviveTimes++;//记录一下这是第几次复活
            if (reviveFrame.reviveTimes == 1) {//第一次复活，如果允许，则强制分享群
                if (false) {
                    this.howToRevive = ReviveStyle.shareGroup;
                    return;
                } else {
                    if (false) {//不允许群分享却支持广告，那么就看广告
                        this.howToRevive = ReviveStyle.ads;
                    } else {//实在不行，那么就直接复活吧
                        this.howToRevive = ReviveStyle.direct;
                    }
                }
            } else {//一般性的逻辑
                //一次分享，一次视频
                if (reviveFrame.reviveTimes % 2 == 0) {
                    this.howToRevive = ReviveStyle.ads;
                } else {
                    this.howToRevive = ReviveStyle.shareGroup;
                }
            }
        }
    }

    private reviveBtnCallback() {
        Laya.timer.clear(this, this.doCountDown);//有动作后就停止倒计时
        var whenSuccess = function () {
            Game.me.revive();
            Laya.stage.removeChild(reviveFrame.rFrame);
        }
        switch (this.howToRevive) {
            case ReviveStyle.direct:
                whenSuccess();
                break;
            case ReviveStyle.shareGroup:
                console.log("@分享到群复活");
                this.forceShareGroup();
                break;
            case ReviveStyle.ads:
                //TODO 看视频成功后复活
                console.log("@看视频成功后复活");
                AdController.me.playVideoAd(whenSuccess, whenSuccess);
                break;
        }
    }

    //强制分享到群
    private forceShareGroup() {
        var whenSuccess = function () {
            Game.me.lifeCount = 3;//VersionController.FreeReviveTimes;//强制分享后，给一些免费生命
            Game.me.revive();
            Laya.stage.removeChild(reviveFrame.rFrame);
        }
        whenSuccess();
        // WxController.me.shareToGroup(whenSuccess);

    }

    //算了，跳入结算页面
    private giveUp() {
        Laya.timer.clear(this, this.doCountDown);
        AdController.me.hideBanner();
        Laya.stage.addChild(new resultFrame);
        gameFrame.gFrame.removeSelf();
        this.removeSelf();
    }
}
