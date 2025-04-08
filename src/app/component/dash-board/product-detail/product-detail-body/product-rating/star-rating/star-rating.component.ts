import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input() rating: number;
  @Input() readonly = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars: string[] = ['star', 'star', 'star', 'star', 'star'];

  rate(selectedRating: number): void {
    if (!this.readonly) {
      this.rating = selectedRating;
      this.ratingChange.emit(this.rating);
    }
  }

  onMouseOver(event: MouseEvent): void {
    if (!this.readonly) {
      const hoveredRating = Math.ceil(event.clientX / (event.target as HTMLElement).offsetWidth * this.stars.length);
      this.highlightStars(hoveredRating);
    }
  }

  private highlightStars(count: number): void {
    this.stars = this.stars.map((star, index) => index < count ? 'star_rate' : 'star');
  }
}
