/*
* 楼宇控制
*/
class BuildingController {
    static me: BuildingController;

    buildingColor: Laya.Vector4;
    buildingColors: Array<Laya.Vector4>;
    buildingMaterial: ccMyEnvMaterial;//建筑材质

    buildingCount: number;//建筑预设的数量
    buildingsPrefab: Array<Laya.MeshSprite3D>;

    buildingLSpanZ: number;//左侧道路生成的间隔
    buildingRSpanZ: number;//右侧道路生成间隔

    spanZDis: number;//超过这个距离就要再度生成楼宇
    buildingsIndex: number;//当前正在处理处理的元素索引

    buildingScaleYMin;//最矮
    buildingScaleYMax;//最高楼宇

    buildScaleXZ: number;//长宽值
    buildingSpanZDis: number;//一个建筑的间隔

    constructor() {
        BuildingController.me = this;

        this.buildingColors = [
            new Laya.Vector4(0 / 255, 100 / 255, 0 / 255, 1),
            new Laya.Vector4(85 / 255, 107 / 255, 47 / 255, 1),
            new Laya.Vector4(24 / 255, 116 / 255, 205 / 255, 1),
            new Laya.Vector4(0 / 255, 139 / 255, 139 / 255, 1),
            new Laya.Vector4(139 / 255, 105 / 255, 20 / 255, 1),
            new Laya.Vector4(0 / 255, 0 / 255, 0 / 255, 1),
            new Laya.Vector4(139 / 255, 126 / 255, 102 / 255, 1),
            new Laya.Vector4(139 / 255, 137 / 255, 112 / 255, 1),
            new Laya.Vector4(24 / 255, 116 / 255, 205 / 255, 1)
        ];
        this.buildingColor = new Laya.Vector4;

        this.buildingCount = 15;
        this.buildingsPrefab = new Array<Laya.MeshSprite3D>();

        this.buildingLSpanZ = 5;
        this.buildingRSpanZ = 1;
        this.buildingsIndex = 0;

        this.buildingScaleYMin = 5;
        this.buildingScaleYMax = 24;

        this.buildScaleXZ = 5;
        this.buildingSpanZDis = 10;//一个建筑的间隔

        this.spanZDis = 80;//55; 一次生成这么长一段
    }

    public onstart() {
        this.genPrefabs();
    }

    public onupdate(t: number) {
        if (ccBallController.ffme.ffcurPos.z - this.buildingLSpanZ < this.spanZDis) {
            var buildingPrefab: Laya.MeshSprite3D = this.buildingsPrefab[this.buildingsIndex];
            var buildHeight: number = Math.random() * (this.buildingScaleYMax - this.buildingScaleYMin) + this.buildingScaleYMin;//找一个最高和最低之间的高度
            buildingPrefab.active = true;
            buildingPrefab.transform.localScale = new Laya.Vector3(this.buildScaleXZ, buildHeight, this.buildScaleXZ);
            buildingPrefab.transform.position = new Laya.Vector3(-7, .5 * buildHeight - 4, this.buildingLSpanZ);
            this.buildingLSpanZ -= this.buildingSpanZDis;

            if (this.buildingsIndex >= (this.buildingCount - 1)) {
                this.buildingsIndex = 0;
            } else {
                this.buildingsIndex++;
            }
        }//left 

        if (ccBallController.ffme.ffcurPos.z - this.buildingRSpanZ < this.spanZDis) {
            var buildingPrefab: Laya.MeshSprite3D = this.buildingsPrefab[this.buildingsIndex];
            var i: number = Math.random() * (this.buildingScaleYMax - this.buildingScaleYMin) + this.buildingScaleYMin;
            buildingPrefab.active = true;
            buildingPrefab.transform.localScale = new Laya.Vector3(this.buildScaleXZ, i, this.buildScaleXZ);
            buildingPrefab.transform.position = new Laya.Vector3(7, .5 * i - 10, this.buildingRSpanZ);
            this.buildingRSpanZ -= this.buildingSpanZDis;
            if (this.buildingsIndex >= (this.buildingCount - 1)) {
                this.buildingsIndex = 0;
            } else {
                this.buildingsIndex++;
            }//if
        }//right
    }

    public changeShaderOffset(t: number) {
        //
        var offset = new Laya.Vector4(30, 0, 0, 0);
        this.buildingMaterial.ffqOffset = offset;
    }

    public changeColor(t: number) {
        var fogColor: Laya.Vector3 = ccDataBus.ffme.fogColor;
        var colorIndex: number = ccDataBus.ffme.colorIndex;
        Laya.Vector4.lerp(this.buildingColor, this.buildingColors[colorIndex], t, this.buildingColor)
        this.buildingMaterial.ffmainColor = this.buildingColor;
        this.buildingMaterial.fogColor = fogColor;
    }

    public onreset() {
        this.buildingLSpanZ = 5;
        this.buildingRSpanZ = 1;
        this.buildingsIndex = 0;

        this.buildingScaleYMin = 5;
        this.buildingScaleYMax = 24;

        this.buildScaleXZ = 5;
        this.buildingSpanZDis = 10;

        this.spanZDis = 80;
    }

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

        //建筑物的颜色
        this.buildingColors[sceneIndex].cloneTo(this.buildingColor);

        //建筑物的材质
        this.buildingMaterial = new ccMyEnvMaterial;
        this.buildingMaterial.ffqOffset = qOffset;
        this.buildingMaterial.ffdist = dist;
        this.buildingMaterial.ffmainColor = this.buildingColor;
        this.buildingMaterial.enableFog = true;//true
        this.buildingMaterial.fogColor = fogColor;
        this.buildingMaterial.fogStart = fogStart;
        this.buildingMaterial.fogRange = fogRange;
        this.buildingMaterial.enabledDepthFog = true;
        this.buildingMaterial.fogStartD = fogStartD;
        this.buildingMaterial.fogRangeD = fogRangeD;

        var buildMesh = new Laya.BoxMesh(1, 1, 1);
        for (var i = 0; i < this.buildingCount; i++) {
            var build3d: Laya.MeshSprite3D = new Laya.MeshSprite3D(buildMesh);
            build3d.meshRender.sharedMaterial = this.buildingMaterial;
            build3d.active = false;
            tmpSprite3d.addChild(build3d);
            this.buildingsPrefab.push(build3d);
        }
    }
}