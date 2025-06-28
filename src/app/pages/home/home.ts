import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/services/book.service';
import { BookCardComponent } from '../../components/book-card/book-card';
import { BookResponse } from '../../services/models/book-response';
import { PageResponseBookResponse } from '../../services/models/page-response-book-response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Biblioteca de Libros
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Descubre y comparte libros increíbles con nuestra comunidad
          </p>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-700">
              {{ error }}
            </p>
          </div>
          <button 
            (click)="loadBooks()"
            class="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium">
            Reintentar
          </button>
        </div>

        <!-- Books Grid -->
        <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <app-book-card 
            *ngFor="let book of books"
            [book]="book"
            [showActions]="true"
            (onBorrow)="onBorrowBook($event)"
            (onViewDetails)="onViewBookDetails($event)">
          </app-book-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !error && books.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay libros disponibles</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aún no hay libros en la biblioteca. ¡Sé el primero en agregar uno!
          </p>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && !error && totalPages > 1" class="mt-8 flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button 
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 0"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Página {{ currentPage + 1 }} de {{ totalPages }}
            </span>
            
            <button 
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage >= totalPages - 1"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  books: BookResponse[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      } else {
        this.loadBooks();
      }
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.error = null;

    this.bookService.findAllBooks({
      page: this.currentPage,
      size: this.pageSize
    }).subscribe({
      next: (response: PageResponseBookResponse) => {
        this.books = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.error = 'Error al cargar los libros. Por favor, inténtalo de nuevo.';
        this.loading = false;
        this.books = [];
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBooks();
    }
  }

  onBorrowBook(book: BookResponse): void {
    if (!book.id) {
      console.error('ID del libro no disponible');
      return;
    }

    this.bookService.borrowBook({ 'book-id': book.id }).subscribe({
      next: (borrowId) => {
        console.log('Libro prestado exitosamente:', borrowId);
        // Mostrar mensaje de éxito
        alert('¡Libro prestado exitosamente!');
        // Recargar la lista para actualizar el estado
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error al pedir prestado el libro:', error);
        let errorMessage = 'Error al pedir prestado el libro.';
        
        if (error.status === 400) {
          errorMessage = 'No puedes pedir prestado tu propio libro o el libro no está disponible.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        }
        
        alert(errorMessage);
      }
    });
  }

  onViewBookDetails(book: BookResponse): void {
    // Por ahora solo mostramos la información en consola
    // En el futuro se puede navegar a una página de detalles
    console.log('Ver detalles del libro:', book);
    alert(`Detalles del libro:\n\nTítulo: ${book.title}\nAutor: ${book.authorName}\nISBN: ${book.isbn}\nSinopsis: ${book.synopsis}`);
  }

  getTokenPreview(): string {
    const token = this.authService.getToken();
    if (token && token.length > 20) {
      return token.substring(0, 20) + '...';
    }
    return token || 'No token';
  }

  getUserEmail(): string {
    return this.authService.getUserEmail();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
