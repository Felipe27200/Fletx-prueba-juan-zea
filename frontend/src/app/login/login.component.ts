import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute} from '@angular/router';

import { MessageModule } from 'primeng/message';

import { AuthService } from '../services/auth.service';

import { Login } from '../interfaces/Login';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private fb: FormBuilder = inject(FormBuilder)
  private authService: AuthService = inject(AuthService)

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errors: any[] = [];
  messageSignup!: string;

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let message = params['message'];

        if (message === undefined || message === null || message === '' || message.lenght <= 0)
          return;

        this.messageSignup = message;
      });
  }

  onSubmit() {
    this.errors = [];

    if (!this.loginForm.valid)
      return;

    if (this.username.value === undefined || this.username.value === null)
    {
      this.errors.push('The username field does not be empty');
      return;
    }

    if (this.password.value === undefined || this.password.value === null)
    {
      this.errors.push('The username field does not be empty');
      return;
    }

    let formData: Login = {
      username: this.username.value,
      password: this.password.value,
    };

    this.authService.login(formData)
      .subscribe({
        next: (response) => {
          console.log(response);2
        },
        error: (e) => {
          if (e.error.hasOwnProperty("errors"))
            this.errors = e.error.errors;
          else
            this.errors.push(e.error.message);
        }
      });
  }

  get username() { return this.loginForm.controls.username }
  get password() { return this.loginForm.controls.password }
}
