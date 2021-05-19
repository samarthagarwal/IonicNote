import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private router: Router, private toastCtrl: ToastController) { }

  async ionViewDidLoad() {
    if(firebase.auth().currentUser != null) {

      let toast = await this.toastCtrl.create({
        message: "Logging you in...",
        duration: 3000
      });
      toast.present();

      this.router.navigate(["/home"]);
    }
  }

  user: any = {};

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  async login() {
    if (this.user.email.length < 7 || this.user.password.length < 6) {
      // stop the user and display a toast
      let toast = await this.toastCtrl.create({
        message: "Email or password is invalid",
        duration: 3000
      });
      toast.present();
      return;
    }

    try {
      let userCredential = await firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
      console.log(userCredential);

      this.router.navigate(["/home"]);

    } catch (ex) {
      console.log(ex);
      let toast = await this.toastCtrl.create({
        message: ex.message,
        duration: 3000
      });
      toast.present();
    }
  }

}
