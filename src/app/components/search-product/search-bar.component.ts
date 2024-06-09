import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from 'src/app/modules/material';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class SearchBarComponent {
  @Input() searchInput!: string;
  @Output() setSearch = new EventEmitter<string>();
  constructor() {}
  handleInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.setSearch.emit(inputElement.value);
  }
}
