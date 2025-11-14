import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ModalService } from '../shared/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark mb-4" style="background-color: #363B48;">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/" style="color: white">Article Décoration</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" style="color: white">
                <i class="fas fa-home"></i> Accueil
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/articles" routerLinkActive="active" style="color: white">
                <i class="fas fa-box-open"></i> Articles
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active" style="color: white">
                <i class="fas fa-tags"></i> Catégories
              </a>
            </li>
          </ul>
          <div class="d-flex">
            <a *ngIf="shouldShowAddButton()" class="nav-link" href="javascript:void(0)" (click)="onAddClick()" style="color: white">
              <i class="fas fa-plus-circle"></i> {{getAddButtonText()}}
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .navbar-nav .nav-link.active {
      font-weight: bold;
      color: #ffffff !important;
      position: relative;
    }
    .navbar-nav .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #ffffff;
    }
    .nav-link {
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0.9;
    }
    .nav-link:hover {
      opacity: 1;
      transform: translateY(-2px);
    }
    .nav-link i {
      margin-right: 0.5rem;
    }
  `]
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private modalService: ModalService
  ) {}
  shouldShowAddButton(): boolean {
    const currentPath = this.router.url;
    return currentPath === '/articles' || currentPath === '/categories';
  }

  getAddButtonText(): string {
    const currentPath = this.router.url;
    return currentPath === '/articles' ? 'Ajouter un Article' : 'Ajouter une Catégorie';
  }

  onAddClick() {
    this.modalService.triggerOpenModal();
  }
}
