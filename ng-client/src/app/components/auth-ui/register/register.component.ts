import { UserModel } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      pwd: new FormControl('', [Validators.required]),
      c_pwd: new FormControl('', [Validators.required])
    })
  }

  confirmPWD(pwd: string, c_pwd: string) {
      if(pwd === c_pwd){
        return 1
      }else{
        return -1
      }
  }

  registerProcess() {
    if(this.formGroup.valid){

      let pwdConfirm = this.confirmPWD(this.formGroup.controls['pwd'].value, this.formGroup.controls['c_pwd'].value);

      if(pwdConfirm === 1){

        let usr = new UserModel(this.formGroup.controls['username'].value, this.formGroup.controls['email'].value, this.formGroup.controls['pwd'].value)

        this.authService.register(usr).subscribe(res => {
          if(res){
            console.log("res::" + JSON.stringify(res));
            //alert("You have Successfully Sing Up to the System")
            this.router.navigate(['dashboard'])
          }else{
            console.log(res);
            alert(JSON.stringify(res.msg))
          }
        })
      }else{
        alert("Password Confirmation Failed\nPlease Try Again")
        //this.router.navigate(['dashboard'])
      }

    }
  }

}
