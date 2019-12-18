export class Ball {
    public positionX: number;
    public positionY: number;
    public stepX: number;
    public stepY: number;
    public speed: number;
    public width: number;
    public height: number;
    public rightAngle = -2;
    public acuteAngle = 0.5;
    public angleOf45Degrees = 1;

    constructor(height: number) {
        this.height = height;
        this.width = height;
    }

    public setStep(): void {
        this.stepX = -2;
        this.stepY = 2;
    }

    public changeStep(): void {
        this.stepX = this.stepX < 0 ? Math.abs(this.stepX) : -this.stepX;
        this.stepY = this.stepY < 0 ? Math.abs(this.stepY) : -this.stepY;
    }
}
