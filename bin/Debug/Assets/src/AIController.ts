import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class ccAIController {
    static ffme: ccAIController;
    public ffnaviPoint: any;//key是最近路障的z值，value是该路障的不可穿越点
    public aiBalls: Array<ccAIBall>;


    constructor() {
        ccAIController.ffme = this;
        this.ffnaviPoint = {};

        this.aiBalls = new Array<ccAIBall>();
    }

    //开始的时候创建小球
    public onstart() {
        this.createAIBalls();
    }

    public onupdate(t: number) {
        for (var k in this.aiBalls) {
            this.aiBalls[k].mmonupdate(t);
        }//for
    }

    public onreset() {
        for (var k in this.aiBalls) {
            this.aiBalls[k].mmdestoryBall();
        }//for
        delete this.aiBalls;

        this.ffnaviPoint = {};
        this.aiBalls = new Array<ccAIBall>();
    }

    private createAIBalls() {
        var num0to30 = this.genRandom0to500();
        for (var i = 0; i < 10; i++) {//出现30个AI球
            var aiBall: ccAIBall = new ccAIBall(i + 1, num0to30.shift());
            this.aiBalls.push(aiBall);
        }
    }

    //重新设置offset值以获得正确的视觉系效果
    public reAssignOffset(nwoOffset) {
        for (var k in this.aiBalls) {
            this.aiBalls[k].mmreAssignOffset(nwoOffset);
        }
    }

    //最新生成了一个路障，把对应的安全点记录下来
    //为了性能考虑，确保容器中只有一个——即离自己最近的那个？（但是考虑到其他小球的位置，这么做好像又不合适？）
    public addPoint(distanceKey: number, points: any) {
        this.ffnaviPoint[distanceKey] = points;
    }

    //时效已过，把它的相关信息删掉
    public removePoint(distanceKey: number) {
        delete this.ffnaviPoint[distanceKey];// = undefined;
    }

    public mmgetSafePointX(curPos: Laya.Vector3) {
        var allKeys = Object.keys(ccAIController.ffme.ffnaviPoint);
        var len = allKeys.length;
        if (len == 0) {
            return undefined;
        }

        //找出离球最近的路障
        var dlt = Number.POSITIVE_INFINITY;
        var nearest = undefined;
        for (var k in allKeys) {
            var numK = parseFloat(allKeys[k]);
            if (numK < curPos.z && (curPos.z - numK) < dlt) {
                dlt = curPos.z - numK;
                nearest = numK;
            }
        }
        if (nearest == undefined) {//ai球跑的太快，超过显示范围了，不要算了
            return undefined;
        }

        var unsafePoint = ccAIController.ffme.ffnaviPoint['' + nearest];
        // debugger
        if (!this.isInUnsafe(unsafePoint, curPos.x)) {
            return curPos.x;
        }//如果当前位置就是安全位置，不要动

        //把所有安全点罗列出来
        var safePoint = [];
        for (var t = 0; t < ccItemBoxObj.allXPos.length; t++) {
            var v = ccItemBoxObj.allXPos[t];
            if (!this.isInUnsafe(unsafePoint, v)) {
                safePoint.push(v);
            }
        }//for

        if (safePoint.length == 0) {
            return undefined;
        } else {
            return safePoint[(~~(Math.random() * 100)) % safePoint.length];
        }
    }

    //判断某个值是否存在于 不安全路点 数组中
    private isInUnsafe(unsafeArr, v): boolean {
        if (!unsafeArr) {
            debugger
        }
        var ret = false;
        for (var j = 0; j < unsafeArr.length; j++) {
            if (unsafeArr[j] == v) {
                return true;
            }//if
        }
    }

    public autoNavi() {
        // BallController.me.autoNavi();
        for (var k in this.aiBalls) {
            this.aiBalls[k].mmautoNavi();
        }
    }

    private genRandom0to500(): any {
        var allNumber = [];
        for (var i = 0; i < 500; i++) {
            allNumber.push(i);
        }

        allNumber.sort(function (a, b) {
            return Math.random() > 0.5 ? 1 : -1;
        })

        return allNumber.splice(0, 30);

    }

}
