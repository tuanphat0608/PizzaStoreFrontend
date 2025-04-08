import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent {
  @Input() progressValue: number = 0; // Set your initial progress value
  @Input() progressText: string = '50%'; // Set your initial progress text
}
