import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../service/firestore.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.page.html',
  styleUrls: ['./service-form.page.scss'],
  standalone: false
})
export class ServiceFormPage {
  serviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private firestoreService: FirestoreService,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {
    this.serviceForm = this.fb.group({
      cliente: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      statusPagamento: ['', Validators.required],
      data: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      uf: ['', Validators.required]
    });
  }

  get cliente() {
    return this.serviceForm.get('cliente');
  }

  get descricao() {
    return this.serviceForm.get('descricao');
  }

  get valor() {
    return this.serviceForm.get('valor');
  }

  get statusPagamento() {
    return this.serviceForm.get('statusPagamento');
  }

  get data() {
    return this.serviceForm.get('data');
  }

  buscarEndereco() {
    const cep = this.serviceForm.value.cep?.replace(/\D/g, '');

    if (cep?.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        (data: any) => {
          if (!data.erro) {
            this.serviceForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf
            });
          } else {
            console.error('CEP não encontrado');
          }
        },
        error => {
          console.error('Erro na requisição ViaCEP:', error);
        }
      );
    }
  }

  async onSubmit() {
    if (this.serviceForm.valid) {
      const novaOrdem = {
        ...this.serviceForm.value,
        criadoEm: new Date()
      };

      try {
        await this.firestoreService.addOrdem(novaOrdem);

        const toast = await this.toastCtrl.create({
          message: 'Ordem criada com sucesso!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.navCtrl.navigateForward('/service-list');
      } catch (error) {
        console.error('Erro ao salvar no Firebase:', error);
      }
    }
  }
}
