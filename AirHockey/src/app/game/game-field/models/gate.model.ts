export class Gate {
    static extraSpeed = 35;
    static extraStep = 15;
    public step = 8;
    public speed = 27;
    public width = 12;
    public height: number;
    public positionY: number;

    constructor(height: number) {
        this.height = height;
    }
}
