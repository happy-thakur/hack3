import { Component, OnInit, Inject } from '@angular/core';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {

  BASE_URL = "http://localhost:3000/";
  // prescribeForm: FormGroup;

  presData: Array<any> = [];
  count =  [1];

  constructor(
    public dialogRef: MatDialogRef<MedicineComponent>,
    // private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
      // this.createForm;
     }

  ngOnInit() {
  }


  // createForm() {
  //   this.prescribeForm = this.fb.group({
  //     firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
  //     lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
  //     telnum: ['', [Validators.required, Validators.pattern] ],
  //     email: ['', [Validators.required, Validators.email] ],
  //     agree: false,
  //     contacttype: 'None',
  //     message: ''
  //   });
  // }

  addMore(med, qty) {
    if(med.value != "" && qty.value != 0)
    this.presData.push({
      "med": med.value,
      "quantity": qty.value
    });
    if(med.value != "" && qty.value != 0)
    this.count.push(1);
    console.log(med);
    console.log(qty);
    console.log("adding one");
  }

  submit(med, qty) {
    console.log("submited");
    if(this.presData.length != this.count.length){
      if(med && qty && med.value != "" && qty.value != 0)
        this.presData.push({
          "med": med.value,
          "quantity": qty.value
        });
    }
    console.log(this.presData);    
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
