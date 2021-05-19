import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNoteModalPage } from './create-note-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNoteModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNoteModalPageRoutingModule {}
