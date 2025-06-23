import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone:false
})
export class DashboardPage implements OnInit {

  pendentes: number = 0;
  recebidas: number = 0;
  totalReceber: number = 0;
  ordensRecentes: any[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.firestoreService.getOrdens().subscribe(ordens => {
      this.pendentes = ordens.filter(o => o.statusPagamento === 'pendente').length;
      this.recebidas = ordens.filter(o => o.statusPagamento === 'concluido').length;
      this.totalReceber = ordens
        .filter(o => o.statusPagamento === 'pendente')
        .reduce((acc, ordem) => acc + Number(ordem.valor || 0), 0);

      this.ordensRecentes = ordens.slice(-5).reverse(); // Exibe as últimas 5 ordens
    });
  }
}
