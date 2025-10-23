import { Component, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput,
  IonButton, IonList, IonListHeader
} from '@ionic/angular/standalone';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-admin-relatorios',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton,
    IonList, IonListHeader, NgIf, NgForOf, DatePipe
  ],
  templateUrl: './admin-relatorios.page.html',
  styleUrls: ['./admin-relatorios.page.scss']
})
export class AdminRelatoriosPage {
  date = signal<string>('');           // yyyy-MM-dd
  year = signal<number | null>(null);  // ex: 2025
  month = signal<number | null>(null); // 1..12

  dailyData = signal<any | null>(null);
  monthlyData = signal<any | null>(null);
  loading = signal(false);
  msg = signal<string | null>(null);

  constructor(private api: ApiService) {}

  onDate(ev: any)  { this.date.set(ev?.detail?.value ?? ''); }
  onYear(ev: any)  { const v = Number(ev?.detail?.value); this.year.set(isNaN(v) ? null : v); }
  onMonth(ev: any) { const v = Number(ev?.detail?.value); this.month.set(isNaN(v) ? null : v); }

  async loadDaily() {
    if (!this.date()) { this.msg.set('Informe uma data (YYYY-MM-DD).'); return; }
    this.loading.set(true); this.msg.set(null);
    try {
      const data = await this.api.daily(this.date()).toPromise();
      this.dailyData.set(data);
    } catch (e:any) {
      this.msg.set('Erro ao carregar diário: ' + (e?.message ?? e));
    } finally { this.loading.set(false); }
  }

  async loadMonthly() {
    const y = this.year(), m = this.month();
    if (!y || !m) { this.msg.set('Informe ano e mês.'); return; }
    this.loading.set(true); this.msg.set(null);
    try {
      const data = await this.api.monthly(String(y), String(m)).toPromise();
      this.monthlyData.set(data);
    } catch (e:any) {
      this.msg.set('Erro ao carregar mensal: ' + (e?.message ?? e));
    } finally { this.loading.set(false); }
  }
}
