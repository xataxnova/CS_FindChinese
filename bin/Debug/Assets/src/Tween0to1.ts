import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class ccTween0to1{
    constructor(){

    }

    //在duration期间内执行tween，每一次都调用upadteCallback
    static mmwork(thisObj, updateCallback, duration, completeCallbak?, ease?){
        var fromPoint = {
            t : 0
        };

        var updateFunction:Laya.Handler = Laya.Handler.create(thisObj, function(arg){
            updateCallback.bind(thisObj, arg.t).call();
        }, [fromPoint], false);

        Laya.Tween.to(fromPoint, {
            t : 1,
            update: updateFunction
        }, duration, ease, Laya.Handler.create(this, function(){
            // updateFunction.recover();
            //一直在用，未必要清？
            completeCallbak && completeCallbak();
        }));
    }
}
