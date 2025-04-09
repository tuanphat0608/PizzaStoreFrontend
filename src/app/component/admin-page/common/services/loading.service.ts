import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');

  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  constructor() { }


  show(loadingMessage?: string) {
    const _loadingId = `${new UUID()}`;
    this.setLoading(true, _loadingId);
    this.loadingMessage.next(loadingMessage || 'Please wait ...');
    return _loadingId;
  }

  hide(loadingId: string) {
    this.setLoading(false, loadingId);
    this.loadingMessage.next('');
  }

  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error("The request URL must be provided to the LoadingService.setLoading function");
    }

    if (loading === true) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    } else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }


}
