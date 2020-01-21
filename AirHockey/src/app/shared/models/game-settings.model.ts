import { MaxScore } from './../enums/max-score.enum';
import { Difficulty } from './../enums/difficulty.enum';
import { Language } from '../enums/language.enum';
import { FieldSizesEnum } from './../../game/game-field/enums/field-sizes-enum.enum';

export class GameSettingsModel {
    public language: Language;
    public username: string;
    public avatar: string;
    public difficulty: Difficulty;
    public maxScore: MaxScore;
    public fieldSize: FieldSizesEnum;
    public isInitialHelp: boolean;
}

