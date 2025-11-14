import { Routes } from '@angular/router';
import { ArticleDashboardComponent } from './article-dashboard/article-dashboard.component';
import { CategoryDashboardComponent } from './category-dashboard/category-dashboard.component';
import { AccueilComponent } from './accueil/accueil.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'articles', component: ArticleDashboardComponent },
  { path: 'categories', component: CategoryDashboardComponent }
];
