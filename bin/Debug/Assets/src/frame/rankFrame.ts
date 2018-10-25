import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class rankFrame extends ui.rankUI{
    static rFrame:rankFrame;
    constructor(){
        super();
        rankFrame.rFrame = this;
        
        this.btnBack.on(Laya.Event.CLICK, this, function () {
            OpenContextBridgeA.me.exitDrawShareCanvas();
            this.removeSelf();
        });

        WxController.me.showClub();

        //请求好友排行
        WxController.me.showFriendRanking(SubContextCMD.RequestFriendRanking, this.container);
    }
}
