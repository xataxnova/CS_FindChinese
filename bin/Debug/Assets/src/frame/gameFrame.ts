import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class gameFrame extends ui.gameUI {
    static gFrame: gameFrame;
    constructor() {
        super();
        gameFrame.gFrame = this;
        this.beatCount.text = '' + 0;

        this.handBox.visible = true;
        Laya.timer.loop(2, this, this.handMoving);
        this.on(Laya.Event.MOUSE_DOWN, this, this.clickToStart);

        this.btnMute.selected = !AudioController.me.isMusicEnable();
        this.btnMute.on(Laya.Event.CLICK, this, function () {
            AudioController.me.setOnOff(!this.btnMute.selected);
        });

        if (true) {
            AdController.me.showBanner();
        }

        WxController.me.hideClub();
    }

    private clickToStart() {
        if (Game.me.status == GAME_STATE.idle) {
            Game.me.lifeCount = 3;//VersionController.FreeReviveTimes;//每次重新开始都会重置剩余生命次数
            Game.me.status = GAME_STATE.playing;//进入游戏状态
            this.off(Laya.Event.MOUSE_DOWN, this, this.clickToStart);

            Laya.timer.clear(this, this.handMoving);
            this.handBox.visible = false;
        }
    }

    public onExit() {
        Laya.timer.clear(this, this.handMoving);
    }

    private dir: number = 5;

    //手指移动
    public handMoving() {
        this.hand.x += this.dir;
        if (this.hand.x > 540 || this.hand.x < 50) {
            this.dir *= -1;
        }
    }

    private startGame() {
        Laya.timer.clear(this, this.handMoving);
        this.handBox.visible = false;
    }
}
