import { language }from "./Localize/LoadLocalizationFile"
// 程序入口
class Main {
    constructor() {
        new ccSceneController();//这里涉及到laya的初始化，所以要提前建立好

        new ccBallController();
        new ccDataBus();
        new FlowLineController();

        new ResController();

        new TerrainController();
        new BuildingController();

        new CameraController();
        new ItemController();
        new Game();
        new TouchController();
        new OffsetController();

        new ccAIController();
        new AudioController();

        new WxController();

        new HttpController();
        // new UserInfoController();
        // new VersionController();
        new ShareController();

        new OpenContextBridgeA();
        new AdController();
        // Laya.Stat.show(0, 0);

        var callback = function () {
            ResController.me.startLoadRes(Game.me.initGame.bind(Game.me));
        }
        WxController.me.login(callback);
    }
}

new Main();
