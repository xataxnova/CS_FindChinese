import { language }from "./Localize/LoadLocalizationFile"
/*
* 道具管理（加速器，跳台，障碍物等等）
*/
class ItemController {
    static me: ItemController;

    speedUpMat: ccMyEnvMaterial;
    speedUpCount: number;//预设加速器的数量
    speedUpPrefabs: Array<ItemBase>;

    createSpeedUpDis: number;
    createSpeedUpConstantDis: number;
    speedUpItemIndex: number = 0;

    boxMat: ccMyEnvMaterial;//盒子对象的材质
    boxCount: number;
    boxPrefabs: Array<ItemBase>;
    boxIndex: number = 0;

    jumpMat: ccMyEnvMaterial;//跳台的材质
    jumpCount: number;
    jumpIndex: number = 0;
    jumpPrefabs: Array<ItemBase>;

    constructor() {
        ItemController.me = this;
        this.speedUpCount = 5;

        this.speedUpPrefabs = new Array<ItemBase>();
        this.createSpeedUpConstantDis = 55;
        this.createSpeedUpDis = this.createSpeedUpConstantDis;

        this.boxCount = 30;//盒子预设数量
        this.boxPrefabs = new Array<ItemBase>();

        this.jumpCount = 10;
        this.jumpPrefabs = new Array<ItemBase>();
    }

    public onstart() {
        this.loadSpeedItemPrefabs();
        this.loadBoxPrefabs();
        this.loadJumpPrefabs();

        this.setupCollision();
    }

    //设置碰撞关系
    private setupCollision() {
        var ballLayer = Laya.Layer.getLayerByNumber(ITEM_LAYER.BALL_LAYER);
        var speedLayer = Laya.Layer.getLayerByNumber(ITEM_LAYER.SPEED_LAYER);
        var boxLayer = Laya.Layer.getLayerByNumber(ITEM_LAYER.BOX_LAYER);
        var jumpLayer = Laya.Layer.getLayerByNumber(ITEM_LAYER.JUMP_LAYER);

        Laya.Physics.setLayerCollision(ballLayer, ballLayer, false);
        Laya.Physics.setLayerCollision(ballLayer, speedLayer, true);
        Laya.Physics.setLayerCollision(ballLayer, boxLayer, true);
        Laya.Physics.setLayerCollision(ballLayer, jumpLayer, true);
    }

    public onupdate(dlt: number) {
        if (Game.me.status != GAME_STATE.playing) {
            return;
        }
        this.createItem();

        //判断回收
        for (var k in this.speedUpPrefabs) {
            var prefab: ItemBase = this.speedUpPrefabs[k];
            prefab.update();
        }

        for (var k in this.boxPrefabs) {
            var prefab: ItemBase = this.boxPrefabs[k];
            prefab.update();
        }

        for (var k in this.jumpPrefabs) {
            var prefab: ItemBase = this.jumpPrefabs[k];
            prefab.update();
        }
    }//onupdate

    public onreset() {
        this.createSpeedUpConstantDis = 60;
        this.createSpeedUpDis = this.createSpeedUpConstantDis;

        for (var k in this.speedUpPrefabs) {
            var prefab: ItemBase = this.speedUpPrefabs[k];
            prefab.active = false;
        }

        for (var k in this.boxPrefabs) {
            var prefab: ItemBase = this.boxPrefabs[k];
            prefab.active = false;
            prefab.canMove = false;//这里避免一些移动方块下次出来仍旧移动
        }

        for (var k in this.jumpPrefabs) {
            var prefab: ItemBase = this.jumpPrefabs[k];
            prefab.active = false;
        }
    }

