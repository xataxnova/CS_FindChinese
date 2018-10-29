/*
* name;
*/
class FlowLineController {
    static me: FlowLineController;

    airMat: MyGlitterMaterial;
    ptPoolCount: number;
    ptPos: Array<Laya.Vector3>;
    ptPool: Array<Laya.Glitter>;

    lineWidth: number;

    constructor() {
        FlowLineController.me = this;

        this.ptPoolCount = 50;
        this.ptPos = new Array<Laya.Vector3>();
        this.ptPool = new Array<Laya.Glitter>();

        this.lineWidth = .01;
    }

    public onstart() {
        this.airMat = new MyGlitterMaterial;
        this.airMat.renderMode = MyGlitterMaterial.RENDEMODE_TRANSPARENT;
        this.airMat.qOffset = ccDataBus.ffme.ffqOffset;
        this.airMat.dist = ccDataBus.ffme.ffdist;
        this.airMat.mainColor = new Laya.Vector4(1, 1, 1, 1);

        for (var i = 0; i < this.ptPoolCount; i++) {
            this.ptPos.push(new Laya.Vector3);//加50个点存起来

            //加50个glitter
            var glitter: Laya.Glitter = new Laya.Glitter;
            glitter.glitterRender.material = this.airMat;

            var glitterTemplet: Laya.GlitterTemplet = glitter.templet;
            glitterTemplet.lifeTime = 1;
            glitterTemplet.minSegmentDistance = 0.3;
            glitterTemplet.minInterpDistance = 0.6;
            glitterTemplet.maxSlerpCount = 8;
            glitterTemplet.maxSegments = 400;
            glitter.active = false;

            ccSceneController.ffme.mmadd2Scene(glitter);
            this.ptPool.push(glitter);
        }

        Laya.timer.loop(1000, this, this.genAirLines);
    }

    public onupdate(t: number) {
        var ratio: number = 0;//Math.sin(t) * 10;
        for (var i = 0; i < this.ptPoolCount; i++) {
            if (this.ptPool[i].active) {
                var point = this.ptPos[i];
                point.z += 40 * t;//速度

                this.ptPool[i].addGlitterByPositions(new Laya.Vector3(point.x - 0.5 * this.lineWidth + i * 0.1, point.y + i * 0.2, point.z),
                    new Laya.Vector3(point.x + 0.5 * this.lineWidth + i * 0.1, point.y + i * 0.2, point.z));
                if (ccBallController.ffme.ffcurPos.z - point.z < -150) {
                    this.ptPool[i].active = false;
                }//if
            }
        }//for
    }

    public onreset() {
        for (var i = 0; i < this.ptPoolCount; i++) {
            this.ptPool[i].active = false;
        }
    }

    //生成若干条空气线
    public genAirLines() {
        if (Game.me.status != GAME_STATE.playing) {
            return;
        }//if

        /*
        this.airMat.mainColor.x = DataBus.me.fogColor.x;
        this.airMat.mainColor.y = DataBus.me.fogColor.y;
        this.airMat.mainColor.z = DataBus.me.fogColor.z;
        */
        var t = 5;//Math.floor(5 * Math.random()) + 5;
        for (var k = 0; k < t; k++) {
            var xPos: number = 5 * Math.random() - 2.5;
            var yPos: number = 1 * Math.random() + 0.5;
            var zPos: number = ccBallController.ffme.ffcurPos.z - 20;//5 * Math.floor(5 * Math.random());
            this.ptPos[k].fromArray([xPos, yPos, zPos]);
            this.ptPool[k].active = true;
            // this.spanIndex = (this.spanIndex >= this.ptPoolCount - 1) ? 0 : this.spanIndex + 1;
        }//for
    }
}