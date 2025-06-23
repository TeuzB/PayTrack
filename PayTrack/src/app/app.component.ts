import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dashboard', url: '/dashboard', icon: 'analytics' },
    { title: 'Novo Pedido', url: '/service-form', icon: 'create' },
    { title: 'Lista de Pedidos', url: '/service-list', icon: 'list' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public showMenu = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/register', '/forgot-password'];
        this.showMenu = !hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
  

}