    private loadSpeedItemPrefabs() {
        var tmpSprite3d: Laya.Sprite3D = new Laya.Sprite3D();
        ccSceneController.ffme.mmadd2Scene(tmpSprite3d);

        this.speedUpMat = new ccMyEnvMaterial;
        this.speedUpMat.renderMode = ccMyEnvMaterial.RENDEMODE_TRANSPARENT;
        this.speedUpMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.speedUpMat.ffdist = ccDataBus.ffme.ffdist;
        this.speedUpMat.ffmainColor = new Laya.Vector4(1, 1, 0, 1);
        this.speedUpMat.enableFog = false;
        this.speedUpMat.fogColor = ccDataBus.ffme.fogColor;
        this.speedUpMat.fogStart = ccDataBus.ffme.fogStart;
        this.speedUpMat.fogRange = ccDataBus.ffme.fogRange;

        var speedItemMesh: Laya.Mesh = Laya.Mesh.load("audioAvatar/3d/mesh/speedUp.lm");
        var scaleV = new Laya.Vector3(1, 1.2, .3);
        var rotationV = new Laya.Vector3(-90, 0, 0);
        for (var c = 0; c < this.speedUpCount; c++) {
            var speed3d: ItemBase = new ItemBase(speedItemMesh, '' + COLLIDER_NAME.SPEED);
            speed3d.meshRender.sharedMaterial = this.speedUpMat;
            speed3d.transform.localScale = scaleV;
            speed3d.transform.localRotationEuler = rotationV;
            speed3d.active = false;
            speed3d.layer = Laya.Layer.getLayerByNumber(ITEM_LAYER.SPEED_LAYER);//加速器的物理层是1

            tmpSprite3d.addChild(speed3d);

            var boxCollider: Laya.BoxCollider = speed3d.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
            boxCollider.size = new Laya.Vector3(1, 1, 1.5 * 4);
            boxCollider.enable = false;
            this.speedUpPrefabs.push(speed3d);
        }
    }

    //载入各个单盒子组件
    private loadBoxPrefabs() {
        var tmpSprite3d: Laya.Sprite3D = new Laya.Sprite3D();
        ccSceneController.ffme.mmadd2Scene(tmpSprite3d);

        this.boxMat = new ccMyEnvMaterial;
        this.boxMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.boxMat.ffdist = ccDataBus.ffme.ffdist;
        this.boxMat.ffmainColor = new Laya.Vector4(1, 1, 0, 1);
        this.boxMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/box.png");
        this.boxMat.enableFog = false;
        this.boxMat.fogColor = ccDataBus.ffme.fogColor;
        this.boxMat.fogStart = ccDataBus.ffme.fogStart;
        this.boxMat.fogRange = ccDataBus.ffme.fogRange;
        for (var c = 0; c < this.boxCount; c++) {
            var box3d: ItemBase = new ItemBase(new Laya.BoxMesh(1, 1, 1), '' + COLLIDER_NAME.BOX);
            box3d.meshRender.sharedMaterial = this.boxMat;
            box3d.active = false;
            tmpSprite3d.addChild(box3d);
            box3d.layer = Laya.Layer.getLayerByNumber(ITEM_LAYER.BOX_LAYER);//盒子障碍物的物理层是1
            var collider = box3d.addComponent(Laya.BoxCollider);
            (collider as Laya.BoxCollider).size = new Laya.Vector3(1, 1, 1 * 4);
            collider.enable = false;
            this.boxPrefabs.push(box3d);
        }//for
    }

