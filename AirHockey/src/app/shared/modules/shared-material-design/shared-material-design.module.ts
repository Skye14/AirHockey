import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSliderModule,
        MatDialogModule,
        MatIconModule,
        MatCheckboxModule,
        MatBottomSheetModule,
        MatListModule
    ],
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSliderModule,
        MatDialogModule,
        MatIconModule,
        MatCheckboxModule,
        MatBottomSheetModule,
        MatListModule
    ]
})
export class SharedMaterialDesignModule { }
