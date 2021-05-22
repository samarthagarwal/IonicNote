import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { CreateNoteModalPage } from '../create-note-modal/create-note-modal.page';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  notes: any[] = [];

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private navCtrl: NavController) {
    
  }

  ngOnInit() {
    console.log(firebase.auth().currentUser);
    if (!firebase.auth().currentUser) {
      this.navCtrl.navigateRoot("/login");
    } else {
      this.getNotes();
    }

    this.initializeNotifications();
  }

  async initializeNotifications() {
    const { PushNotifications } = Plugins;

    PushNotifications.addListener("registration", async (token) => {
      await firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
        "token": token.value,
      })
      alert(token.value);
    })

    PushNotifications.addListener("registrationError", async (error) => {
      alert(error);
    })

    // Register with FCM
    let permission = await PushNotifications.requestPermission();
    if(permission.granted) {
      await PushNotifications.register();
    }


  }

  async getNotes() {

    let loading = await this.loadingCtrl.create({
      message: "Getting notes...",
      spinner: "circles"
    });
    loading.present();

    let querySnapshot = await firebase.firestore().collection("Notes")
      .where("owner", "==", firebase.auth().currentUser.uid)
      .orderBy("created", "desc")
      .get();

    this.notes = querySnapshot.docs;

    loading.dismiss();
  }

  async addNote() {
    let modal = await this.modalCtrl.create({
      component: CreateNoteModalPage
    });

    modal.onDidDismiss().then((response) => {
      if (response.data) {
        this.saveNote(response.data);
      }
    })

    modal.present();
  }

  async saveNote(note: any) {

    let loading = await this.toastCtrl.create({
      message: "Creating note, please wait..."
    });
    loading.present();

    // Get the image URL

    let docRef = await firebase.firestore().collection("Notes").add({
      "title": note.title,
      "description": note.description,
      "created": firebase.firestore.FieldValue.serverTimestamp(),
      "owner": firebase.auth().currentUser.uid,
      "image": "#"
    });

    // upload the image to proper bucket

    let storage = firebase.storage().ref();

    // <uid>/<docId.png>
    let reference = storage.child(firebase.auth().currentUser.uid + "/" + (new Date()).toISOString() + "-" + docRef.id + ".png");
    let uploadTask = reference.putString(note.image, firebase.storage.StringFormat.DATA_URL, {
      contentType: 'image/png',
      customMetadata: {
        "title": note.title
      } 
    })

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      console.log(snapshot.bytesTransferred + " of " + snapshot.totalBytes + " uploaded")
    }, async (error) => {
      console.log(error);
      loading.dismiss();
      let toast = await this.toastCtrl.create({
        message: error.message,
        duration: 3000
      })
      toast.present();
      
    }, async () => {
      loading.dismiss();
      let toast = await this.toastCtrl.create({
        message: "Note created successfully",
        duration: 3000
      })
      toast.present();

      let url: string = await uploadTask.snapshot.ref.getDownloadURL();
      
      await this.updateNoteImageUrl(docRef.id, url);
      this.getNotes();
    })
  }

  async updateNoteImageUrl(noteId: string, imageUrl: string) {
    return firebase.firestore().collection("Notes").doc(noteId).update({
      "image": imageUrl
    });
  }

  async flag(noteId: string) {
    
    let flag: boolean = (await firebase.firestore().collection("Notes").doc(noteId).get()).data().flag || false;

    await firebase.firestore().collection("Notes").doc(noteId).update({
      "flag": !flag
    });

    this.getNotes();
  }

  async delete(noteId: string) {

    await firebase.firestore().collection("Notes").doc(noteId).delete();

    this.getNotes();
  }

  async edit(note) {
    console.log(note.data());
    let modal = await this.modalCtrl.create({
      component: CreateNoteModalPage,
      componentProps: note.data()
    });

    modal.onDidDismiss().then(async (response) => {
      if (response.data) {

        console.log(response.data);

        if(response.data.image && response.data.image.indexOf('https') < 0) {
          await this.uploadImage(note.id, response.data)
        }

        await this.updateNote(note.id, {
          "title": response.data.title,
          "description": response.data.description
        });
        await this.getNotes();
      }
    })

    modal.present();
  }

  async uploadImage(noteId, noteData) {
    let storage = firebase.storage().ref();

    // <uid>/<docId.png>
    let reference = storage.child(firebase.auth().currentUser.uid + "/" + (new Date()).toISOString() + "-" + noteId + ".png");
    let uploadTask = reference.putString(noteData.image, firebase.storage.StringFormat.DATA_URL, {
      contentType: 'image/png',
      customMetadata: {
        "title": noteData.title
      } 
    })

    await uploadTask.then(async (snapshot) => {
      noteData.image = await snapshot.ref.getDownloadURL();
      await this.updateNote(noteId, noteData);
    }, (error) => {
      console.log(error);
    });

    
  }

  async updateNote(noteId, noteData) {

    await firebase.firestore().collection("Notes").doc(noteId).update(noteData);

    this.getNotes();
  }

}
