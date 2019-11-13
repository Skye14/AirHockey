import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from './base/base.component';
import { GameComponent } from './game/game.component';


const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: 'game', component: GameComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
