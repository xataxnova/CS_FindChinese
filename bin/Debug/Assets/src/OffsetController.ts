import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class OffsetController {
    static me: OffsetController;

    xv: Array<number>;
    yv: Array<number>;
    oldOffsetXY: Laya.Vector4;
    nowOffsetXY: Laya.Vector4;
    targetOffsetXY: Laya.Vector4;
    currentOffsetIndex: number;

    constructor() {
        OffsetController.me = this;
        this.xv = new Array<number>();
        this.yv = new Array<number>();

        this.oldOffsetXY = new Laya.Vector4;
        this.nowOffsetXY = new Laya.Vector4;
        this.targetOffsetXY = new Laya.Vector4;

        this.currentOffsetIndex = 0;
    }

    public onstart() {
        this.xv = [0, 5, -5, -15, 10];
        this.yv = [0, 20, 30, 20, 10];

        Laya.timer.loop(5 * 1000, this, this.ontick);
        this.ontick();
    }

    public ontick() {
        if (Game.me.status != GAME_STATE.playing) {
            return;
        }

        var x = this.xv[this.currentOffsetIndex];//Math.random() * 90 - 40;
        var y = this.yv[this.currentOffsetIndex];//Math.sin(Date.now()) * 10;//Math.random() * 30 - 15;
        this.oldOffsetXY.x = x;
        this.oldOffsetXY.y = y;

        this.currentOffsetIndex = (this.currentOffsetIndex + 1) % this.yv.length;

        this.targetOffsetXY.x = this.xv[this.currentOffsetIndex];
        this.targetOffsetXY.y = this.yv[this.currentOffsetIndex];//this.nowOffsetXY.y + 20;

        ccTween0to1.mmwork(this, function (p) {
            Laya.Vector4.lerp(this.oldOffsetXY, this.targetOffsetXY, p, this.nowOffsetXY);

            FlowLineController.me.airMat.qOffset = this.nowOffsetXY;
            ccBallController.ffme.ballMat.ffqOffset = this.nowOffsetXY;
            ccBallController.ffme.trailMat.qOffset = this.nowOffsetXY;
            ccBallController.ffme.shadowMat.ffqOffset = this.nowOffsetXY;
            // BallController.me.nameMat.qOffset = this.nowOffsetXY;

            TerrainController.me.roadAMaterial.ffqOffset = this.nowOffsetXY;
            TerrainController.me.roadBMaterial.ffqOffset = this.nowOffsetXY;
            BuildingController.me.buildingMaterial.ffqOffset = this.nowOffsetXY;
            ItemController.me.speedUpMat.ffqOffset = this.nowOffsetXY;
            ItemController.me.boxMat.ffqOffset = this.nowOffsetXY;
            ItemController.me.jumpMat.ffqOffset = this.nowOffsetXY;

            ccAIController.ffme.reAssignOffset(this.nowOffsetXY);
        }, 1000 * 3);//500切换贼快
    }

    public onreset() {
        FlowLineController.me.airMat.qOffset = this.nowOffsetXY;
        ccBallController.ffme.ballMat.ffqOffset = this.nowOffsetXY;
        ccBallController.ffme.trailMat.qOffset = this.nowOffsetXY;
        ccBallController.ffme.shadowMat.ffqOffset = this.nowOffsetXY;
        // BallController.me.nameMat.qOffset = this.nowOffsetXY;

        TerrainController.me.roadAMaterial.ffqOffset = this.nowOffsetXY;
        TerrainController.me.roadBMaterial.ffqOffset = this.nowOffsetXY;
        BuildingController.me.buildingMaterial.ffqOffset = this.nowOffsetXY;
        ItemController.me.speedUpMat.ffqOffset = this.nowOffsetXY;
        ItemController.me.boxMat.ffqOffset = this.nowOffsetXY;
        ItemController.me.jumpMat.ffqOffset = this.nowOffsetXY;

        ccAIController.ffme.reAssignOffset(this.nowOffsetXY);
    }
}
