export class Gate {
    static extraSpeed = 35;
    static extraStep = 15;
    public step = 7;
    public speed = 27;
    public width = 10;
    public height: number;
    public positionY: number;
    public startOfGate: number;
    public endOfGate: number;

    constructor(height: number) {
        this.height = height;
    }
}
