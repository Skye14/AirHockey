import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, fromEvent } from 'rxjs';

import { AuthService } from './../../shared/services/auth.service';
import { GameSettingsModel } from 'src/app/shared/models/game-settings.model';
import { GameService } from './../services/game.service';
import { Score } from './models/score.model';
import { HelpSheetComponent } from './help-sheet/help-sheet.component';
import { VictoryOrLossComponent } from './victory-or-loss/victory-or-loss.component';

@Component({
    selector: 'app-game-info',
    templateUrl: './game-info.component.html',
    styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent implements OnInit, OnDestroy {
    private startGame = false;
    private interval;
    private keyCodeSpace = 32;
    private isPopupHelpOpen = false;
    private subscription: Subscription;
    public isPause = false;
    public gameSettings: GameSettingsModel;
    public score: Score;

    constructor(private router: Router,
                private authService: AuthService,
                private gameService: GameService,
                private popup: MatDialog) {
        this.gameSettings = this.authService.gameSettings;
    }

    ngOnInit(): void {
        this.eventHandlerStartOrPause();
        this.checkGameScore();
    }

    private checkGameScore(): void {
        this.score = new Score();
        this.interval = setInterval(() => {
            if (this.score.rightGate !== this.gameSettings.maxScore && this.score.leftGate !== this.gameSettings.maxScore) {
                this.score = this.gameService.getScore(this.gameSettings.maxScore);
            } else {
                this.endGame();
                this.openVictoryOrLossPopup();
            }
        }, 0);
    }

    private openVictoryOrLossPopup(): void {
        let popup: any;
        if (this.score.rightGate === this.gameSettings.maxScore) {
            this.gameService.isVictory = false;
            popup = this.popup.open(VictoryOrLossComponent);
        } else if (this.score.leftGate === this.gameSettings.maxScore) {
            this.gameService.isVictory = true;
            popup = this.popup.open(VictoryOrLossComponent);
        }
        popup.afterClosed().subscribe(() => {
            this.score = this.gameService.getScore(this.gameSettings.maxScore);
            this.checkGameScore();
        });
    }

    public openHelpSheet(): void {
        if (this.isPause && this.startGame) {
            this.isPause = !this.isPause;
            this.gameService.pauseGame(this.startGame, this.isPause);
        }
        const popup = this.popup.open(HelpSheetComponent);
        this.isPopupHelpOpen = !this.isPopupHelpOpen;

        popup.afterClosed().subscribe(() => {
            this.isPopupHelpOpen = !this.isPopupHelpOpen;
        });
    }

    public onGetHome(): void {
        this.isPause = false;
        this.startGame = false;
        this.gameService.pauseGame(this.startGame, this.isPause);
        this.gameService.endGame();
        this.router.navigate(['']);
    }

    public onStartPause(): void {
        this.startGame = true;
        this.isPause = !this.isPause;
        this.gameService.pauseGame(this.startGame, this.isPause);
    }

    private eventHandlerStartOrPause(): void {
        this.subscription = fromEvent(document, 'keydown').subscribe((event: any) => {
            if (event.keyCode === this.keyCodeSpace && !this.isPopupHelpOpen) {
                this.startGame = true;
                this.isPause = !this.isPause;
                this.gameService.pauseGame(this.startGame, this.isPause);
                event.preventDefault();
            }
        });
    }

    private endGame(): void {
        this.startGame = false;
        this.isPause = false;
        this.gameService.pauseGame(this.startGame, this.isPause);
        this.gameService.endGame();
        clearInterval(this.interval);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
        this.subscription.unsubscribe();
    }

}
