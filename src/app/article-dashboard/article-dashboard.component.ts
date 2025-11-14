import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { ArticleModel } from './article-dashboard.modal';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalService } from '../shared/modal.service';
import { Subscription } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-article-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './article-dashboard.component.html',
  styleUrls: ['./article-dashboard.component.css']
})
export class ArticleDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  formValue!: FormGroup;
  articleModelObj: ArticleModel = new ArticleModel();
  articleData: any[] = [];
  filteredArticleData: any[] = [];
  searchTerm: string = '';
  showModal = false;
  categories: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  selectedArticle: any = null;
  detailsModal: any;
  modal: any;
  availableImages: string[] = [
    'assets/images (1).jpg',
    'assets/images.jpg',
    'assets/téléchargement.jpg',
    'assets/lustrecristal.jpg',
    'assets/lampe-de-sel.jpg',
    'assets/lustremetal.jpg',
    'assets/lustremetal.jpg',
    'assets/tab.jpg',
    'assets/bourg.jpg',
    'assets/coupe.jpg',
    'assets/miroir.jpeg',
    'assets/sticker.jpg',
    'assets/veseenverre.jpg'

  ];

  private modalSubscription: Subscription;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private modalService: ModalService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.getAllArticles();
    this.modalSubscription = this.modalService.openModal$.subscribe(() => {
      if (this.router.url === '/articles') {
        this.openModal();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      nomArt: [''],
      description: [''],
      categorie: [''],
      prix: [0],
      stock: [0],
      image: [''],
    });

    this.getAllArticles();
    this.loadCategories();
    this.formValue = this.formbuilder.group({
      nomArt: [''],
      description: [''],
      categorie: [''],
      prix: [0],
      stock: [0],
      image: ['']
    });
    this.getAllArticles();
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.body || [];
      },
      error: (err) => {
        console.error("Erreur de chargement des catégories", err);
        this.categories = [];
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const detailsModalEl = document.getElementById('detailsModal');
      const editModalEl = document.getElementById('staticBackdrop');
      
      if (detailsModalEl) {
        this.detailsModal = new bootstrap.Modal(detailsModalEl);
      }
      
      if (editModalEl) {
        this.modal = new bootstrap.Modal(editModalEl);
      }
    }
  }

  openModal() {
    this.formValue.reset({
      nomArt: '',
      description: '',
      categorie: '',
      prix: 0,
      stock: 0,
      image: ''
    });
    this.articleModelObj = new ArticleModel();
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    this.showModal = false;
  }

  showDetails(article: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedArticle = article;
      this.detailsModal.show();
    }
  }

  closeDetailsModal() {
    if (isPlatformBrowser(this.platformId)) {
      this.detailsModal.hide();
      this.selectedArticle = null;
    }
  }

  postArticleDetails() {
    const newArticle = {
      nomArt: this.formValue.value.nomArt,
      description: this.formValue.value.description,
      categorie: this.formValue.value.categorie,
      prix: this.formValue.value.prix,
      stock: this.formValue.value.stock,
      image: this.formValue.value.image
    };

    this.api.postArticle(newArticle).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Succès!',
          text: 'Article ajouté avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.closeModal();
        this.getAllArticles();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  getAllArticles() {
    this.api.getArticles().subscribe({
      next: (res: any) => {
        const allArticles = res.body;
        this.totalItems = allArticles.length;
        this.articleData = allArticles;
        this.updateDisplayedArticles();
      },
      error: (err: Error) => {
        console.error("Erreur de chargement", err);
        alert(err);
      }
    });
  }

  updateDisplayedArticles() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    
    // Filtrer les articles en fonction du terme de recherche
    const filteredArticles = this.articleData.filter(article => {
      if (!this.searchTerm) return true;
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        article.nomArt.toLowerCase().includes(searchTermLower) ||
        article.categorie.toLowerCase().includes(searchTermLower) ||
        article.prix.toString().includes(searchTermLower)
      );
    });

    this.totalItems = filteredArticles.length;
    this.filteredArticleData = filteredArticles.slice(start, end);
    
    // La pagination est gérée par le getter pages
  }

  onSearch() {
    this.currentPage = 1; // Réinitialiser à la première page lors d'une recherche
    this.updateDisplayedArticles();
  }

  deleteArticle(row: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteArticle(row.id).subscribe(res => {
          Swal.fire(
            'Supprimé!',
            'L\'article a été supprimé.',
            'success'
          );
          this.getAllArticles();
        });
      }
    });
  }

  onEdit(row: any) {
    // Créer une copie profonde de l'article
    this.articleModelObj = JSON.parse(JSON.stringify(row));
    
    // Mettre à jour le formulaire avec les valeurs actuelles
    this.formValue.patchValue({
      nomArt: row.nomArt,
      description: row.description,
      categorie: row.categorie,
      prix: row.prix,
      stock: row.stock,
      image: row.image
    });

    // Afficher le modal
    if (isPlatformBrowser(this.platformId) && this.modal) {
      this.modal.show();
    } else {
      console.error('Modal non initialisé');
    }
  }

  updateArticleDetails() {
    // Vérifier que nous avons un ID valide
    const articleId = this.articleModelObj.id;
    if (!articleId || articleId === 0) {
      Swal.fire({
        title: 'Erreur!',
        text: 'ID manquant pour la modification',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Créer l'objet de mise à jour
    const updatedArticle = {
      nomArt: this.formValue.value.nomArt,
      description: this.formValue.value.description,
      categorie: this.formValue.value.categorie,
      prix: this.formValue.value.prix,
      stock: this.formValue.value.stock,
      image: this.formValue.value.image
    };

    this.api.updateArticle(this.articleModelObj.id, updatedArticle).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Succès!',
          text: 'Article modifié avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.closeModal();
        this.getAllArticles();
      },
      error: (err) => {
        console.error('Erreur de mise à jour:', err);
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de la modification',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onPageChange(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.getAllArticles();
    }
  }

  get pages(): number[] {
    return Array.from({ length: Math.ceil(this.totalItems / this.itemsPerPage) }, (_, i) => i + 1);
  }
}