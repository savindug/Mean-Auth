import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  
  canActivate() {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard'])
    }
    return !this.authService.isLoggedIn();
  }


}
