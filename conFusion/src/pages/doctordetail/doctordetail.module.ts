import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctordetailPage } from './doctordetail';

@NgModule({
  declarations: [
    DoctordetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctordetailPage),
  ],
})
export class DoctordetailPageModule {}
