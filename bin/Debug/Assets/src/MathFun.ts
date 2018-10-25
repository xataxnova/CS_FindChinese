import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class MathFun{
    constructor(){

    }

    static limit(a:number, b:number, input:number){
        var min = Math.min(input, b);
        var max = Math.max(a, min);
        return max;
    }
}
