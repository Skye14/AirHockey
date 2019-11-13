import { Injectable } from '@angular/core';

import { GameSettingsModel } from './../models/game-settings.model';
import { Language } from '../enums/language.enum';
import { Difficulty } from '../enums/difficulty.enum';
import { MaxScore } from '../enums/max-score.enum';
import { ImgEnum } from '../enums/img-enum.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private key = 'AirHocheyUserSettings';
    private difficulty = Difficulty;
    private maxScore = MaxScore;
    private language = Language;
    private img = ImgEnum;
    private gameSettingsModel: GameSettingsModel = null;

    constructor() {
        this.gameSettingsModel = JSON.parse(localStorage.getItem(this.key));
    }

    private setDefaultGameSettings(): GameSettingsModel {
        this.gameSettingsModel = new GameSettingsModel();
        this.gameSettingsModel.username = 'Gamer';
        this.gameSettingsModel.language = this.language.english;
        this.gameSettingsModel.difficulty = this.difficulty.normal;
        this.gameSettingsModel.maxScore = this.maxScore.score20;
        this.gameSettingsModel.img = this.img.img1;
        return this.gameSettingsModel;
    }

    public saveAuthInfoToStore(gameSettings: GameSettingsModel): void {
        localStorage.setItem(this.key, JSON.stringify(gameSettings));
        this.gameSettingsModel = gameSettings;
    }

    public get gameSettings(): GameSettingsModel {
        return this.gameSettingsModel !== null ? this.gameSettingsModel : this.setDefaultGameSettings();
    }

    public deleteGameSettings(): void {
        this.gameSettingsModel = null;
        localStorage.removeItem(this.key);
    }

}
