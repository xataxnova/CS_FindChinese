import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class WxController {
    static me: WxController;
    private wx: any;
    private retryCount: number;

    private gameClubButton:any;

    constructor() {
        WxController.me = this;
        this.wx = window['wx'];
        this.retryCount = 0;
    }

    public onstart() {
        if (!this.wx) {
            return;
        }
        this.wx.setKeepScreenOn({
            keepScreenOn: true
        })

        this.setupShareMenu();
        this.createGameZone();
        //恢复时
        this.wx.onShow(function () {
            AudioController.me.resumeMusic();
        });

        //隐藏时（比如弹出分享对话框）
        this.wx.onHide(function () {
            AudioController.me.pauseMusic();
        });

        this.wx.onAudioInterruptionBegin(function () {
            AudioController.me.pauseMusic();
        });
        this.wx.onAudioInterruptionEnd(function () {
            AudioController.me.resumeMusic();
        });
    }

    //初始化分享（右上角）
    private setupShareMenu() {
        if (!this.wx) {
            return;
        }
        this.wx.showShareMenu({ withShareTicket: true });
        this.wx.onShareAppMessage(function () {
            var shareInfo: ShareInfo = ShareController.me.getOneShareInfo();
            return {
                title: shareInfo.desctxt,
                imageUrl: shareInfo.img
            }
        });
    }

    public login(callback) {
        this.retryCount = 0;
        this.loginCore(callback);
    }

    private createGameZone() {
        var that = this;
        this.gameClubButton = this.wx.createGameClubButton({
            icon: 'green',
            style: {
                left: that.wx.getSystemInfoSync().screenWidth - 50,
                top: that.wx.getSystemInfoSync().screenHeight * 0.5 + 100,
                width: 50,
                height: 50
            }
        })
        this.gameClubButton.hide();
    }

    public showClub(){
        if (!this.wx) {
            return;
        }
        this.gameClubButton.show();
    }

    public hideClub(){
        if (!this.wx) {
            return;
        }
        this.gameClubButton.hide();
    }

    private loginCore(callback) {
        if (!this.wx) {
            callback();
            return;
        }

        var that = this;
        this.wx.login({
            success: function (data) {
                //data.code
                ShareController.me.getShareData(callback);
                // UserInfoController.me.wxcode = data.code;
                // UserInfoController.me.code2Session(callback);
            },
            fail: function () {
                this.retryCount++;
                if (this.retryCount > 3) {//超时三次
                    that.wx.showModal({
                        title:  language["8"] ,
                        content:  language["9"] ,
                        cancelText:  language["10"] ,
                        confirmText:  language["11"] ,
                        success: (res) => {
                            if (res.confirm) {
                                //重试
                                that.login(callback);
                            } else if (res.cancel) {
                                //取消
                                that.login(callback);
                            }
                        }//success
                    });
                }
            }

        });
    }

    public share() {
        if (!this.wx) {
            return;
        }

        var shareInfo: ShareInfo = ShareController.me.getOneShareInfo();
        this.wx.shareAppMessage({
            title: shareInfo.desctxt,
            imageUrl: shareInfo.img
        });
    }

    public showToast(text: string) {
        if (!this.wx) {
            return;
        }
        this.wx.showToast({
            title: text,
            icon: 'none',
            duration: 1000
        });
    }

    //强制分享群
    //这个方法10月10号以后已经无效
    /*
    public shareToGroup(whenSuccess) {
        if (!this.wx) {
            return;
        }
        var me = this;
        var shareInfo: ShareInfo = ShareController.me.getOneShareInfo();
        this.wx.shareAppMessage({
            title: shareInfo.desctxt,
            imageUrl: shareInfo.img,
            // query: 'shareid=' + shareInfo.imgID + "&share_openid=" + DataMgr.me.userInfo.openid,
            success: function (result) {
                console.log('@shareAppMessage.success:' + JSON.stringify(result));
                if (result && result.shareTickets) {
                    var ticket = result.shareTickets[0];
                    console.log('ticket=', ticket);
                    me.wx.getShareInfo({
                        shareTicket: ticket,
                        success: function (res) {
                            var p1 = res.encryptedData;
                            var p2 = res.iv;
                            var p3 = UserInfoController.me.session_key;

                            HttpController.me.simplePost(HttpController.baseURL + HttpController.ticketParseURL, {
                                openkey: p3,
                                encryptedData: p1,
                                iv: p2,
                                gameName: UserInfoController.gameName,
                                openidMd5: UserInfoController.me.openidMd5
                            }, function (ret) {
                                // console.log(JSON.stringify(ret));
                                if (ret.Status == 200) {
                                    whenSuccess();
                                } else {
                                    if (VersionController.me.IS_FORCE_GROUP) {//必须强制分享（同一群要间隔一定时间）
                                        var errMsg = ret.ErrMsg;
                                        console.log('操作无效' + errMsg);
                                        // me.showToast('操作无效' + errMsg);
                                    } else {
                                        whenSuccess();
                                    }

                                }//if/else
                            })
                        }
                    })
                } else {
                    //没有shareTickets，这个估计不是群，分享是否有效看配置
                    console.log('这个不是群');
                    if (VersionController.me.IS_FORCE_GROUP) {//必须强制分享群的
                        // me.showToast('操作无效');
                        console.log('操作无效');
                    } else {
                        //不必强制分享到群
                        whenSuccess();
                    }

                }
            }//success
        })
    }
    */


    //显示好友排行榜（需要子域配合了）
    public showFriendRanking(cmd: SubContextCMD, container: Laya.Sprite) {
        if (!this.wx) {
            return;
        }
        var retryFun = arguments.callee.bind(this, cmd, container);

        var that = this;
        var onloading = function () {
            that.wx.showLoading({
                mask: true
            });
        }
        var ontimeoutF = function () {
            that.wx.hideLoading({});
            that.wx.showModal({
                title:  language["12"] ,
                content:  language["13"] ,
                cancelText:  language["14"] ,
                confirmText:  language["15"] ,
                success: (res) => {
                    if (res.confirm) {
                        //重试
                        retryFun();
                    } else if (res.cancel) {
                        //取消
                    }
                }//success
            });
        }
        var oncompleteF = function () {
            that.wx.hideLoading({});
        }
        OpenContextBridgeA.me.requestDrawPage(cmd, onloading, ontimeoutF, oncompleteF, container, 0, 0);
    }



    public sendMyScoreToWX(score: number) {
        if (window['wx']) {
            this.wx.setUserCloudStorage({
                KVDataList: [
                    {
                        key: OpenContextBridgeA.SCORE_KEY,
                        value: '' + score
                    }
                ],
                fail: function (res) {
                    console.log("sendMyScoreToWX fail", res);
                }
            });
        }
    }

    /*
    public gotoMiniProgrom(data:any){
        if (!this.wx || VersionController.LinkAppId=="") {
            return;
        }
        this.wx.navigateToMiniProgram({
            appId:VersionController.LinkAppId,
            extraData:data
        });
    }
    */
}
