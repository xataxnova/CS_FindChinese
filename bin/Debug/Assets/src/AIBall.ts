/*
* name;
*/
enum ccBeyondState {
    ffbeyondPlayer = 0,
    ffbehindPlayer,
}

class ccAIBall {
    ffcurPos: Laya.Vector3;
    ffcurRota: Laya.Vector3;
    ffmoveSpeed: number;//移动速度
    ffminMoveSpeed: number;//最小移动速度
    ffmaxMoveSpeed: number;//最大移动速度

    ffballNode: Laya.Sprite3D;
    ffballMat: ccMyEnvMaterial;
    ffballBody: Laya.MeshSprite3D;
    ffbodyPosY: number;

    ffshadowMat: ccMyEnvMaterial;
    ffshadow3d: Laya.MeshSprite3D;

    ffballid: number;
    ffballTexId: number;
    fflastSpeedAdjustDlt: number;//上一次速度调整的时间差
    // rankName: Laya.Label;//用来记录名次的头顶标签
    ffnameMat: ccMyEnvMaterial;
    ffname3d: Laya.MeshSprite3D;

    ffnowState: ccBeyondState;//表示当前是否超越了玩家
    ffoldState: ccBeyondState;

    ffspeedChangeMethod:Function;

    constructor(ffid, fftexId) {
        this.ffballid = ffid;
        this.ffballTexId = fftexId;

        this.ffmoveSpeed = ccBallController.lowSpeed + (ccBallController.highSpeed - ccBallController.lowSpeed) * Math.random() * 0.2;
        this.ffminMoveSpeed = ccBallController.lowSpeed;
        this.ffmaxMoveSpeed = ccBallController.highSpeed;
        this.ffbodyPosY = 0.32;

        this.fflastSpeedAdjustDlt = 0;

        //根据自己的概率选择一种速度变化策略
        var ffselector:number = Math.random();
        if(ffselector < 0.3){
            this.ffspeedChangeMethod = this.mmspeedStrategyA;
        }else if(ffselector < 0.8){
            this.ffspeedChangeMethod = this.mmspeedStrategyB;
        }else{
            this.ffspeedChangeMethod = this.mmspeedStrategyC;
        }

        // this.rankName = new Laya.Label('' + this.ballid);
        // this.rankName.fontSize = 40;
        // this.labelPosV = new Laya.Vector3();
        // Laya.stage.addChild(this.rankName);

        this.mmcreatePlayer();
        this.mmcreateShadow();
        this.mmupdateView();//创建好以后，如果太远了，也不应该显示

        this.ffnowState = this.ffoldState = ccBeyondState.ffbeyondPlayer;//默认是超越玩家的
        //robot
        Laya.loader.create('audioAvatar/robot/' + this.ffballTexId + '.png', Laya.Handler.create(this, this.mmcreateNameLabel));
    }

    public mmonupdate(fft) {
        if (Game.me.status == GAME_STATE.playing) {
            this.mmmoveBall(fft);
            this.mmrotateBall(fft);
            this.mmadjustSpeed(fft);
            this.mmupdateView();
            this.mmchangeState();
        }
    }

    private mmupdateView() {
        if (this.ffcurPos.z - ccBallController.ffme.ffcurPos.z > 10) {//在玩家球后面20
            this.ffballNode.active = false;
            // this.rankName.visible = false;//标签也要隐藏
        } else if (ccBallController.ffme.ffcurPos.z - this.ffcurPos.z > 30) {//在玩家前面40
            this.ffballNode.active = false;
            // this.rankName.visible = false;
        } else {
            this.ffballNode.active = true;
        }
    }

    private mmmoveBall(t) {
        // debugger
        this.ffcurPos.z -= this.ffmoveSpeed * t;
        this.ffballNode.transform.position = this.ffcurPos;
    }

