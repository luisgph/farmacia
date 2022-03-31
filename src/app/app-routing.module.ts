
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/error-page/error-page.component';

const routes: Routes = [
  { path: 'faq',loadChildren: () => import('./modules/faq/faq.module').then( m => m.FaqModule ) },
  { path: 'buys',loadChildren: () => import('./modules/buys/buys.module').then( m => m.BuysModule ) },
  { path: 'help',loadChildren: () => import('./modules/help/help.module').then( m => m.HelpModule ) },
  { path: 'sales',loadChildren: () => import('./modules/sales/sales.module').then( m => m.SalesModule ) },
  { path: 'profile',loadChildren: () => import('./modules/profile/profile.module').then( m => m.ProfileModule ) },
  { path: 'reports',loadChildren: () => import('./modules/reports/reports.module').then( m => m.ReportsModule ) },
  { path: 'setting',loadChildren: () => import('./modules/setting/setting.module').then( m => m.SettingModule ) },
  { path: 'pharmacy',loadChildren: () => import('./modules/pharmacy/pharmacy.module').then( m => m.PharmacyModule ) },
  { path: 'elearning',loadChildren: () => import('./modules/elearning/elearning.module').then( m => m.ElearningModule ) },
  { path: 'inventory',loadChildren: () => import('./modules/inventory/inventory.module').then( m => m.InventoryModule ) },
  { path: 'dashboard',loadChildren: () => import('./modules/dashboard/dashboard.module').then( m => m.DashboardModule ) },
  { path: 'providers',loadChildren: () => import('./modules/providers/providers.module').then( m => m.ProvidersModule ) },
  { path: 'accounting',loadChildren: () => import('./modules/accounting/accounting.module').then( m => m.AccountingModule ) },
  { path: 'alerts',loadChildren: () => import('./modules/alerts-notifications/alerts-notifications.module').then( m => m.AlertsNotificationsModule ) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**',component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
