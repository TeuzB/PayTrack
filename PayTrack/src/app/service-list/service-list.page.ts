import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
  standalone: false
})
export class ServiceListPage implements OnInit {

  ordens: any[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

ngOnInit() {
  this.firestoreService.getOrdens().subscribe(data => {
    this.ordens = data.map(ordem => ({
      ...ordem,
      data: ordem.data?.toDate ? ordem.data.toDate() : ordem.data
    }));
  });
}


  abrirDetalhes(ordemId: string) {
    this.router.navigate(['/service-detail', ordemId]);
  }
}
