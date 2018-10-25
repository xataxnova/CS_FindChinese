import { language }from "./Localize/LoadLocalizationFile"
/*
* 环境专用材质，运用于 球，路，建筑
*/
class ccMyEnvMaterial extends Laya.BaseMaterial {
    static RENDERMODE_OPAQUE: number = 0;
    static RENDEMODE_TRANSPARENT: number = 1;
    static MAINTEXTURE: number = 1;
    static MAINCOLOR: number = 2;
    static DIST: number = 3;
    static QOFFSET: number = 4;
    static FOGCOLOR: number = 5;
    static FOGSTART: number = 6;
    static FOGRANGE: number = 7;
    static FOGSTARTD: number = 8;
    static FOGRANGED: number = 9;

    static SHADERDEFINE_MAINTMAP: number;
    static SHADERDEFINE_DEPTHFOG: number;
    static SHADERDEFINE_FOG: number;

    __enableFog: boolean;
    __enableDepthFog: boolean;

    constructor() {
        super();
        this.__enableFog = false;
        this.__enableDepthFog = false;
        this.setShaderName("MY_ENV");
        this.renderMode = ccMyEnvMaterial.RENDERMODE_OPAQUE;
        this._setColor(ccMyEnvMaterial.MAINCOLOR, new Laya.Vector4(1, 1, 1, 1));
        this._setColor(ccMyEnvMaterial.QOFFSET, new Laya.Vector4(0, 0, 0, 1));
        this._setNumber(ccMyEnvMaterial.DIST, 10), this._setNumber(ccMyEnvMaterial.FOGSTART, 0);
        this._setNumber(ccMyEnvMaterial.FOGRANGE, 10), this._setNumber(ccMyEnvMaterial.FOGSTARTD, 0);
        this._setNumber(ccMyEnvMaterial.FOGRANGED, 10);
        this._setColor(ccMyEnvMaterial.FOGCOLOR, new Laya.Vector3(.2, .2, .2));
    }

    get ffmainTexture(): Laya.BaseTexture {
        return this._getTexture(ccMyEnvMaterial.MAINTEXTURE)
    }

    set ffmainTexture(t: Laya.BaseTexture) {
        t ? this._addShaderDefine(ccMyEnvMaterial.SHADERDEFINE_MAINTMAP) : this._removeShaderDefine(ccMyEnvMaterial.SHADERDEFINE_MAINTMAP);
        this._setTexture(ccMyEnvMaterial.MAINTEXTURE, t);
    }

    get ffqOffset(): Laya.Vector4 {
        return this._getColor(ccMyEnvMaterial.QOFFSET);
    }

    set ffqOffset(t: Laya.Vector4) {
        this._setColor(ccMyEnvMaterial.QOFFSET, t);
    }

    get ffmainColor(): Laya.Vector4 {
        return this._getColor(ccMyEnvMaterial.MAINCOLOR);
    }

    set ffmainColor(t: Laya.Vector4) {
        this._setColor(ccMyEnvMaterial.MAINCOLOR, t);
    }

    get ffdist(): number {
        return this._getNumber(ccMyEnvMaterial.DIST);
    }

    set ffdist(t: number) {
        this._setNumber(ccMyEnvMaterial.DIST, t);
    }

    get fogStart(): number {
        return this._getNumber(ccMyEnvMaterial.FOGSTART);
    }

    set fogStart(t: number) {
        this._setNumber(ccMyEnvMaterial.FOGSTART, t);
    }

    get fogRange(): number {
        return this._getNumber(ccMyEnvMaterial.FOGRANGE);
    }

    set fogRange(t: number) {
        this._setNumber(ccMyEnvMaterial.FOGRANGE, t);
    }

    get fogStartD(): number {
        return this._getNumber(ccMyEnvMaterial.FOGSTARTD);
    }

    set fogStartD(t: number) {
        this._setNumber(ccMyEnvMaterial.FOGSTARTD, t);
    }

    get fogRangeD(): number {
        return this._getNumber(ccMyEnvMaterial.FOGRANGED);
    }

    set fogRangeD(t: number) {
        this._setNumber(ccMyEnvMaterial.FOGRANGED, t);
    }


    get fogColor(): Laya.Vector3 {
        return this._getColor(ccMyEnvMaterial.FOGCOLOR);
    }

    set fogColor(t: Laya.Vector3) {
        this._setColor(ccMyEnvMaterial.FOGCOLOR, t);
    }

