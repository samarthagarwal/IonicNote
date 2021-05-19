import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-note-modal',
  templateUrl: './create-note-modal.page.html',
  styleUrls: ['./create-note-modal.page.scss'],
})
export class CreateNoteModalPage implements OnInit {

  note: any = {};

  constructor(private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async saveNote() {
    if(!this.note.title || !this.note.description || this.note.title.length < 5 || this.note.description.length < 5) {
      (await this.toastCtrl.create({
        message: "Please enter title and description",
        duration: 3000
      })).present();

      return;
    }

    console.log(this.note);

    this.modalCtrl.dismiss(this.note);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
