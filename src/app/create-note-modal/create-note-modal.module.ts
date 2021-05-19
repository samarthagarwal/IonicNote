import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNoteModalPageRoutingModule } from './create-note-modal-routing.module';

import { CreateNoteModalPage } from './create-note-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNoteModalPageRoutingModule
  ],
  declarations: [CreateNoteModalPage]
})
export class CreateNoteModalPageModule {}
