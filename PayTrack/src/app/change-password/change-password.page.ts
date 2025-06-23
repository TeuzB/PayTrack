import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage {
  email: string = '';

  constructor(
    private auth: Auth,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async resetPassword() {
    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, informe seu e-mail.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      await sendPasswordResetEmail(this.auth, this.email);
      const toast = await this.toastController.create({
        message: 'E-mail de redefinição enviado!',
        duration: 3000,
        color: 'success',
      });
      toast.present();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: error.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
