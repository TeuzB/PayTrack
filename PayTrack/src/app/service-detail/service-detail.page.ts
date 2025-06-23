import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
  standalone: false
})
export class ServiceDetailPage implements OnInit {

  ordemId: string | null = null;
  ordem: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

 ngOnInit() {
  this.ordemId = this.route.snapshot.paramMap.get('id');
  if (this.ordemId) {
    this.firestoreService.getOrdemById(this.ordemId).then(doc => {
      if (doc.exists()) {
        const dados = doc.data();

        // Converte o campo data corretamente
        let dataConvertida = dados.data;
        if (dados.data?.toDate) {
          dataConvertida = dados.data.toDate();
        } else if (typeof dados.data === 'string' || typeof dados.data === 'number') {
          dataConvertida = new Date(dados.data);
        }

        this.ordem = {
          ...dados,
          data: dataConvertida
        };
      }
    });
  }
}

  async salvarAlteracoes() {
    if (!this.ordemId) return;

    try {
      await this.firestoreService.updateOrdem(this.ordemId, this.ordem);
      const toast = await this.toastCtrl.create({
        message: 'Ordem atualizada com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (err) {
      console.error(err);
    }
  }

  async excluirOrdem() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir esta ordem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            if (this.ordemId) {
              await this.firestoreService.deleteOrdem(this.ordemId);
              const toast = await this.toastCtrl.create({
                message: 'Ordem excluída!',
                duration: 2000,
                color: 'danger'
              });
              await toast.present();
              this.router.navigate(['/service-list']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async tirarFoto() {
  const image = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera
  });

  this.ordem.foto = 'data:image/jpeg;base64,' + image.base64String;
} 
}
