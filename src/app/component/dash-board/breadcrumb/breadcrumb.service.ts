import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<string[]>([]);

  getBreadcrumbs() {
    return this.breadcrumbs.asObservable();
  }

  setBreadcrumbs(breadcrumbs: string[]) {
    this.breadcrumbs.next(breadcrumbs);
  }
}
