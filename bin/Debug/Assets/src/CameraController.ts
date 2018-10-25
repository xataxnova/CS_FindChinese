import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class CameraController {
    static me: CameraController;

    camera: Laya.Camera;
    initPos: Laya.Vector3;
    curPos: Laya.Vector3;
    curRot: Laya.Vector3;

    offsetZ: number;//镜头和球体在z轴上的间隔
    maxPosY: number;//镜头最高位置
    minPosY: number;//镜头最低位置

    constructor() {
        CameraController.me = this;
        this.offsetZ = 10;
        this.maxPosY = 2;//速度越低，镜头越高 2.5
        this.minPosY = 1;//1

        this.initPos = new Laya.Vector3(0, 2, 8);
        this.curPos = new Laya.Vector3(0, this.maxPosY, 8);
        this.curRot = new Laya.Vector3();


    }

    public onstart() {
        this.camera = new Laya.Camera(0, .01, 200);
        this.camera.fieldOfView = 50;
        this.camera.transform.position = this.curPos;
        this.camera.transform.localRotationEuler = this.curRot;
        ccSceneController.ffme.mmadd2Scene(this.camera);
        var fogColor: Laya.Vector3 = ccDataBus.ffme.fogColor;
        this.camera.clearColor = new Laya.Vector4(fogColor.x, fogColor.y, fogColor.z, 1);
    }

    public onupdate(t: number) {
        if (Game.me.status === GAME_STATE.playing) {
            this.updatePosition(t);
            this.updateRotation(t);
        }
    }

    public onreset() {
        this.curPos = new Laya.Vector3(0, this.maxPosY, 8);
        this.curRot = new Laya.Vector3();
        this.camera.transform.position = this.curPos;
        this.camera.transform.localRotationEuler = this.curRot;
    }

    public changeColor(t: number) {
        this.camera.clearColor = new Laya.Vector4(ccDataBus.ffme.fogColor.x, ccDataBus.ffme.fogColor.y, ccDataBus.ffme.fogColor.z, 0.5);
    }

    public isUpDownShake: boolean = false;
    private updatePosition(t: number) {
        var nowSpeed: number = ccBallController.ffme.moveSpeed;
        var high: number = ccBallController.highSpeed;
        var low: number = ccBallController.lowSpeed;
        // this.curPos.y = this.maxPosY - (nowSpeed - low) / (high - low) * (this.maxPosY - this.minPosY);
        //计算出目标的高度
        // var targetY = Laya.MathUtil.lerp(this.maxPosY, )
        var targetY = this.maxPosY - (nowSpeed - low) / (high - low) * (this.maxPosY - this.minPosY);
        //按照一秒内完成目标位置到达的设定，计算当前流失时间应该抵达的位置
        this.curPos.y = this.curPos.y + (targetY - this.curPos.y) * 0.6;//如果直接切换，顿挫感会很强，所以可以乘上一个小数来减缓这种顿挫感
        if (this.isUpDownShake) {//悬挂上下摇晃感
            this.curPos.y += Math.sin(t * 1000) * 0.3;
        }
        this.curPos.y = MathFun.limit(this.minPosY, this.maxPosY, this.curPos.y);
        // this.curPos.y = BallController.me.curPos.y + 3;

        this.curPos.z = ccBallController.ffme.ffcurPos.z + this.offsetZ;
        this.camera.transform.position = this.curPos;
    }

    //旋转镜头的角度
    private updateRotation(t: number) {
        var ratio: number = ccBallController.ffme.ffcurPos.x / ccBallController.ffme.maxLeftRightX;
        //最终角度大一点，转换的速度慢一点
        this.curRot.z = Laya.MathUtil.lerp(this.curRot.z, ratio * 15, 0.8 * t);//12
        this.camera.transform.localRotationEuler = this.curRot;
    }
}
