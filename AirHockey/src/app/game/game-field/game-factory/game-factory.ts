import { IgameFactory } from '../interface/igame-factory';
import { Field } from '../models/field.model';
import { Gate } from '../models/gate.model';
import { Ball } from '../models/ball.model';
import { smallFieldSize, mediumFieldSize, largeFieldSize } from '../const/fields-size';
import { FieldSizesEnum } from '../enums/field-sizes-enum.enum';

export class GameFactory implements IgameFactory {
    private field: Field;
    private gate: Gate;

    public createField(fieldSize: number): Field {
        if (fieldSize === FieldSizesEnum.small) {
            this.field = new Field(smallFieldSize.width, smallFieldSize.height);
        } else if (fieldSize === FieldSizesEnum.medium) {
            this.field = new Field(mediumFieldSize.width, mediumFieldSize.height);
        } else if (fieldSize === FieldSizesEnum.large) {
            this.field = new Field(largeFieldSize.width, largeFieldSize.height);
        }
        return this.field;
    }

    public createGate(): Gate {
        const gateHeight = Math.round(this.field.height / 4);
        this.gate = new Gate(gateHeight);
        if (this.field.width === largeFieldSize.width) {
            this.gate.width = 13;
        }
        this.gate.positionY = (this.field.height - this.gate.height) / 2;
        return this.gate;
    }

    public createBall(): Ball {
        let ballHeight = this.gate.height / 8;
        if (this.field.width === largeFieldSize.width) {
            ballHeight = this.gate.height / 9;
        }
        const ball = new Ball(ballHeight);
        ball.positionY = (this.field.height / 2) - (ball.height / 2);
        ball.positionX = (this.field.width / 2) - (ball.width / 2);
        return ball;
    }

}
