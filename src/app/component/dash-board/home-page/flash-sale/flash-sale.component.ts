import { ViewportScroller } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/model/model';
import Utils from 'src/app/share/utils/utils';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-flash-sale',
  templateUrl: './flash-sale.component.html',
  styleUrls: ['./flash-sale.component.scss'],
  // animations: [
  //   trigger('slideInOut', [
  //     transition(':increment', [
  //       style({ transform: 'translateX(100%)' }),
  //       animate('300ms ease-out', style({ transform: 'translateX(0%)' })),
  //     ]),
  //     transition(':decrement', [
  //       style({ transform: 'translateX(-100%)' }),
  //       animate('300ms ease-out', style({ transform: 'translateX(0%)' })),
  //     ]),
  //   ]),
  // ],
})
export class FlashSaleComponent  implements OnInit{
  @Input() products?: IProduct[];
  @Input() isWhiteBG: any = false;
  @Input() isHidingLogo: any = false;
  @Input() dateEnd : any;
  @Input() isShadow: any = true;

  targetDate: Date;
  countdown: any;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  randomProgressValue : number;
  randomProgressText : string;
  constructor(private router: Router,private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.targetDate = new Date(this.dateEnd);

    // Update the countdown every second
    this.countdown = setInterval(() => {
      this.updateCountdown();
    }, 1000);
    this.randomProgressValue = this.getRandomNumber(40, 80);
    this.randomProgressText = 'Đã Bán ' + this.getRandomNumber(70, 350);  
  }
    updateCountdown() {
      const currentDate = new Date();
      const difference = this.targetDate.getTime() - currentDate.getTime();
  
      if (difference > 0) {
        this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      } else {
        this.days = this.hours = this.minutes = this.seconds = 0;
        clearInterval(this.countdown);
      }
    }
    getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    navigateToProductDetail( product : IProduct) {
      const categoryName = product?.categories[0].name.replaceAll(" ","-").replaceAll("\n","");
      this.router.navigate(
        [categoryName, Utils.removeAccentChar(product?.name.replaceAll(" ","-").replaceAll("\n",""))],
        { state: { product_id: product?.id } }
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
}
