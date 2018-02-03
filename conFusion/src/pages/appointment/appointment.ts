import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import {Validators, FormBuilder, FormGroup } from '@angular/forms';
 

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html',
})
export class AppointmentPage {
  
  appointment: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder ) {

      this.appointment = this.formBuilder.group({
        name: ['', Validators.required],
        age: [0, Validators.required],
        dateTime: ['', Validators.required],
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationPage');
  }

  onSubmit() {
    console.log(this.appointment.value);
    this.viewCtrl.dismiss();
  }
 
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
