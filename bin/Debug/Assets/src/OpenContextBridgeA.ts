import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
enum SubContextCMD {
    Init = 0,
    RequestFriendRanking,//获取好友排行榜
    RequestTop3,
};

class OpenContextBridgeA{
    static me: OpenContextBridgeA;
    static SCORE_KEY: string = 'running_ball_history_max';
    openDataContext: any;
    shareCanvasTex: Laya.Texture;
    constructor(){
        OpenContextBridgeA.me = this;
        this.setupOpenContext();//初始化
    }

    private setupOpenContext() {
        if (!window['wx']) {
            return;
            // throw Error('not wx env!');
        }
        // this.sharedCanvas = laya.utils.Browser.window.sharedCanvas;//用于获取离屏数据
        this.openDataContext = window['wx'].getOpenDataContext();//和子域通信的本质承担者
        // debugger
        this.setShareCanvasSize(640, 1136);
    }

    private setShareCanvasSize(width: number, height: number) {
        laya.utils.Browser.window.sharedCanvas.width = width;
        laya.utils.Browser.window.sharedCanvas.height = height;
        this.callFunctionInSubContext(SubContextCMD.Init, {
            width: width,
            height: height,
            matrix: Laya.stage._canvasTransform
        });
    }

    //调用子域中的功能函数（发起请求或者传送数据）
    public callFunctionInSubContext(cmd: SubContextCMD, data: Object) {
        this.openDataContext.postMessage({
            cmd: cmd,
            data: data
        });
    }

    //////////////
    public requestDrawPage(cmd: SubContextCMD, onLoading: Function, onTimeoutF: Function, onComplete: Function, parentSprite: Laya.Sprite, x: number, y: number) {
        this.setShareCanvasSize(parentSprite.width, parentSprite.height);
        if (cmd != SubContextCMD.RequestFriendRanking && cmd != SubContextCMD.RequestTop3) {
            return;
        }
        // onLoading && onLoading();//开始载入loading界面
        // this.setDataInShareArea('isNetWorkComplete', false);

        this.callFunctionInSubContext(cmd, {
        });//告诉子域，要开始请求数据绘制了！

        // Laya.timer.once(7 * 1000, this, this.checkTimeout, [onTimeoutF]);//检查超时与否
        Laya.timer.loop(200, this, this.checkDataReceive, [onComplete, parentSprite, x, y]);//轮询看数据是否已经加载完成
    }

    /*
    private setDataInShareArea(key: string, v: any) {
        laya.utils.Browser.window.sharedCanvas[key] = v;
    }
    */
    //检查网络数据是否已经超时了
    private checkTimeout(onTimeoutF: Function) {
        if (this.fetchDataFromShareArea('isNetWorkComplete') == false) {
            //加载太久了，估计废了
            // this.setDataInShareArea('isNetWorkComplete', true);
            onTimeoutF && onTimeoutF();
            Laya.timer.clear(this, this.checkDataReceive);//把定时器清空了
        }
    }
    //检查数据是否已经收到了
    private checkDataReceive(onComplete: Function, parentSprite: Laya.Sprite, x: number, y: number) {
        if (true || this.fetchDataFromShareArea('isNetWorkComplete') == true) {//说明数据请求顺利完成了(基本可以证明子域的绘制完成)
            Laya.timer.clear(this, this.checkDataReceive);//把定时器清空了
            Laya.timer.clear(this, this.checkTimeout);//超时检测器也清空了
            // this.setDataInShareArea('isNetWorkComplete', false);//设置正确的标志位
            // onComplete && onComplete();

            //开始绘制了
            this.beginDrawShareCanvas(parentSprite, x, y);
        }
    }

    private fetchDataFromShareArea(key: string) {
        return this.openDataContext.canvas[key];
    }

    //////////////////////
    //开始绘制离屏
    private beginDrawShareCanvas(parentSprite: Laya.Sprite, x: number, y: number) {
        this.shareCanvasTex = new Laya.Texture(Laya.Browser.window.sharedCanvas);
        this.shareCanvasTex.bitmap.alwaysChange = false;//小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true

        parentSprite.removeChildren();//把上面所有子元素全部清空
        parentSprite.graphics.clear();

        parentSprite.graphics.drawTexture(this.shareCanvasTex, 0, 0, this.shareCanvasTex.width, this.shareCanvasTex.height);
        // parentSprite.graphics.drawTexture(this.shareCanvasTex, x, y, this.shareCanvasTex.width, this.shareCanvasTex.height);

        Laya.timer.loop(500, this, this.updateShareCanvasTexture);
        /*
        Laya.timer.once(500 * 10, this, function () {//给你刷新10次的机会，如果还有问题，那估计也废了，所以10次后，我们把定时器撤了！
            Laya.timer.clear(this, this.updateShareCanvasTexture);
        });
        */
    }

    //刷新离屏canvas的纹理，频率较低
    private updateShareCanvasTexture() {
        //此方法只有在webgl模式下才存在
        this.shareCanvasTex.bitmap.reloadCanvasData();
    }

    //停止绘制
    //离开排行榜时最好调用此逻辑
    public exitDrawShareCanvas() {
        Laya.timer.clear(this, this.updateShareCanvasTexture);
        this.shareCanvasTex && this.shareCanvasTex.destroy();
        this.shareCanvasTex = null;
    }
}