    private mmrotateBall(t) {
        // debugger
        this.ffcurRota.x = (this.ffcurRota.x + 360 * this.ffmoveSpeed / (2 * 0.3 * 3.14)) % 360; //this.moveSpeed / (2 * 0.6 * 3.14) * 360
        this.ffballBody.transform.localRotationEuler = this.ffcurRota;
    }

    private mmadjustSpeed(t: number) {
        this.fflastSpeedAdjustDlt += t;
        if (this.fflastSpeedAdjustDlt < 1) {//两秒钟调整一次速度
            return;
        }
        this.fflastSpeedAdjustDlt = 0;
        // console.log('@调整速度，两秒了');

        this.ffspeedChangeMethod.bind(this)();

        this.ffmoveSpeed = MathFun.limit(ccBallController.lowSpeed - 20, ccBallController.highSpeed - 3, this.ffmoveSpeed);//限制在合理值范围
    }

    //速度变化策略A(比较容易超越)
    private mmspeedStrategyA() {
        if (this.ffcurPos.z - ccBallController.ffme.ffcurPos.z > 30) {//落后于玩家太多了,逐步加速
            this.ffmoveSpeed = ccBallController.ffme.moveSpeed + 1 * 10;
        } else if (ccBallController.ffme.ffcurPos.z - this.ffcurPos.z > 50) {//超过玩家太多了，肯定会比玩家速度慢，
            this.ffmoveSpeed = ccBallController.ffme.moveSpeed - (1) * 20;
        } else {//齐头并进，跟玩家差不多快，很大概率会减速
            var ffaddSpeed = Math.random() > 0.7 ? 15 : -18;//加速得少（踩一次加速即可超越），减速得多
            this.ffmoveSpeed = ccBallController.ffme.moveSpeed + ffaddSpeed;
        }
    }

    //速度变化策略
    //大约在15名，很容易超越，但是很快会追上来
    private mmspeedStrategyB() {
        if (this.ffcurPos.z - ccBallController.ffme.ffcurPos.z > 30) {//落后于玩家太多了
            if (Math.random() > 0.1) {
                this.ffmoveSpeed = ccBallController.ffme.moveSpeed + 30;
            }
        } else if (ccBallController.ffme.ffcurPos.z - this.ffcurPos.z > 30) {//超过玩家太多了
            if (Math.random() > 0.1) {
                this.ffmoveSpeed = ccBallController.ffme.moveSpeed - (1) * 15;
            }
        } else {//齐头并进，别给玩家压力，尽量减速下来
            var ffaddSpeed = Math.random() > 0.5 ? 10 : -10;//加速得少（踩一次加速即可超越），减速得多
            this.ffmoveSpeed = ccBallController.ffme.moveSpeed + ffaddSpeed;
        }
    }

    //速度变化策略C，比较接近人类
    private mmspeedStrategyC() {
        var ffaddSpeed = Math.random() > 0.5;
        this.ffmoveSpeed = this.ffmoveSpeed + (ffaddSpeed ? 1 : -1) * 25;
        if (ccBallController.ffme.ffcurPos.z - this.ffcurPos.z > 30) {//超过玩家太多了
            if (Math.random() > 0.5) {
                this.ffmoveSpeed = ccBallController.ffme.moveSpeed - (1) * 3;
            }
        }
    }

    public mmdestoryBall(){
        this.ffballNode.removeAllComponent();
        this.ffballNode.removeSelf();

        
    }

