import { Component } from '@angular/core';

import { MatToolbar, MatToolbarRow, MatList, MatListItem } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {MatDialog} from '@angular/material';

import { MedicineComponent } from './medicine/medicine.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  doctor = "temp1";
  BASE_URL = "http://localhost:3000";

  messages = [{
    from: "456",
    subject:"4585",
    content: "121234"
  }];

  medicines: any;

  allData: Array<any> = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.getAppointments();
  }

  openDialog(user): void {
    let dialogRef = this.dialog.open(MedicineComponent, {
      width: '90%',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.medicines = result;
    });
  }

  getAppointments(){
    this.http.get(this.BASE_URL+"/doctors/"+this.doctor)
    .subscribe((data) => {
      console.log(data);
      data['appointments'].forEach(element => {
        this.getUserDetail(element["uid"])
        .subscribe((user) => {
          this.allData.push({
            "date": element['date'],
            "detail": user
          });
          // this.allData["date"] = element['date'];
          // this.allData["detail"] = user;
        });
      });
      
    },
  (err) => {console.log(err);},
  () => {console.log(this.allData);})
  }

  getUserDetail(user: string) {
    return this.http.get(this.BASE_URL+"/users/"+user)
  }

}
