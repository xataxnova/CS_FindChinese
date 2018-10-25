import { language }from "./Localize/LoadLocalizationFile"
/*
* 资源加载控制;
*/
class ResController {
    static me: ResController;
    constructor() {
        ResController.me = this;
    }

    //开始加载资源（2d与3d的）
    public startLoadRes(callback) {
        this.load2dRes(this.load3dRes.bind(this, callback));
    }

    //加载2d资源
    private load2dRes(callback) {
        var res2d = [
            'audioAvatar/res/atlas/homeFrame.atlas',
            'audioAvatar/res/atlas/matchFrame.atlas',
            'audioAvatar/res/atlas/gameFrame.atlas',
            'audioAvatar/res/atlas/rankFrame.atlas',
        ];
        Laya.loader.load(res2d, Laya.Handler.create(this, callback));
    }

    //加载3d
    private load3dRes(callback) {
        var res3d = [
            "audioAvatar/3d/mesh/ball.lm",
            "audioAvatar/3d/mesh/speedUp.lm",

            "audioAvatar/3d/textures/shadowc.png",
            "audioAvatar/3d/textures/jump.png",
            "audioAvatar/3d/textures/speedup.png",
            "audioAvatar/3d/textures/box.png",
        ];
        Laya.loader.create(res3d, Laya.Handler.create(this, callback));
    }
}
