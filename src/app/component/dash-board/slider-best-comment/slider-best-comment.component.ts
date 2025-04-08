import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { IBestComment } from 'src/app/model/product';
import {IReview} from "../../../model/model";

@Component({
  selector: 'app-slider-best-comment',
  templateUrl: './slider-best-comment.component.html',
  styleUrls: ['./slider-best-comment.component.scss'],

})
export class SliderBestCommentComponent {

  @Input()
  bestReview: IReview[];

}