    //载入跳台资源
    private loadJumpPrefabs() {
        var tmpSprite3d: Laya.Sprite3D = new Laya.Sprite3D();
        ccSceneController.ffme.mmadd2Scene(tmpSprite3d);

        this.jumpMat = new ccMyEnvMaterial;
        this.jumpMat.ffqOffset = ccDataBus.ffme.ffqOffset;
        this.jumpMat.ffdist = ccDataBus.ffme.ffdist;
        this.jumpMat.ffmainColor = new Laya.Vector4(1, 1, 0, 1);;
        this.jumpMat.ffmainTexture = Laya.Texture2D.load("audioAvatar/3d/textures/jump.png");
        this.jumpMat.enableFog = false;
        this.jumpMat.fogColor = ccDataBus.ffme.fogColor;
        this.jumpMat.fogStart = ccDataBus.ffme.fogStart;
        this.jumpMat.fogRange = ccDataBus.ffme.fogRange;

        var jumpXYZ: Laya.Vector3 = new Laya.Vector3(1, 1, Math.SQRT2);
        var jumpRota: Laya.Vector3 = new Laya.Vector3(45, 0, 0);
        for (var c = 0; c < this.jumpCount; c++) {
            // var jump3d: Laya.Sprite3D = new Laya.Sprite3D("jump");
            var jump3d: ItemBase = new ItemBase(new Laya.PlaneMesh(1, 1, 1, 1), '' + COLLIDER_NAME.JUMP);
            tmpSprite3d.addChild(jump3d);

            jump3d.meshRender.sharedMaterial = this.jumpMat;
            jump3d.transform.localScale = jumpXYZ;
            jump3d.transform.localRotationEuler = jumpRota;
            jump3d.active = false;
            jump3d.layer = Laya.Layer.getLayerByNumber(ITEM_LAYER.JUMP_LAYER);//jump台的物理层是1
            var collider = jump3d.addComponent(Laya.BoxCollider);
            (collider as Laya.BoxCollider).size = new Laya.Vector3(1, 1, 1 * 4);
            collider.enable = false;
            this.jumpPrefabs.push(jump3d);
        }//for
    }

    //正经创建道具
    private createItem() {
        this.createSpeedUpDis -= 1.5;//1.5;
        this.boxMat.ffmainColor = TerrainController.me.roadAColor;
        // this.speedUpMat.mainColor = TerrainController.me.roadAColor;
        this.jumpMat.ffmainColor = TerrainController.me.roadBColor;

        if (this.createSpeedUpDis < 0) {
            var possible = ~~(Math.random() * 100) % 13;
            // possible = 10;
            switch (possible) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.genASpeedItem(); break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    this.genABoxs(); break;
                case 11:
                case 12:
                    this.genAJump(); break;
            }
            // this.genABoxs();
            this.createSpeedUpDis = this.createSpeedUpConstantDis;

            ccAIController.ffme.autoNavi();
        }

    }

    //选出一个box，可能用于后续组合
    public pickupABox(): ItemBase {
        var boxItem: ItemBase = ItemController.me.boxPrefabs[ItemController.me.boxIndex];
        ItemController.me.boxIndex++;
        if (ItemController.me.boxIndex >= ItemController.me.boxCount) {
            ItemController.me.boxIndex = 0;
        }
        return boxItem;
    }

    //选出一个跳台
    public pickupAJump(): ItemBase {
        var jumpItem: ItemBase = ItemController.me.jumpPrefabs[ItemController.me.jumpIndex];
        ItemController.me.jumpIndex++;
        if (ItemController.me.jumpIndex >= ItemController.me.jumpCount) {
            ItemController.me.jumpIndex = 0;
        }
        return jumpItem;
    }

    //选出一个加速器
    public pickupSpeed(): ItemBase {
        var speedItem: ItemBase = ItemController.me.speedUpPrefabs[ItemController.me.speedUpItemIndex];
        ItemController.me.speedUpItemIndex++;
        if (ItemController.me.speedUpItemIndex >= ItemController.me.speedUpCount) {
            ItemController.me.speedUpItemIndex = 0;
        }
        return speedItem;
    }

    private genASpeedItem() {
        new ItemSpeedObj();
    }

    private genABoxs() {
        new ccItemBoxObj();
    }

    private genAJump() {
        new ItemJumpObj();
    }

    //hide方法负责active=false，它会不断循环看是否可以回收（触发标准无非是距离太大）
}

//物理碰撞层的代号
enum ITEM_LAYER {
    BALL_LAYER = 0,
    SPEED_LAYER,
    BOX_LAYER,
    JUMP_LAYER,
}

//碰撞组件的别名（用于碰撞处理的身份识别）
enum COLLIDER_NAME {
    SPEED = 0,
    BOX,
    JUMP,
    BALL,
}
