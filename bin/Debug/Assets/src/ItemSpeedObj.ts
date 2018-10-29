/*
* name;
*/
class ItemSpeedObj {
    constructor() {
        var speedItem: ItemBase = ItemController.me.pickupSpeed();

        var aiUnsafe = [];

        //这里如果太精确，就会出现ai球都笔直地往目标冲过去加速的情况，显得有点假
        //所以我希望出现加速器时，不要告诉ai那么精确
        if (Math.random() > 0.7) {
            for (var i = 0; i < ccItemBoxObj.allXPos.length; i++) {
                if (ccItemBoxObj.allXPos[i] != speedItem.xPos) {
                    aiUnsafe.push(ccItemBoxObj.allXPos[i]);
                }
            }
        }



        speedItem.doSetY(0.01);
        speedItem.doShow();

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, aiUnsafe);
    }
}