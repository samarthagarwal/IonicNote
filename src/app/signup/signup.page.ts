import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  user: any = {};

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {
    this.user.email = "";
    this.user.password = "";
    this.user.confirmPassword = "";
  }

  goBackToLogin() {
    this.navCtrl.back();
  }

  async createAccount() {
    if (this.user.email.length < 7 || this.user.password.length < 6 || (this.user.password != this.user.confirmPassword)) {
      // stop the user and display a toast
      let toast = await this.toastCtrl.create({
        message: "Email or password is invalid",
        duration: 3000
      });
      toast.present();
      return;
    }

    try {
      let userCredential = await firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password)
      console.log(userCredential);

      this.navCtrl.navigateRoot("/home");

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
