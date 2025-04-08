import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import Utils from "../../../share/utils/utils";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  breadcrumbs: string[] = [];
  constructor(private breadcrumbService: BreadcrumbService, private router: Router) { }

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumbs().subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }
  breadcrumbClicked(breadcrumb: string) {
    const routePath = Utils.removeAccentChar(breadcrumb.toLowerCase());
    this.router.navigate([routePath]);
  }
}
