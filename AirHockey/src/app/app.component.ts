import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './shared/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private translate: TranslateService, private authService: AuthService) {
        const settings = this.authService.gameSettings;
        this.translate.use(settings.language);
    }
}
