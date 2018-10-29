/*
* name;
*/
class matchFrame extends ui.matchUI {
    static mFrame: matchFrame;

    private dataSourceObj: any;
    private addCount: number;
    private arr: any;
    private rnd30: any;
    private countDown = 3;
    constructor() {
        super();
        matchFrame.mFrame = this;
        this.btnBack.on(Laya.Event.CLICK, this, this.exitPage);

        this.addCount = 0;
        this.dataSourceObj = [];
        this.arr = [];

        this.prepareAvatar();

        WxController.me.hideClub();
        this.matchTimer.text = this.countDown + 's';
        Laya.timer.loop(1000, this, this.updateTimer);
    }

    private prepareAvatar() {
        //填充一些默认的头像
        for (var i = 0; i < 30; i++) {
            this.dataSourceObj.push({ avatar: { skin: 'audioAvatar/avatar/avatar.png' } });
        }
        this.avatarList.dataSource = this.dataSourceObj;
        this.arr = this.genARndArr(119);
        this.rnd30 = this.genARndArr(30);//打乱30个索引的顺序，造成随机载入图片的假象
        Laya.timer.frameLoop(2, this, this.addAvatar)
    }

    private addAvatar() {
        if (this.addCount >= 30) {
            Laya.timer.clear(this, this.addAvatar);
        } else {
            var rndAvatar = 'audioAvatar/avatar/' + this.arr.shift() + '.jpg';
            this.dataSourceObj[this.rnd30[this.addCount]].avatar.skin = rndAvatar;
            this.avatarList.refresh();
        }
        this.addCount++;
    }

    private genARndArr(size: number): any {
        //随机打乱119张图顺序
        var arr = [];
        for (var i = 0; i < size; i++) {
            arr.push(i);
        };

        arr.sort(function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
        });

        return arr;
    }

    private updateTimer() {
        this.countDown--;
        if (this.countDown <= 0) {
            this.startGame();
        } else {
            this.matchTimer.text = this.countDown + 's';
        }
    }

    private startGame() {
        Laya.timer.clear(this, this.updateTimer);
        Laya.timer.clear(this, this.addAvatar);
        Laya.stage.addChild(new gameFrame);
        this.removeSelf();

        ccAIController.ffme.onstart();
        OffsetController.me.onreset();
        Game.me.readyRacing();//开始游戏
    }

    private exitPage() {
        Laya.timer.clear(this, this.updateTimer);
        Laya.timer.clear(this, this.addAvatar);
        Laya.stage.addChild(new homeFrame);
        this.removeSelf();
    }
}