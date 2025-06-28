import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Menu } from "./components/menu/menu";
import { Footer } from "./components/footer/footer";
import { FlowbiteService } from './services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'book-social-ui';
  isAuthPage = false;

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // Detectar páginas de autenticación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.url === '/login' || 
                       event.url === '/register' || 
                       event.url === '/activate-account';
    });

    // Verificar la ruta inicial
    this.isAuthPage = this.router.url === '/login' || 
                     this.router.url === '/register' || 
                     this.router.url === '/activate-account';
  }
}
