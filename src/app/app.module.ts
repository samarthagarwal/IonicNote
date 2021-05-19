import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import firebase from 'firebase/app';

firebase.initializeApp({
  apiKey: "AIzaSyCzVhW0SGy61F1ja0Oa_RYungAbgc2Mbuk",
  authDomain: "ionicnote-ac17d.firebaseapp.com",
  projectId: "ionicnote-ac17d",
  storageBucket: "ionicnote-ac17d.appspot.com",
  messagingSenderId: "256571791550",
  appId: "1:256571791550:web:3b7cf4b25827479e5026ef"
});

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
