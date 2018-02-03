import { Component, OnInit, Inject } from '@angular/core';
import { NavController, List } from 'ionic-angular';
import { DoctorProvider } from '../../providers/doctor/doctor';

import { DoctordetailPage } from '../doctordetail/doctordetail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  doctor: any;
  doctorErrMess: string;
  constructor(public navCtrl: NavController,
    private doctorservice: DoctorProvider,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    // get docs..
    this.doctorservice.getDoctor()
       .subscribe(doctor => this.doctor = doctor,
        errmess => this.doctorErrMess = <any>errmess );

  }

  doctorSelected(event, doctor) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(DoctordetailPage, {
      doctor: doctor
    });

  }
}