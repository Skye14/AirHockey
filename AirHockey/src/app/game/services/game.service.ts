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
        const lowerGateLeftPosY = this.gateLeft.positionY + this.gateLeft.height;
        const lowerGateRightPosY = this.gateRight.positionY + this.gateRight.height;
        const lowerBallPosY = this.ball.positionY + this.ball.height / 2;
        const topBallPosY = this.ball.positionY - this.ball.height;
        this.ball.positionY = this.ball.positionY;

        if (this.startGame && this.isPause) {
            this.ball.positionX += this.ball.stepX;
            this.ball.positionY += this.ball.stepY;
            if (this.ball.positionY >= (this.field.height - this.ball.width)) {
                this.increasePositionYOfBall(posY);
            } else if ((this.ball.positionY - this.ball.width) <= 0) {
                this.reducePositionYOfBall(posY);
            } else if (this.ball.positionX <= 0) {
                this.score.rightGate++;
                this.restartPositionOfBall();
            } else if (this.ball.positionX - this.ball.width <= this.gateLeft.width) {
                if (lowerBallPosY >= Math.ceil(this.gateLeft.positionY) && topBallPosY <= lowerGateLeftPosY) {
                    this.changeAngleOfBallForGate(this.gateLeft);
                    this.increasePositionXOfBall(posX);
                }
            } else if (this.ball.positionX >= this.field.width) {
                this.score.leftGate++;
                this.restartPositionOfBall();
            } else if (this.ball.positionX + this.ball.width >= this.field.width - this.gateRight.width) {
                if (lowerBallPosY >= Math.ceil(this.gateRight.positionY) && topBallPosY <= lowerGateRightPosY) {
                    this.changeAngleOfBallForGate(this.gateRight);
                    this.reducePositionXOfBall(posX);
                }
            }
        }
        return this.ball;
    }

    private changeAngleOfBallForGate(gate: Gate): void {
        this.ball.positionY = Math.ceil(this.ball.positionY);
        const lowerGatePosY = Math.ceil(gate.positionY + gate.height);
        const gateCenter = Math.ceil(lowerGatePosY - (gate.height / 2));
        const angle = 2 / (gate.height / 2);

        for (let x = Math.ceil(gate.positionY); x <= lowerGatePosY; x++) {
            if (this.ball.positionY < gateCenter) {
                let alteredAngle = 2;
                for (let y = Math.ceil(gate.positionY); y < gateCenter; y++) {
                    alteredAngle -= angle;
                    if (this.ball.positionY === y) {
                        this.changeOfDirectionInStepY(alteredAngle);
                    }
                }
                break;
            } else if (this.ball.positionY === gateCenter) {
                this.ball.stepY = 0;
                break;
            } else if (this.ball.positionY > gateCenter) {
                let alteredAngle = 0;
                for (let i = gateCenter; i < lowerGatePosY; i++) {
                    alteredAngle -= angle;
                    if (this.ball.positionY === i) {
                        this.changeOfDirectionInStepY(alteredAngle);
                    }
                }
                break;
            }
        }
        if (this.ball.positionY <= gate.positionY) {
            this.ball.stepY = -2;
        }
        if (this.ball.positionY >= lowerGatePosY) {
            this.ball.stepY = 2;
        }
    }

    private changeOfDirectionInStepY(angle: number): void {
        if (this.ball.stepY > 0 && angle < 0) {
            this.ball.stepY = Math.abs(angle);
        } else if (this.ball.stepY < 0 && angle > 0) {
            this.ball.stepY = -angle;
        } else {
            this.ball.stepY = angle;
        }
    }

    private reducePositionXOfBall(posX: number): void {
        if (Math.abs(this.ball.stepY) < 1.2) {
            this.ball.stepX = 2.5;
        } else {
            this.ball.stepX = 2;
        }
        this.ball.positionX -= this.ball.stepX;
        this.ball.positionX = posX;
        this.ball.stepX = -this.ball.stepX;
    }

    private reducePositionYOfBall(posY: number): void {
        this.ball.positionY -= this.ball.stepY;
        this.ball.positionY = posY;
        this.ball.stepY = -this.ball.stepY;
    }

    private increasePositionXOfBall(posX: number): void {
        if (Math.abs(this.ball.stepY) < 1.2) {
            this.ball.stepX = -2.5;
        } else {
            this.ball.stepX = -2;
        }
        this.ball.positionX += this.ball.stepX;
        this.ball.positionX = posX;
        this.ball.stepX = -this.ball.stepX;
    }

    private increasePositionYOfBall(posY: number): void {
        this.ball.positionY += this.ball.stepY;
        this.ball.positionY = posY;
        this.ball.stepY = -this.ball.stepY;
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
