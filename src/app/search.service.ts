import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  // This signal holds the current search query
  searchQuery = signal<string>('');
}
