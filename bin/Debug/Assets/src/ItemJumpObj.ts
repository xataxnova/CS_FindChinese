/*
* name;
*/
class ItemJumpObj {
    constructor() {
        var jumpXIndex = ccItemBoxObj.randomXIndex();
        var jumpXIndex2 = (jumpXIndex + 1) % ccItemBoxObj.allXPos.length;
        if(jumpXIndex2 == 0){
            jumpXIndex2 = jumpXIndex - 1;
        }

        var aiUnsafe = [];
        for (var k = 0; k < ccItemBoxObj.allXPos.length; k++) {
            if ((k == jumpXIndex2) || (k == jumpXIndex)) {//这个坐标正好给跳台使用
                var jumpItem: ItemBase = ItemController.me.pickupAJump();
                jumpItem.doSetY(0.5);
                jumpItem.doSetX(ccItemBoxObj.allXPos[k]);
                jumpItem.doShow();
            } else {//这个坐标给box使用
                var boxItem: ItemBase = ItemController.me.pickupABox();
                boxItem.doSetY(0.5);
                boxItem.doSetX(ccItemBoxObj.allXPos[k]);
                boxItem.doShow();
                aiUnsafe.push(ccItemBoxObj.allXPos[k]);
            }

        }

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, aiUnsafe);
    }
}