import { Injectable } from '@angular/core';

import { Gate } from '../game-field/models/gate.model';
import { Field } from '../game-field/models/field.model';
import { Ball } from '../game-field/models/ball.model';
import { GateDirectionEnum } from '../game-field/enums/gate-direction-enum.enum';
import { Score } from '../game-info/models/score.model';
import { GameFactory } from './../game-field/game-factory/game-factory';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private gateLeft: Gate;
    private gateRight: Gate;
    private field: Field;
    private ball: Ball;
    private gateDirection = GateDirectionEnum;
    private startGame = false;
    private isPause = false;
    private score = new Score();
    private gameFactory = new GameFactory();
    public isVictory = false;

    constructor() {
    }

    public pauseGame(startGame: boolean, isPause: boolean): void {
        this.isPause = isPause;
        this.startGame = startGame;
    }

    public createField(fieldSize: number): Field {
        this.field = this.gameFactory.createField(fieldSize);
        return this.field;
    }

    public createGateLeft(): Gate {
        this.gateLeft = this.gameFactory.createGate();
        return this.gateLeft;
    }

    public createGateRight(): Gate {
        this.gateRight = this.gameFactory.createGate();
        return this.gateRight;
    }

    public createBall(): Ball {
        this.ball = this.gameFactory.createBall();
        this.ball.setStep();
        return this.ball;
    }

    private restartPositionOfBall(): void {
        this.ball.positionY = (this.field.height / 2) - (this.ball.height / 2);
        this.ball.positionX = (this.field.width / 2) - (this.ball.width / 2);
        this.ball.changeStep();
    }

    public getScore(maxScore: number): Score {
        if (this.score.rightGate > maxScore || this.score.leftGate > maxScore) {
            this.endGame();
        }
        return this.score;
    }

    public getPositionGateLeft(direction: string): number {
        if (direction === this.gateDirection.keyDown) {
            this.gateLeft.positionY += this.gateLeft.step;
            this.checkBordersForGate(this.gateLeft);
        } else if (direction === this.gateDirection.keyUp) {
            this.gateLeft.positionY -= this.gateLeft.step;
            this.checkBordersForGate(this.gateLeft);
        }
        return this.gateLeft.positionY;
    }

    public moveBall(): Ball {
        const posX = this.ball.positionX;
        const posY = this.ball.positionY;

        if (this.startGame && this.isPause) {
            this.ball.positionX += this.ball.stepX;
            this.ball.positionY += this.ball.stepY;
            if (this.ball.positionY >= (this.field.height - this.ball.width)) {
                this.ball.positionY += this.ball.stepY;
                this.ball.positionY = posY;
                this.ball.stepY = -this.ball.stepY;
            } else if ((this.ball.positionY - this.ball.width) <= 0) {
                this.ball.positionY -= this.ball.stepY;
                this.ball.positionY = posY;
                this.ball.stepY = -this.ball.stepY;
            } else if (this.ball.positionX - this.ball.width <= this.gateLeft.width) {
                this.changeAngleOfBall(posX, this.gateLeft);
            } else if (this.ball.positionX + this.ball.width > (this.field.width - this.gateRight.width)) {
                this.changeAngleOfBall(posX, this.gateRight);
            }
        }
        return this.ball;
    }

    private changeAngleOfBall(posX: number, gate: Gate): void {
        const ballCenterPosY = this.ball.positionY - this.ball.height / 2;
        gate.startOfGate = gate.positionY - this.ball.height;
        gate.endOfGate = gate.positionY + gate.height;
        const partOfGate = (gate.endOfGate - gate.startOfGate) / 5;
        const gatePart1 = gate.startOfGate + partOfGate;
        const gatePart2 = gatePart1 + partOfGate;
        const gatePart3 = gatePart2 + partOfGate;
        const gatePart4 = gatePart3 + partOfGate;

        if (this.ball.positionY > gate.startOfGate && (this.ball.positionY - this.ball.width) < gate.endOfGate) {
            if (this.ball.positionX - this.ball.width <= gate.width) {
                this.increasePositionXOfBall(posX);
            } else if (this.ball.positionX + (this.ball.width / 2) >= (this.field.width - gate.width)) {
                this.reducePositionXOfBall(posX);
            }
            if (ballCenterPosY > gate.startOfGate && ballCenterPosY < gatePart1) {
                this.ball.stepY = -this.ball.acuteAngle;
                this.ball.stepX = this.getCurrentStepXOfBall(this.ball.angleOf45Degrees);
            } else if (ballCenterPosY > gatePart1 && ballCenterPosY < gatePart2) {
                this.ball.stepY = -this.ball.angleOf45Degrees;
                this.ball.stepX = this.getCurrentStepXOfBall(this.ball.acuteAngle);
            } else if (ballCenterPosY > gatePart2 && ballCenterPosY < gatePart3) {
                if (this.ball.positionX < this.field.width / 2) {
                    this.ball.stepY = Math.abs(this.ball.rightAngle);
                    this.ball.stepX = Math.abs(this.ball.rightAngle);
                } else {
                    this.ball.stepY = Math.abs(this.ball.rightAngle);
                    this.ball.stepX = -this.ball.rightAngle;
                }
            } else if (ballCenterPosY > gatePart3 && ballCenterPosY < gatePart4) {
                this.ball.stepY = this.ball.angleOf45Degrees;
                this.ball.stepX = this.getCurrentStepXOfBall(this.ball.acuteAngle);
            } else if (this.ball.positionY - this.ball.height / 2 > gatePart4) {
                this.ball.stepY = this.ball.acuteAngle;
                this.ball.stepX = this.getCurrentStepXOfBall(this.ball.angleOf45Degrees);
            }
        } else if ((this.ball.positionX - this.ball.width) < 0) {
            this.score.rightGate++;
            this.restartPositionOfBall();
        } else if ((this.ball.positionX + this.ball.width / 2) > this.field.width) {
            this.score.leftGate++;
            this.ball.positionX = this.field.width;
            this.restartPositionOfBall();
        }
    }



    private getCurrentStepXOfBall(extraStep: number): number {
        let stepX: number;
        if (this.ball.stepX > 0) {
            stepX = Math.abs(this.ball.rightAngle) + extraStep;
        } else {
            stepX = this.ball.rightAngle - extraStep;
        }
        return stepX;
    }

    private reducePositionXOfBall(posX: number): void {
        this.ball.positionX -= this.ball.stepX;
        this.ball.positionX = posX;
        this.ball.stepX = -this.ball.stepX;
    }

    private increasePositionXOfBall(posX: number): void {
        this.ball.positionX += this.ball.stepX;
        this.ball.positionX = posX;
        this.ball.stepX = -this.ball.stepX;
    }

    public getPositionGateRight(): Gate {
        const gateLength = this.gateRight.positionY + this.gateRight.height;
        if (this.startGame && this.isPause && this.ball.stepX === Math.abs(this.ball.stepX)) {
            if (this.ball.positionX > this.field.width / 2) {
                if (this.ball.positionY <= this.gateRight.positionY) {
                    if (this.ball.positionY !== this.gateRight.positionY || this.ball.positionY > (gateLength)) {
                        this.gateRight.positionY -= this.gateRight.step;
                    }
                } else if (this.ball.positionY >= (this.gateRight.positionY + this.gateRight.height)) {
                    if (this.ball.positionY !== this.gateRight.positionY || this.ball.positionY > (gateLength)) {
                        this.gateRight.positionY += this.gateRight.step;
                    }
                }
            }
        }
        this.checkBordersForGate(this.gateRight);
        return this.gateRight;
    }

    public getSmartGateRight(): Gate {
        const gateLength = this.gateRight.positionY + this.gateRight.height;
        const centralPositionOfGate = (this.field.height - this.gateRight.height) / 2;
        if (this.startGame && this.isPause && this.ball.stepX === Math.abs(this.ball.stepX)) {
            if (this.ball.positionX > this.field.width / 2) {
                if (this.ball.positionY <= this.gateRight.positionY) {
                    if (this.ball.positionY !== this.gateRight.positionY || this.ball.positionY > (gateLength)) {
                        this.gateRight.positionY -= this.gateRight.step;
                    }
                } else if (this.ball.positionY >= (this.gateRight.positionY + this.gateRight.height)) {
                    if (this.ball.positionY !== this.gateRight.positionY || this.ball.positionY > (gateLength)) {
                        this.gateRight.positionY += this.gateRight.step;
                    }
                }
            }
        } else if (this.ball.stepX < 0) {
            if (this.gateRight.positionY < centralPositionOfGate) {
                this.gateRight.positionY += this.gateRight.step;
            } else if (this.gateRight.positionY > centralPositionOfGate) {
                this.gateRight.positionY -= this.gateRight.step;
            }
            this.checkBordersForGate(this.gateRight);
        }
        return this.gateRight;
    }

    private checkBordersForGate(gate: Gate): void {
        if (gate.positionY > (this.field.height - gate.height)) {
            gate.positionY = this.field.height - gate.height;
        } else if (gate.positionY < 0) {
            gate.positionY = 0;
        }
    }

    public endGame(): void {
        this.score = new Score();
        this.gateLeft.positionY = (this.field.height - this.gateLeft.height) / 2;
        this.gateRight.positionY = (this.field.height - this.gateRight.height) / 2;
    }

}
