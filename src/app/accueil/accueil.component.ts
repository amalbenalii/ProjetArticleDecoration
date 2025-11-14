import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  latestArticles: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadLatestArticles();
  }

  loadLatestArticles() {
    this.api.getArticles(1, 6).subscribe({
      next: (response: any) => {
        if (response && response.body) {
          this.latestArticles = response.body;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles:', err);
      }
    });
  }

}