    private mmcreatePlayer() {
        //注意，从AI功能考虑，这里的x坐标必须是固定的五个赛道值之一，不能随意，否则判断不准确
        var ffx = ccItemBoxObj.randomX();// Math.random() * 4 - 2;

        var ffrnd = Math.random();
        var ffz = -(Math.pow(this.ffballid / 2, 1.1) * 9);
        this.ffcurPos = new Laya.Vector3(ffx, 0, ffz);

        this.ffballNode = new Laya.Sprite3D;
        ccSceneController.ffme.mmadd2Scene(this.ffballNode);

        var ffballMesh: Laya.BaseMesh = Laya.Mesh.load("audioAvatar/3d/mesh/ball.lm");
        var ffdist: number = ccDataBus.ffme.ffdist;
        var ffqOffset = ccDataBus.ffme.ffqOffset;
        this.ffballMat = new ccMyEnvMaterial;
        this.ffballMat.ffdist = ffdist;
        this.ffballMat.ffqOffset = ffqOffset;
        this.ffballMat.ffmainColor = new Laya.Vector4(1, 1, 1, 1);
        this.ffballMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/ballTex/b" + (this.ffballid % 22 + 1) + ".jpg");

        /*
        var idx = 0;
        Laya.timer.loop(4 * 1000, this, function () {
            idx = (idx + 1) % 28;
            this.ballMat.mainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/newBall/ball" + idx + ".jpg");
        });
        */
        //

        this.ffballBody = new Laya.MeshSprite3D(ffballMesh);
        this.ffballBody.meshRender.sharedMaterial = this.ffballMat;
        this.ffcurRota = new Laya.Vector3(0, 0, 0);
        this.ffballBody.transform.localRotationEuler = this.ffcurRota;//new Laya.Vector3(0, 0, 90);
        this.ffballBody.transform.localScale = new Laya.Vector3(.6, .6, .6);
        this.ffballBody.transform.localRotationEuler = new Laya.Vector3(0, 0, 90);
        this.ffballBody.transform.localPosition = new Laya.Vector3(0, this.ffbodyPosY, 0);

        //添加物理相关组件（可碰撞）
        this.ffballBody.addComponent(Laya.SphereCollider)["radius"] = 0.5;
        this.ffballBody.addComponent(Laya.Rigidbody);//必须有刚体才会碰撞
        this.ffballBody.addComponent(CollisionHandler);

        var ffhandle: CollisionHandler = this.ffballBody.getComponentByType(CollisionHandler) as CollisionHandler;
        ffhandle.mmsetHostObj(this);

        this.ffballBody.layer = Laya.Layer.getLayerByNumber(ITEM_LAYER.BALL_LAYER);
        this.ffballNode.addChild(this.ffballBody);
        this.ffballNode.transform.position = this.ffcurPos;
    }

    private mmcreateShadow() {
        this.ffshadowMat = new ccMyEnvMaterial;
        this.ffshadowMat.renderMode = ccMyEnvMaterial.RENDEMODE_TRANSPARENT;
        this.ffshadowMat.ffmainColor = new Laya.Vector4(1, 1, 1, .5);
        this.ffshadowMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/shadowc.png");
        this.ffshadowMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.ffshadowMat.ffdist = ccDataBus.ffme.ffdist;

        var ffshadowMesh: Laya.BaseMesh = new Laya.PlaneMesh(1, 1, 1, 1);
        this.ffshadow3d = new Laya.MeshSprite3D(ffshadowMesh);
        this.ffshadow3d.meshRender.sharedMaterial = this.ffshadowMat;
        this.ffshadow3d.transform.localScale = new Laya.Vector3(.8, .8, .8);
        this.ffshadow3d.transform.localPosition = new Laya.Vector3(0, 0.06, 0);
        this.ffballNode.addChild(this.ffshadow3d);
    }

