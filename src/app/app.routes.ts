import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'totem', loadComponent: () => import('./pages/totem/totem.page').then(m => m.TotemPage) },
  { path: 'painel', loadComponent: () => import('./pages/painel/painel.page').then(m => m.PainelPage) },
  { path: 'atendente', loadComponent: () => import('./pages/atendente/atendente.page').then(m => m.AtendentePage) },
  { path: 'relatorios', loadComponent: () => import('./pages/admin-relatorios/admin-relatorios.page').then(m => m.AdminRelatoriosPage) },
];