    set renderMode(t: number) {
        switch (t) {
            case ccMyEnvMaterial.RENDERMODE_OPAQUE:
                this.renderQueue = 2000;//Laya.RenderQueue.OPAQUE;
                this.depthWrite = true;
                this.cull = Laya.BaseMaterial.CULL_BACK;
                this.blend = Laya.BaseMaterial.BLEND_DISABLE;
                this.alphaTest = false;
                this.depthTest = Laya.BaseMaterial.DEPTHTEST_LESS;
                break;
            case ccMyEnvMaterial.RENDEMODE_TRANSPARENT:
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

    set enableFog(t: boolean) {
        if (this.__enableFog !== t) {
            t ? this._addShaderDefine(ccMyEnvMaterial.SHADERDEFINE_FOG) : this._removeShaderDefine(ccMyEnvMaterial.SHADERDEFINE_FOG);
            this.__enableFog = t;
        }
    }


    set enabledDepthFog(t: boolean) {
        if (this.__enableDepthFog !== t) {
            t ? this._addShaderDefine(ccMyEnvMaterial.SHADERDEFINE_DEPTHFOG) : this._removeShaderDefine(ccMyEnvMaterial.SHADERDEFINE_DEPTHFOG);
            this.__enableDepthFog = t;
        }
    }

    static initShader() {
        var t:number = Laya.Shader3D.nameKey.add("MY_ENV");
          var  i:Object = {
                a_Position: Laya.VertexElementUsage.POSITION0,
                a_Texcoord: Laya.VertexElementUsage.TEXTURECOORDINATE0
            };
           var n:Object = {
                u_MMatrix: [Laya.Sprite3D.WORLDMATRIX, Laya.Shader3D.PERIOD_SPRITE],
                u_VMatrix: [Laya.BaseCamera.VIEWMATRIX, Laya.Shader3D.PERIOD_CAMERA],
                u_PMatrix: [Laya.BaseCamera.PROJECTMATRIX, Laya.Shader3D.PERIOD_CAMERA],
                u_MainColor: [this.MAINCOLOR, Laya.Shader3D.PERIOD_MATERIAL],
                u_MainTexture: [this.MAINTEXTURE, Laya.Shader3D.PERIOD_MATERIAL],
                u_Dist: [this.DIST, Laya.Shader3D.PERIOD_MATERIAL],
                u_QOffset: [this.QOFFSET, Laya.Shader3D.PERIOD_MATERIAL],
                u_FogStart: [this.FOGSTART, Laya.Shader3D.PERIOD_MATERIAL],
                u_FogRange: [this.FOGRANGE, Laya.Shader3D.PERIOD_MATERIAL],
                u_FogStartD: [this.FOGSTARTD, Laya.Shader3D.PERIOD_MATERIAL],
                u_FogRangeD: [this.FOGRANGED, Laya.Shader3D.PERIOD_MATERIAL],
                u_FogColor: [this.FOGCOLOR, Laya.Shader3D.PERIOD_MATERIAL]
            };
           var r:Laya.ShaderCompile3D = Laya.ShaderCompile3D.add(t, "attribute vec4 a_Position;\nuniform mat4 u_MMatrix;\nuniform mat4 u_VMatrix;\nuniform mat4 u_PMatrix;\nuniform float u_Dist;\nuniform vec4 u_QOffset;\n#ifdef MAINMAP\nattribute vec2 a_Texcoord;\nvarying vec2 v_Texcoord;\n#endif\n#ifdef MFOG\nvarying vec4 v_ViewPos;\n#endif\n#ifdef MDEPTHFOG\nvarying vec3 v_PositionWorld;\n#endif\nvoid main(){\n#ifdef MAINMAP\nv_Texcoord = a_Texcoord;\n#endif\n#ifdef MDEPTHFOG\nv_PositionWorld = vec3(u_MMatrix * a_Position);\n#endif\nvec4 vPos =  u_VMatrix * u_MMatrix *a_Position;\nfloat zOff = vPos.z/u_Dist;\nvPos += u_QOffset*zOff*zOff;\n#ifdef MFOG\nv_ViewPos = vPos;\n#endif\ngl_Position = u_PMatrix * vPos;\n}", "#ifdef FSHIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nuniform vec4 u_MainColor;\n#ifdef MFOG\nuniform float u_FogStart;\nuniform float u_FogRange;\nvarying vec4 v_ViewPos;\n#endif\n#ifdef MDEPTHFOG\nuniform float u_FogStartD;\nuniform float u_FogRangeD;\n#endif\n#if defined(MFOG) || defined(MDEPTHFOG)\nuniform vec3 u_FogColor;\nvarying vec3 v_PositionWorld;\n#endif\n#ifdef MAINMAP\nuniform sampler2D u_MainTexture;\nvarying vec2 v_Texcoord;\n#endif\nvoid main(){\nvec4 mainColor = u_MainColor;\n#ifdef MAINMAP\nvec4 texColor = texture2D(u_MainTexture,v_Texcoord);\nmainColor.rgba = mainColor.rgba * texColor.rgba;\n#endif\nvec4 finalColor = mainColor;\n#ifdef MFOG\nfloat toEyeLength = abs(v_ViewPos.z/v_ViewPos.w);\nfloat lerpFact = (toEyeLength-u_FogStart)/u_FogRange;\nlerpFact = clamp(lerpFact,0.0,1.0);\nfinalColor.rgb = mix(finalColor.rgb,u_FogColor.rgb,lerpFact);\n#ifdef MDEPTHFOG\nfloat lerpFacta = ( u_FogStartD - v_PositionWorld.y)/u_FogRangeD;\nlerpFacta = clamp(lerpFacta,0.0,1.0);\nfinalColor.rgb=mix(finalColor.rgb,u_FogColor,lerpFacta);\n#endif\n#endif\ngl_FragColor = finalColor;\n}\n", i, n);
        this.SHADERDEFINE_MAINTMAP = r.registerMaterialDefine("MAINMAP");
        this.SHADERDEFINE_DEPTHFOG = r.registerMaterialDefine("MDEPTHFOG");
        this.SHADERDEFINE_FOG = r.registerMaterialDefine("MFOG");
    }
}
