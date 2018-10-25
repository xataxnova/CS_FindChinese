import { language }from "./Localize/LoadLocalizationFile"
/*
* 地形控制
*/
class TerrainController {
    static me: TerrainController;

    roadAColor: Laya.Vector4;
    roadAColors: Array<Laya.Vector4>;
    roadAMaterial: ccMyEnvMaterial;//A路块的材质

    roadBColor: Laya.Vector4;
    roadBColors: Array<Laya.Vector4>;
    roadBMaterial: ccMyEnvMaterial;//B路块

    roadSpanZDis: number;//应该是一个路块的宽度
    roadCount: number;//路块预设的数量
    roadsPrefab: Array<Laya.MeshSprite3D>;
    roadSpanZ: number;
    spanZDis: number;//一次会生成这么长的距离
    roadsIndex: number;

    constructor() {
        TerrainController.me = this;

        this.roadCount = 60;
        this.roadSpanZDis = 3;//单个路块的宽度
        this.roadsPrefab = new Array<Laya.MeshSprite3D>();
        this.roadSpanZ = 6;//6
        this.spanZDis = 110;//90;55;最近铺到多远
        this.roadsIndex = 0;//记录循环中处理的路块

        this.roadAColor = new Laya.Vector4;
        this.roadAColors = [
            new Laya.Vector4(65 / 255, 105 / 255, 225 / 255, 1),
            new Laya.Vector4(0 / 255, 205 / 255, 0 / 255, 1),
            new Laya.Vector4(205 / 255, 198 / 255, 115 / 255, 1),
            new Laya.Vector4(102 / 255, 205 / 255, 170 / 255, 1),
            new Laya.Vector4(205 / 255, 155 / 255, 29 / 255, 1),
            new Laya.Vector4(205 / 255, 133 / 255, 63 / 255, 1),
            new Laya.Vector4(205 / 255, 170 / 255, 125 / 255, 1),
            new Laya.Vector4(205 / 255, 51 / 255, 51 / 255, 1),
            new Laya.Vector4(205 / 255, 198 / 255, 115 / 255, 1)
        ];

        this.roadBColor = new Laya.Vector4;
        this.roadBColors = [
            new Laya.Vector4(72 / 255, 61 / 255, 139 / 255, 1),
            new Laya.Vector4(0 / 255, 139 / 255, 0 / 255, 1),
            new Laya.Vector4(139 / 255, 134 / 255, 78 / 255, 1),
            new Laya.Vector4(127 / 255, 255 / 255, 212 / 255, 1),
            new Laya.Vector4(139 / 255, 105 / 255, 20 / 255, 1),
            new Laya.Vector4(222 / 255, 184 / 255, 135 / 255, 1),
            new Laya.Vector4(255 / 255, 231 / 255, 186 / 255, 1),
            new Laya.Vector4(139 / 255, 35 / 255, 35 / 255, 1),
            new Laya.Vector4(139 / 255, 134 / 255, 78 / 255, 1)
        ]

    }

    public onstart() {
        this.genPrefabs();
    }

    public onupdate(t: number) {
        // this.updateStaticObject();
        // this.updateStaticObject();
        this.updateStaticObject();
        // console.log('@__roadSpanZ=', this.roadSpanZ);
    }

    public onreset() {
        this.roadSpanZ = 16;//6
        this.roadsIndex = 0;//记录循环中处理的路块
    }


    public changeColor(t: number) {
        var fogColor: Laya.Vector3 = ccDataBus.ffme.fogColor;
        this.roadAMaterial.fogColor = fogColor;
        this.roadBMaterial.fogColor = fogColor;

        Laya.Vector4.lerp(this.roadAColor, this.roadAColors[ccDataBus.ffme.colorIndex], t, this.roadAColor);
        Laya.Vector4.lerp(this.roadBColor, this.roadBColors[ccDataBus.ffme.colorIndex], t, this.roadBColor);

        this.roadAMaterial.ffmainColor = this.roadAColor;
        this.roadBMaterial.ffmainColor = this.roadBColor;
    }

    //更新道路，建筑
    private updateStaticObject() {
        while (ccBallController.ffme.ffcurPos.z - this.roadSpanZ < this.spanZDis) {
            //到了一组间隔，可以生成障碍物了
            this.roadsPrefab[this.roadsIndex].active = true;
            this.roadsPrefab[this.roadsIndex].transform.position = new Laya.Vector3(0, 0, this.roadSpanZ);
            this.roadSpanZ -= this.roadSpanZDis;
            // this.roadSteps++;
            if (this.roadsIndex >= (this.roadCount - 1)) {
                this.roadsIndex = 0;
                // debugger
            } else {
                this.roadsIndex++;
            }
        }
    }

    //生成各种物件
    private genPrefabs() {
        var tmpSprite3d: Laya.Sprite3D = new Laya.Sprite3D();
        ccSceneController.ffme.mmadd2Scene(tmpSprite3d);

        var dist: number = ccDataBus.ffme.ffdist;
        var qOffset: Laya.Vector4 = ccDataBus.ffme.ffqOffset;
        var sceneIndex: number = ccDataBus.ffme.colorIndex;
        var fogStart: number = ccDataBus.ffme.fogStart;
        var fogStartD: number = ccDataBus.ffme.fogStartD;
        var fogRange: number = ccDataBus.ffme.fogRange;
        var fogRangeD: number = ccDataBus.ffme.fogRangeD;

        var fogColor: Laya.Vector3 = ccDataBus.ffme.fogColor;

        this.roadAColors[sceneIndex].cloneTo(this.roadAColor);
        this.roadAMaterial = new ccMyEnvMaterial;
        this.roadAMaterial.ffqOffset = qOffset;
        this.roadAMaterial.ffdist = dist;
        this.roadAMaterial.ffmainColor = this.roadAColor;
        this.roadAMaterial.enableFog = false;
        this.roadAMaterial.fogColor = fogColor;
        this.roadAMaterial.fogStart = fogStart;
        this.roadAMaterial.fogRange = fogRange;

        this.roadBColors[sceneIndex].cloneTo(this.roadBColor);
        this.roadBMaterial = new ccMyEnvMaterial;
        this.roadBMaterial.ffqOffset = qOffset;
        this.roadBMaterial.ffdist = dist;
        this.roadBMaterial.ffmainColor = this.roadBColor;
        this.roadBMaterial.enableFog = false;
        this.roadBMaterial.fogColor = fogColor;
        this.roadBMaterial.fogStart = fogStart;
        this.roadBMaterial.fogRange = fogRange;

        var roadMesh = new Laya.PlaneMesh(1, 1, 1, 1);
        var boxElement = new Laya.BoxMesh(1, 1, 1);
        var roadScale: Laya.Vector3 = new Laya.Vector3(5, 1, this.roadSpanZDis);
        for (var i = 0; i < this.roadCount; i++) {
            var round3d: Laya.MeshSprite3D = new Laya.MeshSprite3D(roadMesh);
            i % 2 == 0 ? (round3d.meshRender.sharedMaterial = this.roadAMaterial) : (round3d.meshRender.sharedMaterial = this.roadBMaterial);
            round3d.transform.localScale = roadScale;
            round3d.active = !false;//luo false
            tmpSprite3d.addChild(round3d);
            this.roadsPrefab.push(round3d);
        }

    }
}
