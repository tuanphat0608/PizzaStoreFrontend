import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ISlideBar } from '../models/dash-board-models';
import { ICategory } from "../../../model/model";
import { RouterConstants } from "../../../share/router-constants";
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import Utils from "../../../share/utils/utils";
import { SettingService } from "../../../share/services/setting.service";

@Component({
  selector: 'app-slide-product',
  templateUrl: './slide-product.component.html',
  styleUrls: ['./slide-product.component.scss',]
})


export class SlideProductComponent implements OnInit {
  scrollState = '0';
  @Input() menuRequire: boolean;
  isPhoneSm: boolean = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }
  @Input()
  advertiseCategories: ICategory[];
  listImg: string[] = []
  newsUrl: any;
  constructor(private router: Router,
    private renderer: Renderer2,
    private settingService: SettingService,
    private el: ElementRef,
    private viewportScroller: ViewportScroller) {

  }
  checkScreenSize(): void {
    this.isPhoneSm = window.innerWidth < 575;
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.settingService.getSetting().subscribe(res => {
      if (this.advertiseCategories)
        this.advertiseCategories.forEach(item => this.listImg.push(this.isPhoneSm ? item.advertise_image_mobile?.path : item.advertise_image?.path))
      this.listImg = [this.isPhoneSm ? res.banner_image_mobile?.path : res.banner_image?.path, ...this.listImg];
      this.listImg = this.listImg.filter(img => img != undefined);
      this.newsUrl = res.url_banner;
    })
  }

  goToCategory(img: string) {
    console.log(this.advertiseCategories)
    const category = this.advertiseCategories.find(x => this.isPhoneSm ? x.advertise_image_mobile?.path == img : x.advertise_image?.path == img)
    if (!category) {
      window.open(this.newsUrl, "_self")
    } else {
      this.router.navigate(
        [Utils.removeAccentChar(category.full_name.toLowerCase().replaceAll(" ", "-"))],
        { state: { category_id: category.id } }
      ).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }
}
