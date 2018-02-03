import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController, ToastController} from 'ionic-angular';

import { AppointmentPage } from '../appointment/appointment';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-doctordetail',
  templateUrl: 'doctordetail.html',
})
export class DoctordetailPage {

  map: GoogleMap;


  doctor: any;
  appointmentNo: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private modalCtrl: ModalController,
    private googleMaps: GoogleMaps,
    private toastCtrl: ToastController) {

    this.doctor = navParams.get('doctor');
  }
 
  addAppointment() {
    console.log("appointment added");
    let modal = this.modalCtrl.create(AppointmentPage);
    modal.present();
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
 
   
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }

}
