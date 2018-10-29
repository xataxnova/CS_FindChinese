/*
* name;
*/
class ccItemBoxObj {
    static allXPos: Array<number> = [
        -2,
        -2 + 1,
        -2 + 2,
        -2 + 3,
        -2 + 4
    ];
    constructor() {
        var possible: number = (~~(Math.random() * 100)) % 13;
        // possible = 0;
        switch (possible) {
            case 0:
            case 1:
            case 2:
                this.genOneBox(); break;
            case 3:
                this.genTwoVBox(); break;
            case 4:
            case 5:

            case 6:
                this.genTwoHBox(); break;
            case 7:

            case 8:
            case 9:
                this.genDoorBox(); break;
            case 10:
            case 11:
            case 12:
                this.genTBox(); break;
        }
    }

    //返回一个x位置
    public static randomX(): number {
        var idx: number = (~~(Math.random() * 100)) % ccItemBoxObj.allXPos.length;
        return ccItemBoxObj.allXPos[idx];
    }

    //返回一个位置的索引
    public static randomXIndex(): number {
        var idx: number = (~~(Math.random() * 100)) % ccItemBoxObj.allXPos.length;
        return idx;
    }

    //一个单独方块
    private genOneBox() {
        var x = ccItemBoxObj.randomX();
        var boxItem: ItemBase = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(x);
        if (Math.random() > 0.1) {//一定的概率会移动
            boxItem.doEnableMove();

            var unsafe = ccItemBoxObj.allXPos.concat([]);
            unsafe.splice(unsafe.indexOf(x), 1);
            ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, unsafe);
        } else {
            ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, [x]);
        }
        boxItem.doShow();
    }

    //纵向两个竖方块
    //□
    //□
    private genTwoVBox() {
        var x = ccItemBoxObj.randomX();
        var boxItem: ItemBase = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(x);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(1.5);
        boxItem.doSetX(x);
        boxItem.doShow();

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, [x]);
    }

    private genTwoHBox() {
        var x = ccItemBoxObj.randomX();
        var boxItem: ItemBase = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(x);
        boxItem.doShow();

        var x2 = x;
        while (x2 == x) {//随机出一个不同的坐标
            x2 = ccItemBoxObj.randomX();
        }

        if (x != x2) {
            boxItem = ItemController.me.pickupABox();
            boxItem.doSetY(0.5);
            boxItem.doSetX(x2);
            boxItem.doShow();
        }

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, [x, x2]);
    }


    //隧道型障碍物
    //□□□□□□□□□□
    //□        □(左边和右边坐标是正负2)
    private genDoorBox() {
        //最左边
        var boxItem: ItemBase = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(-2);
        boxItem.doShow();

        //最右边
        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(2);
        boxItem.doShow();

        //上面一排
        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 1);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 2);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 3);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 4);
        boxItem.doShow();

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, [-2, 2]);
    }

    //生成T字形的障碍物
    private genTBox() {
        var x = ccItemBoxObj.randomX();
        //最底下
        var boxItem: ItemBase = ItemController.me.pickupABox();
        boxItem.doSetY(0.5);
        boxItem.doSetX(x);
        boxItem.doShow();

        //上面一排
        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 1);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 2);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 3);
        boxItem.doShow();

        boxItem = ItemController.me.pickupABox();
        boxItem.doSetY(0.5 + 1);
        boxItem.doSetX(-2 + 4);
        boxItem.doShow();

        ccAIController.ffme.addPoint(TerrainController.me.roadSpanZ, [x]);
    }

}