import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
// import { LocalNotifications } from '@ionic-native/local-notifications';
// import { EmailComposer } from '@ionic-native/email-composer';
// import { SocialSharing } from '@ionic-native/social-sharing';
// import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
// import { CallNumber } from '@ionic-native/call-number';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AppointmentPage } from '../pages/appointment/appointment';
import { LoginPage } from '../pages/login/login';
import { DoctordetailPage } from '../pages/doctordetail/doctordetail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DoctorProvider } from '../providers/doctor/doctor';
// import { LeaderProvider } from '../providers/leader/leader';
// import { PromotionProvider } from '../providers/promotion/promotion';
import { ProcessHttpmsgProvider } from '../providers/process-httpmsg/process-httpmsg';

import { baseURL } from '../shared/baseurl';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AppointmentPage,
    LoginPage,
    DoctordetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AppointmentPage,
    DoctordetailPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DoctorProvider,
    ProcessHttpmsgProvider,
    // LocalNotifications,
    // EmailComposer,
    // Camera,
    Network,
    // CallNumber,
    // SocialSharing,
    { provide: 'BaseURL', useValue: baseURL },
  ]
})
export class AppModule {}
