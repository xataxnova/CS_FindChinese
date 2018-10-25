import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class ccSceneController {
    static ffme: ccSceneController;
    constructor() {
        ccSceneController.ffme = this;
        laya.wx.mini.MiniAdpter.init(true, false);
        Laya3D.init(640, 1136, true);
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.alignH = 'center';
        Laya.stage.alignV = 'center';
        Laya.stage.bgColor = "#000000";

        this.resetScreenHeight();

        ccMyEnvMaterial.initShader();
        MyGlitterMaterial.initShader();
        Laya.ShaderCompile3D.debugMode = false;
    }

    scene: Laya.Scene;
    private createScene() {
        this.scene = new Laya.Scene();
        Laya.stage.addChild(this.scene);
    }

    public mmadd2Scene(obj: Laya.Sprite3D) {
        this.scene.addChild(obj);
    }

    public onstart() {
        this.createScene();
    }

    public onupdate() { }

    public onreset(){}

    private resetScreenHeight() {
        var oldFun = laya.ui.View.prototype['createView'];//一种hack技巧，先把旧函数取出来
        var targetHeight = this.computedRealHeight();
        var re = new RegExp("" + 1136, "g");
        var newFun = function (uiView) {
            //新函数会把传入的uiView中敏感值全部替换掉
            var obj2string: string = JSON.stringify(uiView);
            // Logger.dd.debug('uiview before=%s', obj2string);
            obj2string = obj2string.replace(re, '' + targetHeight);
            // Logger.dd.debug('uiview after=%s', obj2string);
            var newUiView = JSON.parse(obj2string);
            oldFun.call(this, newUiView);
        }
        laya.ui.View.prototype['createView'] = newFun;//再把新函数替换回去
    }

    private computedRealHeight(): number {
        //比率 = 物理宽 / 设计宽
        var scaleRatio: number;
        var scaleRatio1: number = Laya.Browser.width / 640;
        scaleRatio = scaleRatio1;
        //所以，为了保证等比缩放，
        //物理高 / 设计高 应该等于比率
        //于是 设计高应当被替换为 物理高 / 比率 , 不再是1136
        return Math.round(Laya.Browser.height / scaleRatio);
    }

    public isIphoneX():boolean{
        return Laya.Browser.height / Laya.Browser.width > 2.0;
    }
}
