import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../shared/enums/language.enum';
import { GameSettingsModel } from '../shared/models/game-settings.model';
import { Difficulty } from '../shared/enums/difficulty.enum';
import { MaxScore } from './../shared/enums/max-score.enum';
import { ImgEnum } from '../shared/enums/img-enum.enum';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, AfterContentChecked {
    public languages = Language;
    public username: string;
    public difficulty: string;
    public maxScore: number;
    public difficultyEnum = Difficulty;
    public maxScoreEnum = MaxScore;
    public imgArr = Object.values(ImgEnum);
    public isCheckedBtn: boolean;
    public gameSettings = new GameSettingsModel();

    constructor(private translate: TranslateService,
                private router: Router, private authService: AuthService,
                private changeDetector: ChangeDetectorRef) {
        this.gameSettings = this.authService.gameSettings;
    }

    ngOnInit(): void {
        this.setDefaultSettings();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    private setDefaultSettings(): void {
        this.username = this.gameSettings.username;
        this.maxScore = this.gameSettings.maxScore;
        this.difficulty = this.gameSettings.difficulty;
        if (this.gameSettings.language === this.languages.english) {
            this.isCheckedBtn = true;
        } else {
            this.isCheckedBtn = false;
        }
        this.translate.use(this.gameSettings.language);
    }

    public onSelectLanguage(event: any): void {
        this.gameSettings.language = event.value;
        this.translate.use(event.value);
    }

    public onPickAvatar(img: string): void {
        this.gameSettings.img = img;
    }

    public onStartGame(): void {
        if (this.username) {
            this.gameSettings.username = this.username;
        }
        if (this.difficulty) {
            this.gameSettings.difficulty = this.difficultyEnum[this.difficulty];
        }
        if (this.maxScore) {
            this.gameSettings.maxScore = this.maxScore;
        }
        this.authService.saveAuthInfoToStore(this.gameSettings);
        this.router.navigate(['game']);
    }

}