    public mmjump() {
        var ffoldY: number = 0;//this.curPos.y;
        // debugger
        var ffthat = this;
        this.ffshadow3d.active = false;
        var jumpTime = 250 + Math.random() * 70;//250~320
        //速度越大，弹得越高！
        var ffdltHigh = Laya.MathUtil.lerp(3.5, 4.5, (this.ffmoveSpeed - this.ffminMoveSpeed) / (this.ffmaxMoveSpeed - this.ffminMoveSpeed));
        ccTween0to1.mmwork(this, function (fft) {

            this.ffcurPos.y = Laya.MathUtil.lerp(ffoldY, ffoldY + ffdltHigh, fft);
            // this.curPos.x += 5;
        }, jumpTime, function () {
            //到达最高点后回落
            var ffmaxY = ffthat.ffcurPos.y;
            ccTween0to1.mmwork(ffthat, function (fft2) {
                ffthat.ffcurPos.y = Laya.MathUtil.lerp(ffmaxY, ffoldY, fft2);
                // that.curPos.x += 5;
            }, jumpTime, function () {//回到地面了
                ffthat.ffshadow3d.active = true;
                ffthat.ffcurPos.y = ffoldY;//that.bodyPosY
            }, Laya.Ease['cubicIn'])
        }, Laya.Ease['cubicOut']);

    }

    public mmreAssignOffset(ffoffset) {
        this.ffballMat.ffqOffset = ffoffset;
        this.ffshadowMat.ffqOffset = ffoffset;
        this.ffnameMat && (this.ffnameMat.ffqOffset = ffoffset);
    }

    public mmaddSpeed() {
        //ai不要加速！追不上了！
        // this.moveSpeed += 5;
    }

    //自动导航
    public mmautoNavi() {
        var ffpoints = Object.keys(ccAIController.ffme.ffnaviPoint).length;
        // console.log('@navi points=', points);
        // debugger
        var ffsafeX = ccAIController.ffme.mmgetSafePointX(this.ffcurPos);

        if (ffsafeX != undefined) {//找到了安全路点
            ccTween0to1.mmwork(this, function (fft) {
                this.ffcurPos.x = Laya.MathUtil.lerp(this.ffcurPos.x, ffsafeX, fft);
                this.ffballNode.transform.position = this.ffcurPos;
            }, 500);

        }
    }

    //显示在玩家头上的昵称标签
    private mmcreateNameLabel() {
        this.ffnameMat = new ccMyEnvMaterial;
        this.ffnameMat.renderMode = ccMyEnvMaterial.RENDEMODE_TRANSPARENT;
        this.ffnameMat.ffmainColor = new Laya.Vector4(1, 1, 1, 1);
        this.ffnameMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/robot/" + this.ffballTexId + ".png");
        this.ffnameMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.ffnameMat.ffdist = ccDataBus.ffme.ffdist;

        var ffmesh: Laya.BaseMesh = new Laya.PlaneMesh(1, 1, 1, 1);
        this.ffname3d = new Laya.MeshSprite3D(ffmesh);
        this.ffname3d.meshRender.sharedMaterial = this.ffnameMat;
        this.ffname3d.transform.localPosition = new Laya.Vector3(0, 0.8, 0);
        this.ffname3d.transform.localScale = new Laya.Vector3(this.ffnameMat.ffmainTexture.width * 0.01, 0.01, this.ffnameMat.ffmainTexture.height * 0.01);
        this.ffname3d.transform.localRotationEuler = new Laya.Vector3(90, 0, 0);
        this.ffballNode.addChild(this.ffname3d);
    }

    private mmchangeState() {
        if (this.ffcurPos.z > ccBallController.ffme.ffcurPos.z && this.ffnowState == ccBeyondState.ffbeyondPlayer) {
            //玩家走的更远，说明被超越了！
            //并且之前状态还是超越玩家，说明刚刚被超越
            this.ffnowState = ccBeyondState.ffbehindPlayer;
            ccBallController.ffme.mmaddBeatsCount(true);
        }

        if (this.ffcurPos.z < ccBallController.ffme.ffcurPos.z && this.ffnowState == ccBeyondState.ffbehindPlayer) {
            //原来是被超越的，并且刚刚变得比玩家远
            //说明刚刚超越了玩家
            this.ffnowState = ccBeyondState.ffbeyondPlayer;
            ccBallController.ffme.mmaddBeatsCount(false);
        }
    }

    //撞到障碍物了
    public mmhitBox(){
        // console.log('@debug: AI hitBox');
    }
}