import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  get name() {
    return this.credentials.get('name');
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  get passwordMismatch() {
    return this.password?.value !== this.confirmPassword?.value;
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async register() {
    if (this.passwordMismatch) {
      this.showAlert('Erro', 'As senhas não coincidem.');
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register({
      email: this.email?.value,
      password: this.password?.value
    });

    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Falha no cadastro', 'Tente novamente!');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
