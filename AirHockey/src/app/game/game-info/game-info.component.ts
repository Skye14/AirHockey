import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material';

import { AuthService } from './../../shared/services/auth.service';
import { GameSettingsModel } from 'src/app/shared/models/game-settings.model';
import { GameService } from './../services/game.service';
import { Score } from './models/score.model';
import { HelpSheetComponent } from './help-sheet/help-sheet.component';
import { VictoryOrLossComponent } from './victory-or-loss/victory-or-loss.component';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';

@Component({
    selector: 'app-game-info',
    animations: [
        trigger('bounceAnimate', [
            transition('start <=> end', [
                animate('300ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,0,0)', fontSize: '20px', color: '#8a8a8a' }),
                    style({ transform: 'translate3d(0,-3px,0)', fontSize: '27px', color: '#ffffff' }),
                    style({ transform: 'translate3d(0,0,0)', fontSize: '20px', color: '#8a8a8a' }),
                ]))
            ])
        ]),
    ],
    templateUrl: './game-info.component.html',
    styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent implements OnInit, OnDestroy {
    private startGame = false;
    private interval;
    private keyCodeSpace = 32;
    private isPopupHelpOpen = false;
    private isVictoryOrLossPopup = false;
    private subscription: Subscription;
    public isPause = false;
    public gameSettings: GameSettingsModel;
    public score: Score;
    public animateForGateRight = true;
    public animateForGateLeft = true;

    constructor(private router: Router,
                private authService: AuthService,
                private gameService: GameService,
                private popup: MatDialog,
                private bottomSheetPopup: MatBottomSheet) {
        this.gameSettings = this.authService.gameSettings;
    }

    ngOnInit(): void {
        this.eventHandlerStartOrPause();
        this.checkGameScore();
        if (!this.gameSettings.isInitialHelpSheet) {
            this.gameSettings.isInitialHelpSheet = true;
            this.bottomSheetPopup.open(HelpSheetComponent);
        }
    }

    private checkGameScore(): void {
        this.score = new Score();
        let scoreR = this.score.rightGate;
        let scoreL = this.score.leftGate;
        this.interval = setInterval(() => {
            if (this.score.rightGate !== this.gameSettings.maxScore && this.score.leftGate !== this.gameSettings.maxScore) {
                this.score = this.gameService.getScore(this.gameSettings.maxScore);
                if (scoreR !== this.score.rightGate) {
                    scoreR = this.score.rightGate;
                    this.animateForGateRight = !this.animateForGateRight;
                } else if (scoreL !== this.score.leftGate) {
                    scoreL = this.score.leftGate;
                    this.animateForGateLeft = !this.animateForGateLeft;
                }
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
        this.isVictoryOrLossPopup = !this.isVictoryOrLossPopup;

        popup.afterClosed().subscribe(() => {
            this.score = this.gameService.getScore(this.gameSettings.maxScore);
            this.isVictoryOrLossPopup = !this.isVictoryOrLossPopup;
            this.checkGameScore();
        });
    }

    public openHelpSheet(): void {
        if (this.isPause && this.startGame) {
            this.isPause = !this.isPause;
            this.gameService.pauseGame(this.startGame, this.isPause);
        }
        this.bottomSheetPopup.open(HelpSheetComponent);
        this.isPopupHelpOpen = !this.isPopupHelpOpen;
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
            if (event.keyCode === this.keyCodeSpace && !this.isPopupHelpOpen && !this.isVictoryOrLossPopup) {
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
