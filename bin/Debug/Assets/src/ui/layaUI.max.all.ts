import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class gameUI extends View {
		public handBox:Laya.Box;
		public hand:Laya.Image;
		public scoreLbl:Laya.Label;
		public btnMute:Laya.CheckBox;
		public beatCount:Laya.Label;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"width":640,"var":"handBox","height":200,"centerX":0,"bottom":200},"compId":9,"child":[{"type":"Image","props":{"width":580,"skin":"gameFrame/bar.png","sizeGrid":"0,20,0,20","centerY":0,"centerX":0},"compId":7},{"type":"Image","props":{"var":"hand","skin":"gameFrame/hand.png","centerX":0,"bottom":11},"compId":8}],"components":[]},{"type":"Image","props":{"top":100,"skin":"gameFrame/beyond.png","centerX":0},"compId":10},{"type":"Image","props":{"top":180,"skin":"gameFrame/distance.png","centerX":-106},"compId":11,"child":[{"type":"Label","props":{"var":"scoreLbl","top":-17,"text":"0","left":223,"fontSize":60,"color":"#000000","bold":true},"compId":6}],"components":[]},{"type":"CheckBox","props":{"y":10,"x":10,"var":"btnMute","top":200,"stateNum":2,"skin":"homeFrame/mute.png","left":20},"compId":13},{"type":"Label","props":{"width":120,"var":"beatCount","top":92,"text":"0","fontSize":60,"color":"#000000","centerX":5,"bold":true,"align":"center"},"compId":3}],"loadList":["gameFrame/bar.png","gameFrame/hand.png","gameFrame/beyond.png","gameFrame/distance.png","homeFrame/mute.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.gameUI.uiView);
        }
    }
}
module ui {
    export class homeUI extends View {
		public balls:Laya.Box;
		public ball0:Laya.Image;
		public ball1:Laya.Image;
		public ball2:Laya.Image;
		public ball3:Laya.Image;
		public ball4:Laya.Image;
		public ball5:Laya.Image;
		public btnNext:Laya.Button;
		public btnPre:Laya.Button;
		public btnStart:Laya.Button;
		public btnRank:Laya.Button;
		public btnShare:Laya.Button;
		public btnMute:Laya.CheckBox;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"width":640,"var":"balls","renderType":"render","height":128,"centerY":0,"centerX":0},"compId":16,"child":[{"type":"Image","props":{"y":64,"x":-22,"width":128,"var":"ball0","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":17},{"type":"Image","props":{"y":64,"x":153,"width":128,"var":"ball1","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":18},{"type":"Image","props":{"y":64,"x":320,"width":128,"var":"ball2","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":19},{"type":"Image","props":{"y":64,"x":488,"width":128,"var":"ball3","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":20},{"type":"Image","props":{"y":64,"x":655,"width":128,"var":"ball4","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":21},{"type":"Image","props":{"y":64,"x":822,"width":128,"var":"ball5","skin":"audioAvatar/3d/textures/ballMenu/b1.png","height":128,"anchorY":0.5,"anchorX":0.5},"compId":23}],"components":[]},{"type":"Button","props":{"y":0,"var":"btnNext","stateNum":2,"skin":"homeFrame/next.png","right":30,"centerY":0},"compId":8},{"type":"Button","props":{"y":10,"var":"btnPre","stateNum":2,"skin":"homeFrame/pre.png","left":30,"centerY":0},"compId":9},{"type":"Button","props":{"width":250,"var":"btnStart","stateNum":2,"skin":"homeFrame/start.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","labelBold":false,"height":100,"centerX":0,"bottom":300},"compId":6},{"type":"Button","props":{"y":956,"x":-94,"width":250,"var":"btnRank","stateNum":2,"skin":"homeFrame/rank.png","sizeGrid":"2","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","labelBold":false,"height":100,"centerX":0,"bottom":80},"compId":11},{"type":"Button","props":{"x":228,"width":250,"var":"btnShare","stateNum":2,"skin":"homeFrame/pk.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","labelBold":false,"height":100,"centerX":0,"bottom":190},"compId":5},{"type":"CheckBox","props":{"var":"btnMute","top":100,"stateNum":2,"skin":"homeFrame/mute.png","left":20},"compId":12}],"loadList":["audioAvatar/3d/textures/ballMenu/b1.png","homeFrame/next.png","homeFrame/pre.png","homeFrame/start.png","homeFrame/rank.png","homeFrame/pk.png","homeFrame/mute.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.homeUI.uiView);
        }
    }
}
module ui {
    export class matchUI extends View {
		public avatarList:Laya.List;
		public matchTimer:Laya.Label;
		public btnBack:Laya.Button;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"y":0,"x":0,"alpha":0.5},"compId":3,"child":[{"type":"Rect","props":{"width":640,"lineWidth":1,"height":1136,"fillColor":"#000000"},"compId":2}],"components":[]},{"type":"Box","props":{"width":640,"height":680,"centerY":0,"centerX":0,"alpha":1},"compId":5,"child":[{"type":"Box","props":{"y":0,"x":0,"width":640,"height":680,"alpha":0.7},"compId":13,"child":[{"type":"Rect","props":{"width":640,"lineWidth":1,"height":680,"fillColor":"#000000"},"compId":12}],"components":[]},{"type":"Label","props":{"top":9,"text":"匹配中...","fontSize":50,"color":"#ffffff","centerX":0},"compId":6},{"type":"List","props":{"width":600,"var":"avatarList","top":77,"spaceY":5,"spaceX":5,"repeatY":5,"repeatX":6,"height":494,"centerX":0},"compId":9,"child":[{"type":"Box","props":{"y":0,"x":0,"renderType":"render"},"compId":8,"child":[{"type":"Image","props":{"width":95,"skin":"audioAvatar/avatar/avatar.png","name":"avatar","height":95},"compId":7}],"components":[]}],"components":[]},{"type":"Label","props":{"y":10,"var":"matchTimer","top":9,"text":"(3s)","fontSize":50,"color":"#ffffff","centerX":136},"compId":10},{"type":"Button","props":{"var":"btnBack","stateNum":2,"skin":"matchFrame/back.png","centerX":0,"bottom":20},"compId":14}],"components":[]}],"loadList":["audioAvatar/avatar/avatar.png","matchFrame/back.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.matchUI.uiView);
        }
    }
}
module ui {
    export class rankUI extends View {
		public container:Laya.Box;
		public btnBack:Laya.Button;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"y":0,"x":0,"alpha":0.8},"compId":14,"child":[{"type":"Rect","props":{"y":0,"x":0,"width":640,"lineWidth":1,"height":1136,"fillColor":"#000000"},"compId":13}],"components":[]},{"type":"Image","props":{"skin":"rankFrame/title.png","centerY":-325,"centerX":0},"compId":2},{"type":"Box","props":{"width":620,"var":"container","height":550,"centerY":0,"centerX":0},"compId":12},{"type":"Button","props":{"var":"btnBack","stateNum":2,"skin":"rankFrame/back.png","centerY":334,"centerX":0},"compId":11}],"loadList":["rankFrame/title.png","rankFrame/back.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.rankUI.uiView);
        }
    }
}
module ui {
    export class resultUI extends View {
		public imgAddFav:Laya.Image;
		public score:Laya.Label;
		public record:Laya.Label;
		public rankBox:Laya.HBox;
		public btnShare:Laya.Button;
		public btnHome:Laya.Button;
		public btnClose:Laya.Button;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"y":0,"x":0,"alpha":0.7},"compId":15,"child":[{"type":"Rect","props":{"width":640,"lineWidth":1,"height":1136,"fillColor":"#000000"},"compId":14}],"components":[]},{"type":"Image","props":{"y":40,"var":"imgAddFav","skin":"homeFrame/addFav.png","right":200},"compId":2},{"type":"Label","props":{"var":"score","top":200,"text":"0","fontSize":50,"color":"#ffffff","centerX":0},"compId":3},{"type":"Label","props":{"x":10,"var":"record","top":269,"text":"历史记录：0","fontSize":30,"color":"#ffffff","centerX":0},"compId":4},{"type":"HBox","props":{"width":640,"var":"rankBox","top":321,"height":280,"centerX":0},"compId":5},{"type":"Button","props":{"width":250,"var":"btnShare","stateNum":2,"skin":"homeFrame/challenge.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","height":100,"centerY":200,"centerX":0},"compId":7},{"type":"Button","props":{"x":10,"width":250,"visible":true,"var":"btnHome","stateNum":2,"skin":"homeFrame/back.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","height":100,"centerY":310,"centerX":0},"compId":8},{"type":"Button","props":{"y":10,"x":10,"var":"btnClose","top":100,"stateNum":1,"skin":"homeFrame/close.png","left":80},"compId":17}],"loadList":["homeFrame/addFav.png","homeFrame/challenge.png","homeFrame/back.png","homeFrame/close.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.resultUI.uiView);
        }
    }
}
module ui {
    export class reviveUI extends View {
		public btnRevive:Laya.Button;
		public btnGiveup:Laya.Button;
		public btnClose:Laya.Button;
		public countDown:Laya.Label;
        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"compId":1,"child":[{"type":"Box","props":{"y":0,"x":0,"alpha":0.5},"compId":5,"child":[{"type":"Rect","props":{"width":640,"lineWidth":1,"height":1136,"fillColor":"#000000"},"compId":4}],"components":[]},{"type":"Button","props":{"width":250,"var":"btnRevive","stateNum":2,"skin":"homeFrame/restart.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","height":100,"centerY":280,"centerX":0},"compId":2},{"type":"Button","props":{"x":10,"width":250,"visible":false,"var":"btnGiveup","stateNum":2,"skin":"homeFrame/giveup.png","labelSize":40,"labelPadding":"0,0,10,0","labelColors":"#ffffff,#ffffff","height":100,"centerY":400,"centerX":0},"compId":3},{"type":"Button","props":{"var":"btnClose","top":100,"stateNum":1,"skin":"homeFrame/close.png","left":80},"compId":6},{"type":"Image","props":{"width":234,"skin":"homeFrame/countCycle.png","height":234,"centerY":-50,"centerX":0},"compId":7,"child":[{"type":"Label","props":{"var":"countDown","text":"5","height":0,"fontSize":100,"color":"#ffffff","centerY":0,"centerX":0,"bold":false,"anchorY":0.5,"anchorX":0.5},"compId":8}],"components":[]}],"loadList":["homeFrame/restart.png","homeFrame/giveup.png","homeFrame/close.png","homeFrame/countCycle.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.reviveUI.uiView);
        }
    }
}