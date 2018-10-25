import { language }from "./Localize/LoadLocalizationFile"
/*
* 各种道具的基类，有位置，可碰撞，可动态出现，可自动回收
*/
class ItemBase extends Laya.MeshSprite3D {
    zPos: number = 0;
    yPos: number = 0.01;
    xPos: number;
    canMove: boolean;
    moveDir: number = 1;
    posVec3: Laya.Vector3;

    constructor(mesh?: Laya.BaseMesh, name?: string) {
        super(mesh, name);
        this.xPos = Math.floor(5 * Math.random() - 2);
        this.canMove = false;
        this.posVec3 = new Laya.Vector3();
    }

    doSetY(y) {
        this.yPos = y;
    }

    doSetX(x) {
        this.xPos = x;
    }

    doEnableMove() {
        this.canMove = true;
    }

    //显示该道具
    doShow() {
        this.active = true;
        this.zPos = TerrainController.me.roadSpanZ;

        this.posVec3.x = this.xPos;
        this.posVec3.y = this.yPos;
        this.posVec3.z = this.zPos;
        this.transform.localPosition = this.posVec3;//Math.floor(5 * Math.random() - 2)

        var collider: Laya.Component3D = this.getComponentByType(Laya.BoxCollider);
        collider && (collider.enable = true);
    }//show

    //隐藏该道具
    doHide() {
        var collider: Laya.Component3D = this.getComponentByType(Laya.BoxCollider);
        collider && (collider.enable = false);
        this.active = false;
        this.canMove = false;
    }

    update() {
        if (this.active) {//如果是显示状态，那么判断距离超过一定程度就回收掉
            if (this.zPos - ccBallController.ffme.ffcurPos.z > 20) {
                // AIController.me.autoNavi();
                ccAIController.ffme.removePoint(this.zPos);
                this.doHide();
            } else if (this.canMove) {//if
                this.posVec3.x = MathFun.limit(ccItemBoxObj.allXPos[0], ccItemBoxObj.allXPos[ccItemBoxObj.allXPos.length - 1], this.posVec3.x + this.moveDir * 0.1);
                this.transform.position = this.posVec3;//new Laya.Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z) ;

                // Math.min(this.transform.position.x + this.moveDir * 0.05, ItemBoxObj.allXPos[ItemBoxObj.allXPos.length - 1]);
                if (this.transform.position.x >= ccItemBoxObj.allXPos[ccItemBoxObj.allXPos.length - 1]) {
                    // debugger
                    this.moveDir = -1;
                }
                if (this.transform.position.x <= ccItemBoxObj.allXPos[0]) {
                    // debugger
                    this.moveDir = 1;
                }

            }
        }//if
    }
}
