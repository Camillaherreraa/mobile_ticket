import { Component, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService, Ticket } from '../../core/api';

@Component({
  selector: 'app-atendente',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel,
    IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    ReactiveFormsModule, NgIf
  ],
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss']
})
export class AtendentePage {
  counterCtrl = new FormControl<number | null>(null, { nonNullable: false, validators: [Validators.required, Validators.min(1)] });
  current = signal<Ticket | null>(null);
  busy = signal(false);
  message = signal<string | null>(null);

  constructor(private api: ApiService) {}

  async callNext() {
    if (this.busy()) return;
    const counter = this.counterCtrl.value ?? 0;
    if (!counter) { this.message.set('Informe o guichê.'); return; }

    this.busy.set(true);
    this.message.set(null);
    try {
      const t = await this.api.callNext(counter).toPromise();
      this.current.set(t ?? null);
      if (!t) this.message.set('Não há senhas na fila.');
    } finally {
      this.busy.set(false);
    }
  }

  async finish() {
    const t = this.current();
    if (!t) { this.message.set('Nada para finalizar.'); return; }
    this.busy.set(true);
    try {
      await this.api.finish(t.id).toPromise();
      this.current.set(null);
      this.message.set('Atendimento finalizado.');
    } finally {
      this.busy.set(false);
    }
  }
}
