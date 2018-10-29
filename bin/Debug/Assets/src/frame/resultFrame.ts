import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class resultFrame extends ui.resultUI {
    static rFrame: resultFrame;

    private tick: number = 0;
    private oldX: number = 0;
    private currentLinkImageID: number = 0;
    constructor() {
        super();
        resultFrame.rFrame = this;

        this.oldX = this.imgAddFav.x;

        this.imgAddFav.y = 20;
        if (ccSceneController.ffme.isIphoneX()) {
            this.imgAddFav.y += 20;
        }
        this.imgAddFav.y = this.imgAddFav.y * Laya.Browser.width / 640;


        this.btnHome.on(Laya.Event.CLICK, this, this.toHome);//btnHome
        this.btnClose.on(Laya.Event.CLICK, this, this.toHome);//btnHome

        if (false) {//审核时，出现正常按钮
            this.btnClose.visible = true;
            this.btnHome.visible = true;
        } else {//过审了，隐藏掉返回主页按钮
            this.btnClose.visible = true;
            this.btnHome.visible = true;
        }

        this.btnShare.on(Laya.Event.CLICK, this, this.share);
        Laya.timer.frameLoop(1, this, this.updateAddFav);

        this.score.text = '' + ccBallController.ffme.getScore();
        this.record.text = localization.string_2 + Game.me.getMaxHistory();

        WxController.me.showClub();
        //请求前三名
        WxController.me.showFriendRanking(SubContextCMD.RequestTop3, this.rankBox);
        // this.link.visible = false;
        // this.setupLink();
    }

    private share() {
        WxController.me.share();
    }

    private toHome() {
        Laya.timer.clear(this, this.updateAddFav);
        // Laya.timer.clear(this, this.loopLinkImage);
        OpenContextBridgeA.me.exitDrawShareCanvas();
        this.removeSelf();
        Laya.stage.addChild(new homeFrame());
        Game.me.resetGame();
    }

    private updateAddFav() {
        this.tick++;
        this.imgAddFav.x = Laya.stage.width * 0.5 - 100 + Math.sin(this.tick * 0.1) * 20;
    }

    //设置下方的链接，跳转小程序
    /*
    private setupLink() {
        this.link.visible = false;
        if ((window['wx'] != undefined && !VersionController.me.IS_REVIEW && VersionController.LinkAppId != "") || false) {//微信环境下有效
            this.link.visible = true;
            Laya.timer.loop(100, this, this.loopLinkImage);
            this.link.on(Laya.Event.CLICK, WxController.me, WxController.me.gotoMiniProgrom.bind(WxController.me, { from: 'luo' }));
        }
    }
    */

    // private loopLinkImage() {
    //     this.link.skin = "audioAvatar/link/f" + this.currentLinkImageID + ".jpg";
    //     this.currentLinkImageID = (this.currentLinkImageID + 1) % 20;
    // }
}
