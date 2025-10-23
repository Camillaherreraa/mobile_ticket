import { Component, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NgIf, DatePipe } from '@angular/common';
import { ApiService, Ticket } from '../../core/api';

@Component({
  selector: 'app-totem',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, NgIf, DatePipe],
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss']
})
export class TotemPage {
  lastTicket = signal<Ticket | null>(null);
  busy = signal(false);

  constructor(private api: ApiService) {}

  async emit(type: 'SP'|'SG'|'SE') {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      const t = await this.api.emitTicket(type).toPromise();
      this.lastTicket.set(t ?? null);
    } finally {
      this.busy.set(false);
    }
  }
}
