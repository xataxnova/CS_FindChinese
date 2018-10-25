import { language }from "./Localize/LoadLocalizationFile"
/*
* name;
*/
class AudioController {
    static me: AudioController;
    soundChannel: Laya.SoundChannel;
    constructor() {
        AudioController.me = this;
        this.isOff = false;
    }

    private isOff: boolean;

    public setOnOff(on: boolean) {
        this.isOff = on;

        if (!this.isOff) {
            Laya.SoundManager.stopMusic();
        } else {
            this.soundChannel = Laya.SoundManager.playMusic('audio/bg.mp3', 0);
        }

        Laya.LocalStorage.setItem('3dball_sound', on ? '1' : '0');
    }

    //初始化音乐。如果没有设置过，则默认不播放，如果设置过，则按照它执行
    public initMusic() {
        if (this.isMusicEnable()) {
            this.soundChannel = Laya.SoundManager.playMusic('audio/bg.mp3', 0);
        } else {
            Laya.LocalStorage.setItem('3dball_sound', '0');
        }
    }

    public isMusicEnable(): boolean {
        var v = Laya.LocalStorage.getItem('3dball_sound');
        if (v == '0') {//设置过播放
            return false;
        }
        return true;
    }

    public pauseMusic() {
        if (this.isMusicEnable()) {
            this.soundChannel.pause();
        }
    }

    public resumeMusic() {
        if (this.isMusicEnable()) {
            this.soundChannel.resume();
        }
    }
}
