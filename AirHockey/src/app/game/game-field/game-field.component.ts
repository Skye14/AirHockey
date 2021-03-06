import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';

import { Field } from './models/field.model';
import { Gate } from './models/gate.model';
import { Ball } from './models/ball.model';
import { GateDirectionEnum } from './enums/gate-direction-enum.enum';
import { GameService } from '../services/game.service';
import { GameSettingsModel } from 'src/app/shared/models/game-settings.model';
import { AuthService } from './../../shared/services/auth.service';
import { Difficulty } from './../../shared/enums/difficulty.enum';
import { SpeedOfBallEnum } from './enums/speed-of-ball-enum.enum';
import { FieldSizesEnum } from './enums/field-sizes-enum.enum';

@Component({
    selector: 'app-game-field',
    templateUrl: './game-field.component.html',
    styleUrls: ['./game-field.component.css'],
    animations: [
        trigger('redFieldShadow', [
            transition('start <=> end', [
                animate('300ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,0,0)', boxShadow: ' 0 0 5px 3px rgb(139, 8, 8)' }),
                    style({ transform: 'translate3d(0,0,0)', boxShadow: 'none' }),
                ]))
            ])
        ]),
        trigger('greenFieldShadow', [
            transition('start <=> end', [
                animate('300ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,0,0)', boxShadow: ' 0 0 5px 4px rgb(6, 221, 6)' }),
                    style({ transform: 'translate3d(0,0,0)', boxShadow: 'none' }),
                ]))
            ])
        ])
    ],
})
export class GameFieldComponent implements OnInit, OnDestroy {
    @ViewChild('canvas', { static: true })
    private canvas: ElementRef<HTMLCanvasElement>;
    private contextCanvas: CanvasRenderingContext2D;
    private subscription: Subscription;
    private intervalBall;
    private intervalGate;
    private keyCodeDown = 83;
    private keyCodeUp = 87;
    private gateDirection = GateDirectionEnum;
    private isPressW = false;
    private keyCode: number;
    private gateLeft: Gate;
    private gateRight: Gate;
    private ball: Ball;
    private speedOfBall = SpeedOfBallEnum;
    public gameSettings: GameSettingsModel;
    public field: Field;
    public fieldSizesEnum: typeof FieldSizesEnum = FieldSizesEnum;
    public animateForGateRight = true;
    public animateForGateLeft = true;
    public isCheckedHelps = false;
    public isPause = false;
    public startGame = false;

    constructor(private gameService: GameService, private authService: AuthService) {
        this.gameSettings = this.authService.gameSettings;
        this.field = this.gameService.createField(this.gameSettings.fieldSize);
        this.gateLeft = this.gameService.createGateLeft();
        this.gateRight = this.gameService.createGateRight();
        this.ball = this.gameService.createBall();
    }

    public ngOnInit(): void {
        this.contextCanvas = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        this.regulateDifficultyOfGame();
        this.setSpeedOfBallForBigField();
        this.moveBall();
        this.changePositionOfGates();

    }

    private draw(): void {
        this.contextCanvas.clearRect(0, 0, this.field.width, this.field.height);

        this.contextCanvas.strokeStyle = 'rgba(33, 180, 226, 1)';
        this.contextCanvas.strokeRect(0, 0, this.field.width, this.field.height);

        this.contextCanvas.fillStyle = '#161616';
        this.contextCanvas.fillRect(0, this.gateLeft.positionY, this.gateLeft.width, this.gateLeft.height);

        this.contextCanvas.fillStyle = '#161616';
        const positionXGateRight = this.field.width - this.gateRight.width;
        this.contextCanvas.fillRect(positionXGateRight, this.gateRight.positionY, this.gateRight.width, this.gateRight.height);

        this.contextCanvas.beginPath();
        this.contextCanvas.fillStyle = '#161616';
        this.contextCanvas.arc(this.ball.positionX, this.ball.positionY, this.ball.width, 0, 2 * Math.PI, true);
        this.contextCanvas.fill();
        this.contextCanvas.closePath();
    }

