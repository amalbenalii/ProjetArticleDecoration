import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../shared/modal.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { CategoryModel } from './category.model';

@Component({
  selector: 'app-category-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './category-dashboard.component.html',
  styleUrls: ['./category-dashboard.component.css']
})
export class CategoryDashboardComponent implements OnInit, OnDestroy {
  private modalSubscription: Subscription;
  Math = Math; // Pour utiliser Math dans le template
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  pages: number[] = [];
  formValue!: FormGroup;
  categoryModelObj: CategoryModel = new CategoryModel();
  categoryData: any[] = [];
  filteredCategoryData: any[] = [];
  searchTerm: string = '';
  showAddModal: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.modalSubscription = this.modalService.openModal$.subscribe(() => {
      if (this.router.url === '/categories') {
        this.openModal();
      }
    });
    this.getAllCategories();
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: [''],
    });
    this.getAllCategories();
  }

  getAllCategories() {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        const allCategories = res.body;
        this.totalItems = allCategories.length;
        this.categoryData = allCategories;
        this.filteredCategoryData = allCategories; // Initialiser les données filtrées
        
        // Mettre à jour le tableau des pages
        const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
        this.pages = Array(pageCount).fill(0).map((_, i) => i + 1);
        
        this.updateDisplayedCategories();
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  updateDisplayedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredCategoryData = this.categoryData
      .filter(category => {
        if (!this.searchTerm) return true;
        return category.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      })
      .slice(start, end);
  }

  onSearch() {
    this.currentPage = 1; // Réinitialiser à la première page lors d'une recherche
    this.updateDisplayedCategories();
  }

  openModal() {
    this.showAddModal = true;
    this.formValue.reset();
    this.categoryModelObj = new CategoryModel();
  }

  closeModal() {
    this.showAddModal = false;
  }

  addCategory() {
    this.categoryModelObj.name = this.formValue.value.name;

    this.api.postCategory(this.categoryModelObj)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Succès!',
            text: 'Catégorie ajoutée avec succès',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.closeModal();
          this.getAllCategories();
        },
        err => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  editCategory(row: any) {
    this.showAddModal = true;
    this.categoryModelObj.id = row.id;
    this.formValue.patchValue({
      name: row.name
    });
  }

  updateCategory() {
    this.categoryModelObj.name = this.formValue.value.name;

    this.api.updateCategory(this.categoryModelObj, this.categoryModelObj.id)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Succès!',
            text: 'Catégorie modifiée avec succès',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.closeModal();
          this.getAllCategories();
        },
        err => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de la modification',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  deleteCategory(row: any) {
    console.log('Row to delete:', row);

    // Vérifier que l'ID est valide
    if (!row || !row.id) {
      Swal.fire({
        title: 'Erreur!',
        text: 'ID de catégorie invalide',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Vérifier d'abord si la catégorie est utilisée par des articles
    this.api.getArticles().subscribe({
      next: (response) => {
        const articles = response.body || [];
        console.log('Articles found:', articles);
        const isUsed = articles.some((article: any) => article.categorie === row.name);
        console.log('Category is used:', isUsed);
        
        if (isUsed) {
          Swal.fire({
            title: 'Impossible de supprimer',
            text: 'Cette catégorie est utilisée par des articles. Veuillez d\'abord modifier ou supprimer ces articles.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }

        // Si la catégorie n'est pas utilisée, on peut la supprimer
        Swal.fire({
          title: 'Êtes-vous sûr?',
          text: 'Cette action est irréversible!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer!',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('Attempting to delete category with ID:', row.id);
            
            this.api.deleteCategory(row.id).subscribe({
              next: (res) => {
                console.log('Delete successful:', res);
                Swal.fire({
                  title: 'Supprimée!',
                  text: 'La catégorie a été supprimée.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                this.getAllCategories();
              },
              error: (error) => {
                console.error('Delete error:', error);
                let errorMessage = 'Une erreur est survenue lors de la suppression.';
                if (error.status === 404) {
                  errorMessage = 'La catégorie n\'existe plus ou a déjà été supprimée.';
                }
                Swal.fire({
                  title: 'Erreur!',
                  text: errorMessage,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error checking articles:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de vérifier si la catégorie est utilisée.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  goToArticles() {
    this.router.navigate(['/articles']);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
      this.getAllCategories();
    }
  }
}
