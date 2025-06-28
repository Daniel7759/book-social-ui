import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/services/book.service';
import { BookCardComponent } from '../../components/book-card/book-card';
import { BookEditModalComponent } from '../../components/book-edit-modal/book-edit-modal';
import { BookResponse } from '../../services/models/book-response';
import { PageResponseBookResponse } from '../../services/models/page-response-book-response';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, BookEditModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Mis Libros
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                Gestiona tu colección personal de libros
              </p>
            </div>
            <button 
              (click)="addNewBook()"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Agregar Libro
            </button>
          </div>
          
          <!-- Stats -->
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Libros</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalElements }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Disponibles</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getAvailableCount() }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Prestados</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getBorrowedCount() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar:</label>
            <select 
              [(ngModel)]="filterType" 
              (change)="applyFilter()"
              class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
              <option value="all">Todos</option>
              <option value="available">Disponibles</option>
              <option value="borrowed">Prestados</option>
              <option value="archived">Archivados</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="applyFilter()"
              placeholder="Buscar por título o autor..."
              class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm px-3 py-2 w-64">
          </div>
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
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <button 
            (click)="loadMyBooks()"
            class="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium">
            Reintentar
          </button>
        </div>

        <!-- Books Grid -->
        <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <app-book-card 
            *ngFor="let book of filteredBooks"
            [book]="book"
            [showActions]="true"
            [isOwner]="true"
            (onEdit)="onEditBook($event)"
            (onArchive)="onArchiveBook($event)">
          </app-book-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !error && filteredBooks.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ getEmptyStateMessage() }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ getEmptyStateDescription() }}
          </p>
          <div class="mt-6">
            <button 
              (click)="addNewBook()"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Agregar tu primer libro
            </button>
          </div>
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

    <!-- Modal de Edición -->
    <app-book-edit-modal
      *ngIf="selectedBook"
      [book]="selectedBook"
      [isOpen]="isEditModalOpen"
      (onClose)="closeEditModal()"
      (onBookUpdated)="onBookUpdated($event)">
    </app-book-edit-modal>
  `,
  styles: [`
    /* Estilos específicos para my-books */
    .book-card {
      position: relative;
    }
    
    .filter-badge {
      transition: all 0.2s ease;
    }
    
    .filter-badge:hover {
      transform: scale(1.05);
    }
    
    /* Custom scrollbar for search input */
    input[type="text"]:focus {
      ring: 2px;
      ring-color: #3b82f6;
      border-color: #3b82f6;
    }
    
    /* Stats cards animation */
    .stats-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stats-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class MyBooksComponent implements OnInit {
  books: BookResponse[] = [];
  filteredBooks: BookResponse[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;
  
  // Filters
  filterType: 'all' | 'available' | 'borrowed' | 'archived' = 'all';
  searchQuery = '';

  // Edit modal
  selectedBook: BookResponse | null = null;
  isEditModalOpen = false;

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
        this.loadMyBooks();
      }
    });
  }

  loadMyBooks(): void {
    this.loading = true;
    this.error = null;

    this.bookService.findAllBooksByOwner({
      page: this.currentPage,
      size: this.pageSize
    }).subscribe({
      next: (response: PageResponseBookResponse) => {
        this.books = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.loading = false;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al cargar mis libros:', error);
        this.error = 'Error al cargar tus libros. Por favor, inténtalo de nuevo.';
        this.loading = false;
        this.books = [];
        this.filteredBooks = [];
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.books];

    // Aplicar filtro de tipo
    if (this.filterType === 'available') {
      filtered = filtered.filter(book => book.shareable && !book.archived);
    } else if (this.filterType === 'borrowed') {
      // Para "prestados" podríamos usar otra lógica o property si existiera
      filtered = filtered.filter(book => !book.shareable); // Temporal
    } else if (this.filterType === 'archived') {
      filtered = filtered.filter(book => book.archived);
    }

    // Aplicar filtro de búsqueda
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(query) ||
        book.authorName?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query)
      );
    }

    this.filteredBooks = filtered;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMyBooks();
    }
  }

  getAvailableCount(): number {
    return this.books.filter(book => book.shareable && !book.archived).length;
  }

  getBorrowedCount(): number {
    return this.books.filter(book => !book.shareable && !book.archived).length;
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery.trim()) {
      return 'No se encontraron libros';
    }
    
    switch (this.filterType) {
      case 'available':
        return 'No tienes libros disponibles';
      case 'borrowed':
        return 'No tienes libros prestados';
      case 'archived':
        return 'No tienes libros archivados';
      default:
        return 'Aún no has agregado libros';
    }
  }

  getEmptyStateDescription(): string {
    if (this.searchQuery.trim()) {
      return 'Intenta con otros términos de búsqueda';
    }
    
    switch (this.filterType) {
      case 'available':
        return 'Marca algunos libros como compartibles para que aparezcan aquí';
      case 'borrowed':
        return 'Los libros que prestes a otros usuarios aparecerán aquí';
      case 'archived':
        return 'Los libros archivados aparecerán aquí';
      default:
        return 'Comienza agregando tu primer libro a la biblioteca';
    }
  }

  addNewBook(): void {
    // Por ahora mostrar alert, en el futuro navegar a formulario de agregar libro
    alert('Funcionalidad de agregar libro en desarrollo. ¡Próximamente!');
  }

  onEditBook(book: BookResponse): void {
    this.selectedBook = book;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedBook = null;
  }

  onBookUpdated(updatedBook: BookResponse): void {
    // Actualizar el libro en la lista local
    const index = this.books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      this.books[index] = updatedBook;
      this.applyFilter(); // Reaplica los filtros
    }
    
    // Mostrar mensaje de éxito
    alert('¡Portada actualizada exitosamente!');
  }

  onArchiveBook(book: BookResponse): void {
    if (!book.id) {
      console.error('ID del libro no disponible');
      return;
    }

    const action = book.archived ? 'desarchivar' : 'archivar';
    const confirmMessage = `¿Estás seguro de que quieres ${action} "${book.title}"?`;
    
    if (confirm(confirmMessage)) {
      // Por ahora solo simulamos la acción ya que el botón es solo visual
      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} libro:`, book);
      alert(`Funcionalidad de ${action} libro en desarrollo.\n\nEsto permitirá ${action} el libro "${book.title}" de tu biblioteca.\n\n¡Próximamente disponible!`);
      
      // Cuando se implemente realmente, descomentar esto:
      /*
      this.bookService.updateArchivedStatus({ 'book-id': book.id }).subscribe({
        next: (response) => {
          console.log(`Libro ${action}do exitosamente:`, response);
          alert(`¡Libro ${action}do exitosamente!`);
          this.loadMyBooks();
        },
        error: (error) => {
          console.error(`Error al ${action} el libro:`, error);
          alert(`Error al ${action} el libro. Por favor, inténtalo de nuevo.`);
        }
      });
      */
    }
  }
}
