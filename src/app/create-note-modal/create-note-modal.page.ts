import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import { Plugins, CameraOptions, CameraResultType } from '@capacitor/core';

@Component({
  selector: 'app-create-note-modal',
  templateUrl: './create-note-modal.page.html',
  styleUrls: ['./create-note-modal.page.scss'],
})
export class CreateNoteModalPage implements OnInit {

  note: any = {};
  @Input() title: any;

  constructor(private toastCtrl: ToastController, private modalCtrl: ModalController, private navParams: NavParams) {

    if(this.navParams) {
      this.note = this.navParams.data;
      console.log(this.note)
    }
  }

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

    delete this.note["modal"];
    console.log(this.note);

    this.modalCtrl.dismiss(this.note);
  }

  async takePhoto() {
    const { Camera } = Plugins;

    let photo = await Camera.getPhoto({
      quality: 50,
      width: 512,
      height: 512,
      resultType: CameraResultType.DataUrl
    });

    this.note.image = photo.dataUrl
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
