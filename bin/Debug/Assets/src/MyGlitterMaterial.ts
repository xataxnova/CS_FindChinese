import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class MyGlitterMaterial extends Laya.BaseMaterial {
    static RENDERMODE_OPAQUE: number = 0;
    static RENDEMODE_TRANSPARENT: number = 1;
    static MAINTEXTURE: number = 1;
    static MAINCOLOR: number = 2;
    static DIST: number = 3;
    static QOFFSET: number = 4;
    static SHADERDEFINE_MAINTMAP: number;

    constructor() {
        super();
        this.setShaderName("MT_GLITTER");
        this.renderMode = MyGlitterMaterial.RENDERMODE_OPAQUE;
        this._setColor(MyGlitterMaterial.MAINCOLOR, new Laya.Vector4(1, 1, 1, 1));
        this._setColor(MyGlitterMaterial.QOFFSET, new Laya.Vector4(0, 0, 0, 1));
        this._setNumber(MyGlitterMaterial.DIST, 10);
    }

    get mainTexture(): laya.d3.resource.BaseTexture {
        return this._getTexture(MyGlitterMaterial.MAINTEXTURE);
    }

    set mainTexture(t: laya.d3.resource.BaseTexture) {
        t ? this._addShaderDefine(MyGlitterMaterial.SHADERDEFINE_MAINTMAP) : 
        this._removeShaderDefine(MyGlitterMaterial.SHADERDEFINE_MAINTMAP);
        
        this._setTexture(MyGlitterMaterial.MAINTEXTURE, t);
    }

    get qOffset(): Laya.Vector4 {
        return this._getColor(MyGlitterMaterial.QOFFSET);
    }

    set qOffset(t: Laya.Vector4) {
        this._setColor(MyGlitterMaterial.QOFFSET, t);
    }

    get mainColor(): Laya.Vector4 {
        return this._getColor(MyGlitterMaterial.MAINCOLOR);
    }

    set mainColor(t: Laya.Vector4) {
        this._setColor(MyGlitterMaterial.MAINCOLOR, t);
    }

    get dist(): number {
        return this._getNumber(MyGlitterMaterial.DIST);
    }

    set dist(t: number) {
        this._setNumber(MyGlitterMaterial.DIST, t)
    }

    set renderMode(t: number) {
        switch (t) {
            case MyGlitterMaterial.RENDERMODE_OPAQUE:
                this.renderQueue = 2000;//Laya.RenderQueue.OPAQUE;
                this.depthWrite = true;
                this.cull = Laya.BaseMaterial.CULL_BACK;
                this.blend = Laya.BaseMaterial.BLEND_DISABLE;
                this.alphaTest = false;
                this.depthTest = Laya.BaseMaterial.DEPTHTEST_LESS;
                break;
            case MyGlitterMaterial.RENDEMODE_TRANSPARENT:
                this.renderQueue = 3000;//Laya.RenderQueue.TRANSPARENT;
                this.depthWrite = true;
                this.cull = Laya.BaseMaterial.CULL_BACK;
                this.blend = Laya.BaseMaterial.BLEND_ENABLE_ALL;
                this.srcBlend = Laya.BaseMaterial.BLENDPARAM_SRC_ALPHA;
                this.dstBlend = Laya.BaseMaterial.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
                this.alphaTest = false;
                this.depthTest = Laya.BaseMaterial.DEPTHTEST_LESS;
        }
    }

    static initShader() {
        var t: number = Laya.Shader3D.nameKey.add("MT_GLITTER");
        var i: Object = {
            a_Position: Laya.VertexElementUsage.POSITION0,
            a_Texcoord: Laya.VertexElementUsage.TEXTURECOORDINATE0,
            a_Time: Laya.VertexElementUsage.TIME0,
        };
        var n: Object = {
            u_MMatrix: [Laya.Sprite3D.WORLDMATRIX, Laya.Shader3D.PERIOD_SPRITE],
            u_VMatrix: [Laya.BaseCamera.VIEWMATRIX, Laya.Shader3D.PERIOD_CAMERA],
            u_PMatrix: [Laya.BaseCamera.PROJECTMATRIX, Laya.Shader3D.PERIOD_CAMERA],
            u_MainColor: [this.MAINCOLOR, Laya.Shader3D.PERIOD_MATERIAL],
            u_MainTexture: [this.MAINTEXTURE, Laya.Shader3D.PERIOD_MATERIAL],
            u_Dist: [this.DIST, Laya.Shader3D.PERIOD_MATERIAL],
            u_QOffset: [this.QOFFSET, Laya.Shader3D.PERIOD_MATERIAL],
            u_CurrentTime: [Laya.Glitter.CURRENTTIME, Laya.Shader3D.PERIOD_SPRITE],
            u_Duration: [Laya.Glitter.DURATION, Laya.Shader3D.PERIOD_SPRITE]
        };
        var r: Laya.ShaderCompile3D = Laya.ShaderCompile3D.add(t, "attribute vec4 a_Position;\nattribute float a_Time;\nuniform mat4 u_MMatrix;\nuniform mat4 u_VMatrix;\nuniform mat4 u_PMatrix;\nuniform float u_Dist;\nuniform vec4 u_QOffset;\n#ifdef MAINMAP\nattribute vec2 a_Texcoord;\nvarying vec2 v_Texcoord;\n#endif\nuniform float u_CurrentTime;\nuniform vec4 u_MainColor;\nuniform float u_Duration;\nvarying vec4 v_Color;\nvoid main(){\n#ifdef MAINMAP\nv_Texcoord = a_Texcoord;\n#endif\nfloat age = u_CurrentTime-a_Time;\nfloat normalizedAge = clamp(age / u_Duration,0.0,1.0);\nv_Color=u_MainColor;\nv_Color.a*=1.0-normalizedAge;\nvec4 vPos =  u_VMatrix * u_MMatrix *a_Position;\nfloat zOff = vPos.z/u_Dist;\nvPos += u_QOffset*zOff*zOff;\ngl_Position = u_PMatrix * vPos;\n}", "#ifdef FSHIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n#ifdef MAINMAP\nuniform sampler2D u_MainTexture;\nvarying vec2 v_Texcoord;\n#endif\nvarying vec4 v_Color;\nvoid main(){\nvec4 mainColor = v_Color;\n#ifdef MAINMAP\nvec4 texColor = texture2D(u_MainTexture,v_Texcoord);\nmainColor.rgba = mainColor.rgba * texColor.rgba;\n#endif\ngl_FragColor = mainColor;\n}\n", i, n);
        this.SHADERDEFINE_MAINTMAP = r.registerMaterialDefine("MAINMAP");
    }
}
