import { MaxScore } from './../enums/max-score.enum';
import { Difficulty } from './../enums/difficulty.enum';
import { Language } from '../enums/language.enum';

export class GameSettingsModel {
    public language: Language;
    public username: string;
    public avatar: string;
    public difficulty: Difficulty;
    public maxScore: MaxScore;
}

