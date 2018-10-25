import { language }from "./Localize/LoadLocalizationFile"
/*
* 触摸控制
*/
class TouchController {
    static me:TouchController;
    constructor() {
        TouchController.me = this;
        this.ison = false;
    }

    ison: boolean;
    preX:number = NaN;
    dltDis:number = 0;
    public onstart() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onmousedown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onmousemove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onmouseup);
    }

    private onmousedown(e: Laya.Event) {
        this.ison = true;
        this.preX = e.stageX;
        // BallController.me.touchMoveTargetX = 0;
        this.dltDis = 0;
    }

    private onmousemove(e: Laya.Event) {
        if (!this.ison || Game.me.status != GAME_STATE.playing) {//点住才可以操作，游戏中才可以操作
            return;
        }

        /*
        if(isNaN(this.preX)){//第一次，要初始化，不然会出现跳动
            this.preX = e.stageX;
        }
        */

        this.dltDis += (e.stageX - this.preX);
        //BallController.me.maxLeftRightX 相当于屏幕的一半宽度
        //计算一下多少 ？？ 相当于 dltDis
        this.dltDis = this.dltDis * ccBallController.ffme.maxLeftRightX / (Laya.Browser.width * 0.2);

        //又乘以0.5的目的主要是 我们不希望滑动整个屏幕才完成 最左到最右 的变迁——毕竟那样玩家手会很累
        //所以我们希望，滑动1/4个屏幕就能完成
        ccBallController.ffme.touchMoveTargetX += this.dltDis;
        // BallController.me.touchMoveTargetX = BallController.me.touchMoveTargetX  * BallController.me.maxLeftRightX / (Laya.Browser.width * 1);
        ccBallController.ffme.touchMoveTargetX = MathFun.limit(-1 * ccBallController.ffme.maxLeftRightX, ccBallController.ffme.maxLeftRightX, ccBallController.ffme.touchMoveTargetX);
        this.preX = e.stageX;
    }

    private onmouseup(e: Laya.Event) {
        this.ison = false;
    }


}
