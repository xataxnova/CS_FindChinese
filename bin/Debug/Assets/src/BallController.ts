/*
* name;
*/
class ccBallController {
    static ffme: ccBallController;
    static selectBallTex: number;

    static lowSpeed: number = 110;//60;
    static highSpeed: number = 160;//90

    ffcurPos: Laya.Vector3;
    curRota: Laya.Vector3;
    moveSpeed: number;//移动速度
    minMoveSpeed: number;//最小移动速度
    maxMoveSpeed: number;//最大移动速度

    ballNode: Laya.Sprite3D;
    ballMat: ccMyEnvMaterial;
    ballBody: Laya.MeshSprite3D;
    bodyPosY: number;

    shadowMat: ccMyEnvMaterial;
    shadow3d: Laya.MeshSprite3D;

    trailMat: MyGlitterMaterial;
    trail3d: Laya.Glitter;
    trailPos1: Laya.Vector3;
    trailPos2: Laya.Vector3;

    needSlowDown: boolean;//加速后要设置此标志位，减速下来

    //操控的位置
    maxLeftRightX: number = 2.2;
    touchMoveTargetX: number = 0;

    // rankName: Laya.Label;//用来记录名次的头顶标签
    nameMat: ccMyEnvMaterial;
    name3d: Laya.MeshSprite3D;

    beatsCount: number;//击败了几个对手

    reviveProtected: boolean;//助力复活后一段时间内有保护措施

    constructor() {
        ccBallController.ffme = this;
        this.minMoveSpeed = ccBallController.lowSpeed;
        this.maxMoveSpeed = ccBallController.highSpeed;
        this.moveSpeed = this.minMoveSpeed;// + Math.random() * 10;

        this.bodyPosY = 0.32;

        this.trailPos1 = new Laya.Vector3(-.5, .06, 0);
        this.trailPos2 = new Laya.Vector3(.5, .06, 0);

        this.needSlowDown = false;

        this.beatsCount = 0;

        this.reviveProtected = false;
    }

    public resetTex() {
        this.ballMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/ballTex/b" + ccBallController.selectBallTex + ".jpg");
    }

    //调整超越对手数量值
    public mmaddBeatsCount(isAdd: boolean) {
        if (isAdd) {
            this.beatsCount++;

        } else {
            this.beatsCount--;
        }

        gameFrame.gFrame.beatCount.text = '' + this.beatsCount;
        // console.log('@debug: 您超越了%s名对手', this.beatsCount);
    }

    public onstart() {
        this.createPlayer();
        this.createShadow();
        this.createTrail();

        // Laya.loader.create('robot/187.png', Laya.Handler.create(this, this.createNameLabel));
    }

    public onupdate(t) {
        if (Game.me.status == GAME_STATE.playing) {

            this.moveBall(t);
            this.rotateBall(t);
            this.growSpeed(t);
            this.updateTrail();

            this.updateScore(t);
        }
    }

    public onreset() {
        this.moveSpeed = this.minMoveSpeed;// + Math.random() * 10;

        this.bodyPosY = 0.32;

        this.needSlowDown = false;

        this.beatsCount = 0;

        {
            this.ffcurPos = new Laya.Vector3(0, 0, 0);
            this.ballNode.transform.position = this.ffcurPos;
            this.ballBody.transform.localRotationEuler = this.curRota;
            this.curRota = new Laya.Vector3(0, 0, 0);
        }
    }

    //创建小球
    private createPlayer() {
        this.ffcurPos = new Laya.Vector3(0, 0, 0);
        this.ballNode = new Laya.Sprite3D;
        ccSceneController.ffme.mmadd2Scene(this.ballNode);

        var ballMesh: Laya.BaseMesh = Laya.Mesh.load("audioAvatar/3d/mesh/ball.lm");
        // e = new Laya.PlaneMesh(1, 1, 1, 1),
        var dist: number = ccDataBus.ffme.ffdist;
        var qOffset = ccDataBus.ffme.ffqOffset;
        this.ballMat = new ccMyEnvMaterial;
        this.ballMat.ffdist = dist;
        this.ballMat.ffqOffset = qOffset;
        this.ballMat.ffmainColor = new Laya.Vector4(1, 1, 1, 1);
        // this.ballMat.mainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/player.png");
        this.ballMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/ballTex/b0.jpg");


        /*
        var idx = 0;
        Laya.timer.loop(4 * 1000, this, function () {
            idx = (idx + 1) % 28;
            this.ballMat.mainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/newBall/ball" + idx + ".jpg");
        });
        */
        //

        this.ballBody = new Laya.MeshSprite3D(ballMesh, 'player');
        this.ballBody.meshRender.sharedMaterial = this.ballMat;
        this.ballBody.transform.localScale = new Laya.Vector3(.6, .6, .6);
        this.curRota = new Laya.Vector3(0, 0, 0);
        this.ballBody.transform.localRotationEuler = this.curRota;//new Laya.Vector3(0, 0, 90);
        this.ballBody.transform.localPosition = new Laya.Vector3(0, this.bodyPosY, 0);

        //添加物理相关组件（可碰撞）
        this.ballBody.addComponent(Laya.SphereCollider)["radius"] = 0.5;
        this.ballBody.addComponent(Laya.Rigidbody);//必须有刚体才会碰撞
        this.ballBody.addComponent(CollisionHandler);

        var handle: CollisionHandler = this.ballBody.getComponentByType(CollisionHandler) as CollisionHandler;
        handle.mmsetHostObj(this);

        this.ballBody.layer = Laya.Layer.getLayerByNumber(ITEM_LAYER.BALL_LAYER);
        this.ballNode.addChild(this.ballBody);
        this.ballNode.transform.position = this.ffcurPos;

        //标签
        /*
        this.rankName = new Laya.Label('我在这里↓');
        this.rankName.fontSize = 60;
        this.labelPosV = new Laya.Vector3();
        Laya.stage.addChild(this.rankName);
        */
    }

