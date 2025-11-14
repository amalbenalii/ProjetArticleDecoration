import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/articles';
  private categoryUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  getArticles(page?: number, itemsPerPage?: number): Observable<any> {
    // Si page et itemsPerPage sont fournis, on utilise la pagination
    if (page !== undefined && itemsPerPage !== undefined) {
      const params = new HttpParams()
        .set('_page', page.toString())
        .set('_limit', itemsPerPage.toString());

      return this.http.get(this.apiUrl, { params: params, observe: 'response' }).pipe(
        retry(1),
        catchError(this.handleError)
      );
    }

    // Sinon, on retourne tous les articles
    return this.http.get(this.apiUrl, { observe: 'response' }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  postArticle(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteArticle(id: number | string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  updateArticle(id: number | string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, data).pipe(
      retry(1),
      tap(response => console.log('Article mis à jour avec succès:', response)),
      catchError(this.handleError)
    );
  }

  // Méthodes pour les catégories
  public getCategories(page?: number, itemsPerPage?: number): Observable<any> {
    // Si page et itemsPerPage sont fournis, on utilise la pagination
    if (page !== undefined && itemsPerPage !== undefined) {
      const params = new HttpParams()
        .set('_page', page.toString())
        .set('_limit', itemsPerPage.toString());

      return this.http.get(this.categoryUrl, { params: params, observe: 'response' }).pipe(
        retry(1),
        catchError(this.handleError)
      );
    }

    // Sinon, on retourne toutes les catégories
    return this.http.get(this.categoryUrl, { observe: 'response' }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  postCategory(data: any): Observable<any> {
    // Récupérer toutes les catégories pour trouver le plus grand ID
    return this.http.get<any[]>(this.categoryUrl).pipe(
      switchMap((categories: any[]) => {
        const maxId = categories.length > 0 ? Math.max(...categories.map(cat => parseInt(cat.id) || 0)) : 0;
        const newData = { ...data, id: (maxId + 1).toString() };
        return this.http.post(this.categoryUrl, newData);
      }),
      catchError(this.handleError)
    );
  }

  updateCategory(data: any, id: string | number): Observable<any> {
    return this.http.patch(`${this.categoryUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: string | number): Observable<any> {
    console.log('Deleting category with ID:', id);
    return this.http.delete(`${this.categoryUrl}/${id}`).pipe(
      tap(response => console.log('Delete response:', response)),
      catchError(error => {
        console.error('Delete error:', error);
        return throwError(() => error);
      })
    );
  }

  private prepareArticleData(data: any): any {
    return {
      ...data,
      image: data.image ? data.image.replace(/\\/g, '/') : ''
    };
  }
}