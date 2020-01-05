import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
    selector: 'app-help-sheet',
    templateUrl: './help-sheet.component.html',
    styleUrls: ['./help-sheet.component.css']
})
export class HelpSheetComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<HelpSheetComponent>) { }

    public closePopup(event: MouseEvent) {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}
