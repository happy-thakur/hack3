import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatToolbarModule, MatListModule, MatProgressSpinnerModule, 
  MatTabsModule, MatCardModule, MatExpansionModule, MatGridListModule, 
  MatFormFieldModule, MatInputModule, MatButtonModule  } from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import 'hammerjs';
import { MedicineComponent } from './medicine/medicine.component';

import {MatDialogModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

// Material 2 
// import { MdCoreModule } from '@angular2-material/core'
// import { MdButtonModule } from '@angular2-material/button';
// import { MdCardModule } from '@angular2-material/card';
// import { MdRadioModule } from '@angular2-material/radio';
// import { MdCheckboxModule } from '@angular2-material/checkbox'
// import { MdTooltipModule } from '@angular2-material/tooltip';
// import { MdSliderModule } from '@angular2-material/slider';
// import { MdToolbarModule,MdToolbarRow } from '@angular2-material/toolbar';



@NgModule({
  declarations: [
    AppComponent,
    MedicineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule, 
    HttpClientModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,  
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    // MatToolbarRow, 
    MatListModule, 
    // MatListItem
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    MedicineComponent
]
})
export class AppModule { }
