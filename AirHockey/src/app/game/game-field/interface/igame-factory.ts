import { Field } from '../models/field.model';
import { Gate } from '../models/gate.model';
import { Ball } from '../models/ball.model';

export interface IgameFactory {
    createField(fieldSize: number): Field;
    createGate(): Gate;
    createBall(): Ball;
}
