import { AuthGuardService } from './services/auth-guard.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IndexComponent } from './components/index/index.component';
import { RegisterComponent } from './components/auth-ui/register/register.component';
import { LoginComponent } from './components/auth-ui/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuardService } from './services/access-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuardService] },
  {path: 'home', component: IndexComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AccessGuardService], canLoad: [AccessGuardService]},
  {path: '404', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