    private createShadow() {
        this.shadowMat = new ccMyEnvMaterial;
        this.shadowMat.renderMode = ccMyEnvMaterial.RENDEMODE_TRANSPARENT;
        this.shadowMat.ffmainColor = new Laya.Vector4(1, 1, 1, .5);
        this.shadowMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/shadowc.png");
        this.shadowMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.shadowMat.ffdist = ccDataBus.ffme.ffdist;

        var shadowMesh: Laya.BaseMesh = new Laya.PlaneMesh(1, 1, 1, 1);
        this.shadow3d = new Laya.MeshSprite3D(shadowMesh);
        this.shadow3d.meshRender.sharedMaterial = this.shadowMat;
        this.shadow3d.transform.localScale = new Laya.Vector3(.8, .8, .8);
        this.shadow3d.transform.localPosition = new Laya.Vector3(0, 0.06, 0);
        this.ballNode.addChild(this.shadow3d);
    }

    private createTrail() {
        this.trailMat = new MyGlitterMaterial;
        this.trailMat.renderMode = MyGlitterMaterial.RENDEMODE_TRANSPARENT;
        this.trailMat.mainColor = new Laya.Vector4(1, 1, 1, .8);
        this.trailMat.qOffset = ccDataBus.ffme.ffqOffset;
        this.trailMat.dist = ccDataBus.ffme.ffdist;

        this.trail3d = new Laya.Glitter;
        this.trail3d.transform.localPosition = new Laya.Vector3(0, .01, 0);
        this.trail3d.glitterRender.sharedMaterial = this.trailMat;
        var templet = this.trail3d.templet;
        templet.lifeTime = 1;
        templet.minSegmentDistance = .1;
        templet.minInterpDistance = .6;
        templet.maxSlerpCount = 8;
        templet.maxSegments = 1024;
        ccSceneController.ffme.mmadd2Scene(this.trail3d);
    }

    //移动小球
    private moveBall(t) {
        // debugger
        // 如果开启ai ，要把这下面一行注释，免得冲突
        this.ffcurPos.x = Laya.MathUtil.lerp(this.ffcurPos.x, ccBallController.ffme.touchMoveTargetX, 0.3);
        this.ffcurPos.x = MathFun.limit(-1 * ccBallController.ffme.maxLeftRightX, ccBallController.ffme.maxLeftRightX, this.ffcurPos.x);
        this.ffcurPos.z -= this.moveSpeed * t;
        this.ballNode.transform.position = this.ffcurPos;
    }

    private rotateBall(t) {
        // debugger
        this.curRota.x = (this.curRota.x + 360 * this.moveSpeed / (2 * 0.3 * 3.14)) % 360; //this.moveSpeed / (2 * 0.6 * 3.14) * 360
        this.ballBody.transform.localRotationEuler = this.curRota;
    }

    //加速后，需要，慢慢回落，不能一直线性加速
    private growSpeed(t) {
        if (!this.needSlowDown) {
            return;
        }
        //开始减速
        this.moveSpeed -= 0.7;
        this.moveSpeed = MathFun.limit(this.minMoveSpeed, this.maxMoveSpeed, this.moveSpeed);
        if (this.needSlowDown && this.moveSpeed <= this.minMoveSpeed) {
            // debugger;
            this.moveSpeed = this.minMoveSpeed;
            this.needSlowDown = false;
        }

    }

    private updateTrail() {
        this.trailPos1.x = this.ffcurPos.x - .5 * 0.3;//宽度
        this.trailPos2.x = this.ffcurPos.x + .5 * 0.3;
        this.trailPos1.z = this.trailPos2.z = this.ffcurPos.z + 0.1;//位置
        this.trail3d.addGlitterByPositions(this.trailPos2, this.trailPos1);
    }

