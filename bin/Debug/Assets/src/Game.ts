import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
enum GAME_STATE {
    playing = 0,
    gameOver,
    idle,
}
class Game {
    static me: Game;
    status: GAME_STATE;
    public lifeCount:number = 0;//剩余免费命次数

    constructor() {
        Game.me = this;

        this.status = GAME_STATE.idle;
    }

    public initGame() {
        ccSceneController.ffme.onstart();//场景基本（底层逻辑）
        TerrainController.me.onstart();//路面生成
        BuildingController.me.onstart();//建筑
        ccBallController.ffme.onstart();//主角（小球或车子）

        CameraController.me.onstart();
        FlowLineController.me.onstart();

        ItemController.me.onstart();
        TouchController.me.onstart();

        OffsetController.me.onstart();
        // AIController.me.onstart();
        WxController.me.onstart();

        Game.me.onstart();
        AdController.me.onstart();
        Laya.timer.frameLoop(1, this, this.onupdate);
    }

    public onstart() {
        Laya.timer.once(1000, this, function () {
            AudioController.me.initMusic();
        });

        Laya.stage.addChild(new homeFrame());
    }

    public onupdate() {
        // debugger
        var dlt: number = Laya.timer.delta * 0.001;
        dlt = Math.min(dlt, 0.1);//如果时间隔太久， 那就当做0.1
        TerrainController.me.onupdate(dlt);
        BuildingController.me.onupdate(dlt);
        ccBallController.ffme.onupdate(dlt);

        CameraController.me.onupdate(dlt);
        FlowLineController.me.onupdate(dlt);
        ItemController.me.onupdate(dlt);//更新判断是否需要创建道具（加速器，障碍物等等）

        ccAIController.ffme.onupdate(dlt);
    }

    public readyRacing() {
        this.status = GAME_STATE.idle;
    }


    public revive() {
        this.status = GAME_STATE.playing;

        //复活保护
        ccBallController.ffme.reviveProtected = true;
        Laya.timer.once(2 * 1000, this, function () {
            ccBallController.ffme.reviveProtected = false;
        });
    }

    public hitBox() {
        Game.me.status = GAME_STATE.gameOver;
        homeFrame.isFirstPlay = false;
        console.log('add reviveFrame');
        this.updateMaxHistory(ccBallController.ffme.getScore());
        Laya.stage.addChild(new reviveFrame);
    }

    //重启游戏
    public resetGame() {
        this.status = GAME_STATE.idle;
        ccSceneController.ffme.onreset();
        TerrainController.me.onreset();
        BuildingController.me.onreset();
        ccBallController.ffme.onreset();

        CameraController.me.onreset();
        FlowLineController.me.onreset();

        ItemController.me.onreset();
        ccAIController.ffme.onreset();

        OffsetController.me.onreset();
    }

    //获取最大历史成绩
    public getMaxHistory() {
        var record = Laya.LocalStorage.getItem('3dball_max');
        var recordNum = parseInt(record);
        if (isNaN(recordNum)) {
            recordNum = 0;
        }
        return recordNum;
    }

    //每一轮结束时，比较判断一下最大历史成绩
    public updateMaxHistory(score: number) {
        var history = this.getMaxHistory();
        if (score > history) {
            Laya.LocalStorage.setItem('3dball_max', '' + score);
            WxController.me.sendMyScoreToWX(score);
        }
    }

}