    private checkAnimationForField(): void {
        if (this.gameService.goalForGateRight) {
            this.animateForGateRight = !this.animateForGateRight;
        } else if (this.gameService.goalForGateLeft) {
            this.animateForGateLeft = ! this.animateForGateLeft;
        }
    }

    public getFieldSize(event: any): void {
        this.gameSettings.fieldSize = event.value;
        this.authService.saveAuthInfoToStore(this.gameSettings);

        this.field = this.gameService.createField(event.value);
        this.gateLeft = this.gameService.createGateLeft();
        this.gateRight = this.gameService.createGateRight();
        this.ball = this.gameService.createBall();
    }

    private regulateDifficultyOfGame(): void {
        switch (this.gameSettings.difficulty) {
            case Difficulty.easy:
                this.ball.speed = this.speedOfBall.easy;
                break;
            case Difficulty.normal:
                this.ball.speed = this.speedOfBall.normal;
                break;
            case Difficulty.hard:
                this.ball.speed = this.speedOfBall.hard;
                break;
            case Difficulty.hardcore:
                this.ball.speed = this.speedOfBall.hardcore;
                this.gateRight.speed = Gate.extraSpeed;
                this.gateLeft.step = Gate.extraStep;
                break;
        }
    }

    private setSpeedOfBallForBigField(): void {
        if (this.gameSettings.fieldSize === this.fieldSizesEnum.large) {
            if (this.gameSettings.difficulty === Difficulty.hard) {
                this.ball.speed = this.speedOfBall.hardSpeedForBigField;
            } else if (this.gameSettings.difficulty === Difficulty.hardcore) {
                this.ball.speed = this.speedOfBall.hardcoreSpeedForBigField;
            }
        }
    }

    private moveBall(): void {
        this.intervalBall = setInterval(() => {
            this.ball = this.gameService.moveBall();
            this.draw();
            this.checkAnimationForField();
            this.isCheckedHelps = this.gameService.isCheckedHelps;
            this.isPause = this.gameService.isPause;
            this.startGame = this.gameService.startGame;
        }, this.ball.speed);
    }

    private moveGateDown(): void {
        this.subscription = fromEvent(document, 'keydown').subscribe((event: any) => {
            if (event.keyCode === this.keyCodeDown) {
                this.isPressW = true;
                this.keyCode = event.keyCode;
            } else if (event.keyCode === this.keyCodeUp) {
                this.isPressW = true;
                this.keyCode = event.keyCode;
            }
        });
    }

    private moveGateUp(): void {
        this.subscription = fromEvent(document, 'keyup').subscribe((event: any) => {
            if (event.keyCode === this.keyCodeDown) {
                this.isPressW = false;
            } else if (event.keyCode === this.keyCodeUp) {
                this.isPressW = false;
            }
        });
    }

    private changePositionOfGates(): void {
        this.moveGateDown();
        this.moveGateUp();
        this.intervalGate = setInterval(() => {
            if (this.gameService.startGame && this.gameService.isPause) {
                if (this.gameSettings.difficulty === Difficulty.hardcore) {
                    this.gateRight = this.gameService.getSmartGateRight();
                } else {
                    this.gateRight = this.gameService.getPositionGateRight();
                }
                if (this.isPressW) {
                    if (this.keyCode === this.keyCodeDown) {
                        this.gateLeft.positionY = this.gameService.getPositionGateLeft(this.gateDirection.keyDown);
                    } else if (this.keyCode === this.keyCodeUp) {
                        this.gateLeft.positionY = this.gameService.getPositionGateLeft(this.gateDirection.keyUp);
                    }
                }
            }
        }, this.gateLeft.speed);
    }

    public ngOnDestroy(): void {
        clearInterval(this.intervalBall);
        clearInterval(this.intervalGate);
        this.subscription.unsubscribe();
    }

}
