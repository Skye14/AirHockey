import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-victory-or-loss',
    templateUrl: './victory-or-loss.component.html',
    styleUrls: ['./victory-or-loss.component.css']
})
export class VictoryOrLossComponent implements OnInit {
    public isVictory: boolean;

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.isVictory = this.gameService.isVictory;
    }

}
