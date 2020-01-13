import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GameSettingsModel } from 'src/app/shared/models/game-settings.model';

@Component({
    selector: 'app-victory-or-loss',
    templateUrl: './victory-or-loss.component.html',
    styleUrls: ['./victory-or-loss.component.css']
})
export class VictoryOrLossComponent implements OnInit {
    public isVictory: boolean;
    public gameSettings: GameSettingsModel;

    constructor(private gameService: GameService, private authService: AuthService) {
        this.gameSettings = this.authService.gameSettings;
    }

    ngOnInit() {
        this.isVictory = this.gameService.isVictory;
    }

}