    public autoNavi() {
        var points = Object.keys(ccAIController.ffme.ffnaviPoint).length;
        // console.log('@navi points=', points);
        // AIController.me.naviPoint
        var safeX = ccAIController.ffme.mmgetSafePointX(this.ffcurPos);

        if (safeX != undefined) {//找到了安全路点
            ccTween0to1.mmwork(this, function (t) {
                this.curPos.x = Laya.MathUtil.lerp(this.curPos.x, safeX, t);
                this.ballNode.transform.position = this.curPos;
            }, 500);

        }
    }

    //触及加速器，加速开始
    public mmaddSpeed() {
        FlowLineController.me.genAirLines();
        this.moveSpeed += 30;
        this.moveSpeed = MathFun.limit(this.minMoveSpeed, this.maxMoveSpeed, this.moveSpeed);

        this.needSlowDown = true;

        /*
                Laya.timer.scale = 0.5;
                setTimeout(function() {
                    Laya.timer.scale = 1;
                }, 500);
        */
    }

    public mmjump() {
        var oldY: number = 0;//this.curPos.y;
        // debugger
        var that = this;
        this.shadow3d.active = false;
        this.trail3d.active = false;

        //速度越大，弹得越高！
        var dltHigh = Laya.MathUtil.lerp(4.5, 5, (this.moveSpeed - this.minMoveSpeed) / (this.maxMoveSpeed - this.minMoveSpeed));
        ccTween0to1.mmwork(this, function (t) {

            this.ffcurPos.y = Laya.MathUtil.lerp(oldY, oldY + dltHigh, t);
            // this.curPos.x += 5;
        }, 300, function () {
            //到达最高点后回落
            var maxY = that.ffcurPos.y;
            ccTween0to1.mmwork(that, function (t2) {
                that.ffcurPos.y = Laya.MathUtil.lerp(maxY, oldY, t2);
                // that.curPos.x += 5;
            }, 300, function () {//回到地面了
                that.shadow3d.active = true;
                that.trail3d.active = true;
                that.ffcurPos.y = oldY;//that.bodyPosY

                CameraController.me.isUpDownShake = true;
                Laya.timer.once(80, that, function () {
                    CameraController.me.isUpDownShake = false;
                })
            }, Laya.Ease['cubicIn'])
        }, Laya.Ease['cubicOut']);

    }

    private lastUpdateScore: number = -1;
    private updateScore(t: number) {
        this.lastUpdateScore += t;
        if (this.lastUpdateScore > 0.3) {
            this.lastUpdateScore = 0;
            gameFrame.gFrame.scoreLbl.text = '' + this.getScore();
        }
        //更新标签的位置
        /*
        CameraController.me.camera.worldToViewportPoint(this.curPos, this.labelPosV);
        this.rankName.x = this.labelPosV.x - 100;
        this.rankName.y = this.labelPosV.y - 120 - OffsetController.me.nowOffsetXY.y;
        */
    }

    public getScore() {
        return ~~(-this.ffcurPos.z);
    }

    //玩家主球不需要显示标签
    private createNameLabel() {

        this.nameMat = new ccMyEnvMaterial;
        this.nameMat.renderMode = ccMyEnvMaterial.RENDEMODE_TRANSPARENT;
        this.nameMat.ffmainColor = new Laya.Vector4(1, 1, 1, 1);
        this.nameMat.ffmainTexture = Laya.Texture2D.load("robot/187.png");
        this.nameMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.nameMat.ffdist = ccDataBus.ffme.ffdist;

        var mesh: Laya.BaseMesh = new Laya.PlaneMesh(1, 1, 1, 1);
        this.name3d = new Laya.MeshSprite3D(mesh);
        this.name3d.meshRender.sharedMaterial = this.nameMat;
        this.name3d.transform.localPosition = new Laya.Vector3(0, 0.8, 0);
        this.name3d.transform.localScale = new Laya.Vector3(this.nameMat.ffmainTexture.width * 0.01, 0.01, this.nameMat.ffmainTexture.height * 0.01);
        this.name3d.transform.localRotationEuler = new Laya.Vector3(90, 0, 0);
        this.ballNode.addChild(this.name3d);
    }

    //撞到障碍物了
    public mmhitBox() {
        if (this.reviveProtected || Game.me.status == GAME_STATE.gameOver) {
            //有时候会碰撞两次，在短时间内，这样就会连续弹出两个 复活ui，是bug
            //为了规避这一问题，当游戏弹出一次时，状态就是gameover，此种情况下不要再弹。
            return;
        }
        this.updateScore(999);
        Game.me.hitBox();
    }
}