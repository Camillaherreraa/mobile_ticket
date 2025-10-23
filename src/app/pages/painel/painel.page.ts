import { Component, OnDestroy, signal, computed } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { ApiService, CallRow } from '../../core/api';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    NgForOf, NgIf, DatePipe
  ],
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss']
})
export class PainelPage implements OnDestroy {
  calls = signal<CallRow[]>([]);
  latest = computed(() => this.calls()[0] ?? null);

  private sub?: Subscription;

  constructor(private api: ApiService) {
    this.sub = interval(1500)
      .pipe(switchMap(() => this.api.lastCalls()))
      .subscribe(rows => this.calls.set(rows ?? []));
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
