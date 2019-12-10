import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../shared/enums/language.enum';
import { GameSettingsModel } from '../shared/models/game-settings.model';
import { Difficulty } from '../shared/enums/difficulty.enum';
import { MaxScore } from './../shared/enums/max-score.enum';
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
    public difficultyEnum: typeof Difficulty = Difficulty;
    public maxScoreEnum = MaxScore;
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
        this.difficulty = Difficulty[this.gameSettings.difficulty];
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

    public onPickAvatar(avatar: any): void {
        this.gameSettings.avatar = avatar.target.src;
    }

    public onStartGame(): void {
        if (this.username) {
            this.gameSettings.username = this.username;
        }
        this.gameSettings.difficulty = Difficulty[this.difficulty];
        this.gameSettings.maxScore = this.maxScore;
        this.authService.saveAuthInfoToStore(this.gameSettings);
        this.router.navigate(['game']);
    }

}
