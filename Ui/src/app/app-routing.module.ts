import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AuthGuardService } from './Services/auth-guard.service';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customer-details', component: CustomerDetailsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
