import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  private subs: Subscription;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(6)] })
    });
    this.subs = this.userService.getUserAuthenticateListener().subscribe(value => {
      this.isLoading = false;
    });
  }

  onSignUp() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.addUser(this.form.value.email, this.form.value.password);
    this.form.reset();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
