import { Injectable } from '@angular/core';

import { GameSettingsModel } from './../models/game-settings.model';
import { Language } from '../enums/language.enum';
import { Difficulty } from '../enums/difficulty.enum';
import { MaxScore } from '../enums/max-score.enum';
import { avatar1 } from '../const/avatar';
import { FieldSizesEnum } from './../../game/game-field/enums/field-sizes-enum.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private key = 'AirHocheyUserSettings';
    private gameSettingsModel: GameSettingsModel = null;

    constructor() {
        this.gameSettingsModel = JSON.parse(localStorage.getItem(this.key));
    }

    private setDefaultGameSettings(): GameSettingsModel {
        this.gameSettingsModel = new GameSettingsModel();
        this.gameSettingsModel.username = 'Gamer';
        this.gameSettingsModel.language = Language.english;
        this.gameSettingsModel.difficulty = Difficulty.normal;
        this.gameSettingsModel.maxScore = MaxScore.score20;
        this.gameSettingsModel.avatar = avatar1;
        this.gameSettingsModel.fieldSize = FieldSizesEnum.small;
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
