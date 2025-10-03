import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute} from '@angular/router';

import { MessageModule } from 'primeng/message';

import { AuthService } from '../services/auth.service';
import { CreateUser } from '../interfaces/CreateUser';


@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessageModule,
    RouterLink
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private router: Router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)
  private authService: AuthService = inject(AuthService)

  loginForm = this.fb.group({
    name: ['', Validators.required],
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

    if (this.name.value === undefined || this.name.value === null)
    {
      this.errors.push('The name field does not be empty');
      return;
    }
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

    let formData: CreateUser = {
      name: this.name.value,
      username: this.username.value,
      password: this.password.value,
    };

    this.authService.signUp(formData)
      .subscribe({
        next: (response) => {
          this.router.navigate(["/login"], {
            queryParams: { message: "User was created." }
          });
        },
        error: (e) => {
          if (e.error.hasOwnProperty("errors"))
            this.errors = e.error.errors;
          else
            this.errors.push(e.error.message);
        }
      });
  }

  get name() { return this.loginForm.controls.name }
  get username() { return this.loginForm.controls.username }
  get password() { return this.loginForm.controls.password }
}
