import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./filter-product.component.scss']
})
export class FilterProductComponent implements OnInit {
  ngOnInit(): void {
  }
  @Input() specs: string[];
  isSeeMostCheck: boolean = false;
  isSaleMostCheck: boolean = false;
  selectedBrandValues: string[] = [];
  
  @Output() filterChange = new EventEmitter<{saleMost:boolean , seeMost:boolean , selectedBrand:string }>();

  toggleSelection(spec: string) {
    const index = this.selectedBrandValues.indexOf(spec);
    if (index > -1) {
      this.selectedBrandValues.splice(index, 1); // Deselect if already selected
    } else {
      this.selectedBrandValues.push(spec); // Select if not already selected
    }
    const selectedBrandString = this.selectedBrandValues.join(','); // Convert array to comma-separated string
    this.emitFilterChangeEvent(selectedBrandString);  }
  
  isSelected(spec: string): boolean {
    return this.selectedBrandValues.indexOf(spec) > -1;
  }
  
  filter(type: string) {
    if (type === 'seeMost') {
      this.isSaleMostCheck = false;
      this.isSeeMostCheck = !this.isSeeMostCheck;
    } else if (type === 'saleMost') {
      this.isSeeMostCheck = false;
      this.isSaleMostCheck = !this.isSaleMostCheck;
    }
    const selectedBrandString = this.selectedBrandValues.join(',');
    this.emitFilterChangeEvent(selectedBrandString);
  }
  
  selectBrand(nameBrand: string) {
    this.isSeeMostCheck = false;
    this.isSaleMostCheck = false;
    this.selectedBrandValues.push(nameBrand);
    const selectedBrandString = this.selectedBrandValues.join(','); // Convert array to comma-separated string
    this.emitFilterChangeEvent(selectedBrandString);
  }
  emitFilterChangeEvent(selectedBrand: string) {
    this.filterChange.emit({
      saleMost: this.isSaleMostCheck,
      seeMost: this.isSeeMostCheck,
      selectedBrand: selectedBrand
    });
  }
}
