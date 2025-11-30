import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonButton,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonButton, RouterLink],
})
export class AppComponent {}
