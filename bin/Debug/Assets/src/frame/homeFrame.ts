import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class homeFrame extends ui.homeUI {
    static hFrame: homeFrame;
    static isFirstPlay:boolean = true;//第一次进入游戏，应该给一个免费球
    shouldVieoFirst: boolean = true;
    constructor() {
        super();
        homeFrame.hFrame = this;

        this.btnStart.on(Laya.Event.CLICK, this, this.clickToGame);
        this.btnShare.on(Laya.Event.CLICK, this, function () {
            WxController.me.share();
        });

        //上一个皮肤
        this.btnPre.on(Laya.Event.CLICK, this, function () {
            this.moveBallQueue(88 * 2);
        });

        //下一个皮肤
        this.btnNext.on(Laya.Event.CLICK, this, function () {
            this.moveBallQueue(-88 * 2);
        });

        this.btnRank.on(Laya.Event.CLICK, this, function () {
            Laya.stage.addChild(new rankFrame);
        });

        this.shouldVieoFirst = false;
        this.setupBallSelector();

        if (!homeFrame.isFirstPlay) {//只有第一次是免费球，后面都是要看视频的
            var rnd = (~~(Math.random() * 100)) % 23;
            while (rnd-- > 0) {
                this.moveBallQueue(-88 * 2);
            }//while
        }


        this.btnMute.selected = !AudioController.me.isMusicEnable();
        this.btnMute.on(Laya.Event.CLICK, this, function () {
            AudioController.me.setOnOff(!this.btnMute.selected);
            // this.btnMute.selected = !this.btnMute.selected;
        });

        WxController.me.showClub();

        Laya.timer.frameLoop(2, this, this.tweenBtn);
    }

    public onExit() {
        Laya.timer.clear(this, this.tweenBtn);
        this.offAll(Laya.Event.MOUSE_DOWN);
        this.offAll(Laya.Event.MOUSE_MOVE);
        this.offAll(Laya.Event.MOUSE_UP);
    }

    private clickToGame() {
        if (this.shouldVieoFirst) {
            this.videoToMatchPlayer();
        } else {
            this.matchPlayer();
        }
    }

    //直接进入游戏
    private matchPlayer() {
        console.log('@matchPlayer');
        Laya.stage.addChild(new matchFrame);
        this.onExit();
        this.removeSelf();
    }

    //先看广告，再用这个球进入游戏
    private videoToMatchPlayer() {
        console.log('@看广告');
        var callBack = this.matchPlayer.bind(this);
        AdController.me.playVideoAd(callBack, callBack);
    }

    oldSelectBall: number = -999;
    selectBall: number = -1;
    private decideBall(ball) {
        if (ball.x < (320 + 88) && ball.x > (320 - 88)) {
            ball.scale(1.4, 1.4);

            this.selectBall = ball['kk'];
            if (this.selectBall != this.oldSelectBall) {
                //新选了一个球
                ccBallController.selectBallTex = ball['kk'];
                // console.log('@deubg select ball=', BallController.selectBallTex);
                if (ccBallController.selectBallTex == 2) {//免费球
                    this.btnStart.skin = "homeFrame/start.png";//.label = '开始游戏';
                    this.shouldVieoFirst = false;
                } else {
                    //广告球
                    if (false) {//正在审核，不要出现看视频的
                        this.btnStart.skin = "homeFrame/start.png";//.label = '开始游戏';
                        this.shouldVieoFirst = false;
                    } else if (false) {//如果不在审核，并且开通了激励视频广告，那么要显示
                        this.btnStart.skin = "homeFrame/video.png";//.label = '试玩\n看视频';
                        this.shouldVieoFirst = true;
                    }
                }
                ccBallController.ffme.resetTex();//重新设置纹理
            }
            this.oldSelectBall = this.selectBall;
        } else {
            ball.scale(1, 1);
        }
    }

    private ballsArr: any;
    private minX: number;
    private maxX: number;
    //初始化球体选择器
    private setupBallSelector() {
        this.ballsArr = [
            this.ball0,
            this.ball1,
            this.ball2,
            this.ball3,
            this.ball4,
            this.ball5];
        this.minX = this.ball0.x;
        this.maxX = this.ball5.x;

        this.ball0.skin = 'audioAvatar/3d/textures/ballMenu/b' + 0 + '.png'; this.ball0['kk'] = 0;
        this.ball1.skin = 'audioAvatar/3d/textures/ballMenu/b' + 1 + '.png'; this.ball1['kk'] = 1;
        this.ball2.skin = 'audioAvatar/3d/textures/ballMenu/b' + 2 + '.png'; this.ball2['kk'] = 2;
        this.ball3.skin = 'audioAvatar/3d/textures/ballMenu/b' + 3 + '.png'; this.ball3['kk'] = 3;
        this.ball4.skin = 'audioAvatar/3d/textures/ballMenu/b' + 4 + '.png'; this.ball4['kk'] = 4;
        this.ball5.skin = 'audioAvatar/3d/textures/ballMenu/b' + 5 + '.png'; this.ball5['kk'] = 5;

        for (var j = 0; j < this.ballsArr.length; j++) {//第一次初始化完判断球选择
            var ball = this.ballsArr[j];
            this.decideBall(ball);//

        }

        var isMouseDown: boolean = false;
        var preX: number = -1;
        var dlt: number = 0;
        this.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            isMouseDown = true;
            preX = e.stageX;
            dlt = 0;
        })
        this.on(Laya.Event.MOUSE_UP, this, function (e) {
            isMouseDown = false;
        })
        this.on(Laya.Event.MOUSE_MOVE, this, function (e) {
            if (!isMouseDown || Math.abs((e.stageX - preX)) < 5) {
                return;
            }
            dlt = (e.stageX - preX);
            this.moveBallQueue(dlt);

            preX = e.stageX;
            // console.log('dlt=', dlt);
        })
    }

    private moveBallQueue(dlt) {
        //循环定位
        for (var j = 0; j < this.ballsArr.length; j++) {
            var ball = this.ballsArr[j];
            ball.x += dlt;// * 0.2;
            if (ball.x > this.maxX) {
                ball.x -= 88 * 2 * this.ballsArr.length;

                var kk = ((ball['kk'] - this.ballsArr.length) + 23) % 23;
                ball.skin = 'audioAvatar/3d/textures/ballMenu/b' + kk + '.png';
                ball['kk'] = kk;
            } else if (ball.x < this.minX) {
                ball.x += 88 * 2 * this.ballsArr.length;
                var kk = ((ball['kk'] + this.ballsArr.length) + 23) % 23;
                ball.skin = 'audioAvatar/3d/textures/ballMenu/b' + kk + '.png';
                ball['kk'] = kk;
            }//if

            //根据它的位置，决定要不要大个显示
            this.decideBall(ball);
        }//for
    }

    //用于控制两侧的 导航箭头 闪烁
    private dir: number = 1;
    private dlt: number = 0;
    static speed: number = 2;
    static distance: number = 30;
    private tweenBtn() {
        this.dlt += this.dir * homeFrame.speed;
        if (this.dlt >= homeFrame.distance) {
            this.dir = -1;
            this.dlt = 0;
        }

        if (this.dlt <= -homeFrame.distance) {
            this.dir = 1;
            this.dlt = 0;
        }
        this.btnNext.x += this.dir * homeFrame.speed;
        this.btnPre.x += -this.dir * homeFrame.speed;
    }


}
