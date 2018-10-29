/*
* name;
*/
class ccDataBus {
    static ffme: ccDataBus;
    constructor() {
        ccDataBus.ffme = this;

        this.initData();
    }

    ffdist: number;
    ffqOffset: Laya.Vector4;
    colorIndex: number;
    nextColorIndex: number;//下一个主题颜色
    colorCount: number;
    fogStart: number;
    fogStartD: number;
    fogRange: number;
    fogRangeD: number;

    fogColor: Laya.Vector3;
    fogColors: Array<Laya.Vector3>;
    colorChangInterval: number;

    private initData() {
        this.ffdist = 100;
        this.ffqOffset = new Laya.Vector4(0, 0, 0, 0);
        this.colorIndex = 0;
        this.colorCount = 9;
        this.fogStart = 15;
        this.fogRange = 80;//35;50
        this.fogStartD = 5;
        this.fogRangeD = 10;

        this.colorChangInterval = 10 * 1000;//间隔一定的时间改变颜色


        this.colorIndex = Math.floor(Math.random() * this.colorCount);
        this.fogColors = [
            new Laya.Vector3(187 / 255, 255 / 255, 255 / 255),
            new Laya.Vector3(127 / 255, 255 / 255, 212 / 255),
            new Laya.Vector3(193 / 255, 255 / 255, 193 / 255),
            new Laya.Vector3(176 / 255, 226 / 255, 255 / 255),//176 226 255
            new Laya.Vector3(151 / 255, 255 / 255, 255 / 255),
            new Laya.Vector3(142 / 255, 229 / 255, 238 / 255),
            new Laya.Vector3(221 / 255, 160 / 255, 221 / 255),// 160 
            new Laya.Vector3(238 / 255, 232 / 255, 170 / 255),
            new Laya.Vector3(255 / 255, 193 / 255, 193 / 255),
            new Laya.Vector3(255 / 255, 255 / 255, 224 / 255)
        ];
        this.fogColor = this.fogColors[0];//new Laya.Vector3(1, 1, 1);

        Laya.timer.loop(this.colorChangInterval, this, this.beginToChangeColor);
    }

    private beginToChangeColor() {
        if (Game.me.status == GAME_STATE.playing) {
            this.nextColorIndex = this.colorIndex;//Math.floor(Math.random() * this.colorCount);
            if (this.colorIndex == this.nextColorIndex) {
                // console.log('@debug: next color is the same to now.');
                this.colorIndex = (this.colorIndex + 1) % this.colorCount;
            } else {
                this.colorIndex = this.nextColorIndex;
            }


            ccTween0to1.mmwork(this, function (t) {
                // debugger;
                // console.log('@t=', t);
                this.changeColor(t);
                TerrainController.me.changeColor(t);
                BuildingController.me.changeColor(t);
                CameraController.me.changeColor(t);
            }, 3 * 1000);

        }
    }

    //间隔一段时间后改变主题颜色
    private changeColor(t: number) {
        Laya.Vector3.lerp(this.fogColor, this.fogColors[this.colorIndex], t, this.fogColor);
    }
}