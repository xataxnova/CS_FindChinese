import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class ShareInfo {
    public img: string;
    public desctxt: string;
}
class ShareController {
    static me: ShareController
    private allShareInfo: Array<ShareInfo>;
    private currentShareInfoIndex: number;
    constructor() {
        ShareController.me = this;
        this.allShareInfo = new Array<ShareInfo>();
    }

    //启动时获取 分享数据集合
    public getShareData(callback) {
        var that = this;

        var shareInfo: ShareInfo = new ShareInfo();
        shareInfo.img = "./share.png";
        shareInfo.desctxt =  language["7"] ;
        that.allShareInfo.push(shareInfo);
        that.currentShareInfoIndex = (~~(Math.random() * 100)) % that.allShareInfo.length;
        callback();

        /*
                HttpController.me.simplePost(HttpController.baseURL + HttpController.getShareDataURL,
                    { "GameName": UserInfoController.gameName }, function (data) {
                        for(var k in data){
                            var shareInfo:ShareInfo = new ShareInfo();
                            shareInfo.img = data[k]['Img'];
                            shareInfo.desctxt = data[k]['Desctxt'];
                            that.allShareInfo.push(shareInfo);
                        }
                        that.currentShareInfoIndex = (~~(Math.random() * 100)) % that.allShareInfo.length;
                        callback();
                    })
        */
    }

    //获取下一个分享图信息
    public getOneShareInfo(): ShareInfo {
        this.currentShareInfoIndex = (this.currentShareInfoIndex + 1) % this.allShareInfo.length;
        return this.allShareInfo[this.currentShareInfoIndex];
    }
}
