import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { CreateNoteModalPage } from '../create-note-modal/create-note-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController) {
   console.log(firebase.auth().currentUser);
  }

  async addNote() {
    let modal = await this.modalCtrl.create({
      component: CreateNoteModalPage
    });

    modal.onDidDismiss().then((response) => {
      if(response.data) {
        this.saveNote(response.data);
      }
    })

    modal.present();
  }

  async saveNote(note: any) {
    
    // TODO: upload the image to proper bucket

    // Get the image URL

    await firebase.firestore().collection("Notes").add({
      "title": note.title,
      "description": note.description,
      "created": firebase.firestore.FieldValue.serverTimestamp(),
      "owner": firebase.auth().currentUser.uid,
      "image": "#"
    });

    (await this.toastCtrl.create({
      message: "Note created successfully",
      duration: 3000
    })).present();

  }

}
