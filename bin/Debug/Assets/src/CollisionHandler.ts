import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class CollisionHandler extends Laya.Script {
    private hostObj:any;
    constructor() {
        super();
    }

    public mmsetHostObj(v:any){
        this.hostObj = v;
    }

    onTriggerEnter(other: Laya.Collider) {
        switch (parseInt(other.owner.name)) {
            case COLLIDER_NAME.SPEED:
                this.hostObj['mmaddSpeed']();
                // BallController.me.addSpeed();
                break;
            case COLLIDER_NAME.BOX:
                var box:Laya.MeshSprite3D = other.owner as Laya.MeshSprite3D;
                if(box.transform.position.y > 1){//如果和高处的方块碰撞，不要算作失败
                    // debugger;
                    return;
                }
               this.hostObj['mmhitBox']();
                break;
            case COLLIDER_NAME.JUMP:
                this.hostObj['mmjump']();
                // BallController.me.jump();
                break;
        }
    }
}
