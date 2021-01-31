import { UserModel } from './../models/user.model';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { serviceURL } from 'src/environments/environment';
import { catchError, mapTo, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: UserModel | undefined;

  constructor(private http: HttpClient) { }

  login(user: UserModel): Observable<any>{
    return this.http.post(`${serviceURL}login`, user, httpOptions).pipe(
      tap(tokens => {this.loginUser(user, tokens); }),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }))
  }

  register(user: UserModel): Observable<any>{
    console.log(`register(${JSON.stringify(user)})`)
    return this.http.post(`${serviceURL}register`, user, httpOptions).pipe(
      tap(tokens => {this.registerUser(user, tokens)}),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }))
  }

  logout() {
    return this.http.post<any>(`${serviceURL}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.logoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  refreshToken() {
    return this.http.post<any>(`${serviceURL}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: any) => {
      this.storeAccessToken(tokens.jwt);
    }));
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  storeAccessTokens(accessToken: any){
    if(accessToken){
      localStorage.setItem(this.ACCESS_TOKEN, accessToken.jwt)
      localStorage.setItem(this.REFRESH_TOKEN, accessToken.refresh);
     }else{
      return;
    }
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  getAccessToken(){
      return localStorage.getItem(this.ACCESS_TOKEN)
  }

  private checkResponseStatus(res: any){
      if(res.status === 1){
        return true
      }else{
        return false
      }
  }

  isLoggedIn() {
    return !!this.getAccessToken()
  }

  private registerUser(user: UserModel, tokens: any) {
    if(this.checkResponseStatus(tokens)){
      this.loggedUser = user;
      this.loggedUser.accessToken = tokens.jwt
      this.storeAccessToken(tokens.jwt);
      alert("You have Successfully Registered to the System")
      console.log('User has Registered: ' + JSON.stringify(tokens.user))
    }else{
      alert("Please Try Again\nUsername or Email already exists.")
    }
  }

  private loginUser(user: UserModel, tokens: any) {
    if(this.checkResponseStatus(tokens)){
      this.loggedUser = user;
      this.loggedUser.accessToken = tokens.jwt
      this.storeAccessToken(tokens.jwt);
      alert("You have Successfully Loged into the System")
      console.log('User has Logged In: ' + JSON.stringify(tokens.user))
    }else{
      alert("Please Try Again\nInvalid User Credentials.")
    }
  }

  private logoutUser() {
    this.loggedUser = undefined;
    this.removeAccessTokens();
    console.log('User has Logged Out: ' + JSON.stringify(this.loggedUser))
  }

  private removeAccessTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

}
