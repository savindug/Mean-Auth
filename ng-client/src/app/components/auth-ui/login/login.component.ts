import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      pwd: new FormControl('', [Validators.required])
    })
  }

  loginProcess() {
    if(this.formGroup.valid){
      console.log(JSON.stringify(this.formGroup.value))
      this.authService.login(this.formGroup.value).subscribe(res => {
        if(res){
          console.log(`res:: ${JSON.stringify(res)}, isLoggedIn: ${this.authService.isLoggedIn()} `);
          //alert("You have Successfully Loged into the System\nYour toke is: "+ res.token)
          this.router.navigate(['dashboard'])
        }else{
          console.log(res);
          alert(res.msg)
        }

      })
    }
  }
}
