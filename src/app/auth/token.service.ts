import { Injectable, OnDestroy } from '@angular/core';
import { PermisisonService } from 'src/app/share/services/permisison.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import { share } from 'rxjs/operators';
import { TOKEN_KEY, TOKEN_TYPE } from '../system.constant';
import { currentTimestamp, filterObject } from './helpers';
import { Token } from './interface';
import { BaseToken } from './token';
import { TokenFactory } from './token-factory.service';
import { LocalStorageService } from '../share/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService implements OnDestroy {

  private change$ = new BehaviorSubject<BaseToken | undefined>(undefined);
  private refresh$ = new Subject<BaseToken | undefined>();
  private timer$?: Subscription;

  private _token?: BaseToken;

  constructor(
    private store: LocalStorageService,
    private factory: TokenFactory,
    private permisisonService: PermisisonService
  ) { }

  private get token(): BaseToken | undefined {
    if (!this._token) {
      this._token = this.factory.create(this.store.get(TOKEN_KEY));
    }

    return this._token;
  }

  change(): Observable<BaseToken | undefined> {
    return this.change$.pipe(share());
  }

  refresh(): Observable<BaseToken | undefined> {
    this.buildRefresh();

    return this.refresh$.pipe(share());
  }

  set(token?: Token): TokenService {
    this.save(token);
    return this;
  }

  clear(): void {
    this.save();
  }

  valid(): boolean {
    return this.token?.valid() ?? false;
  }

  getBearerToken(): string {
    return this.token?.getBearerToken() ?? '';
  }

  getRefreshToken(): string | void {
    return this.token?.refresh_token;
  }

  ngOnDestroy(): void {
    this.clearRefresh();
  }

  getStoredToken() {
    return this._token;
  }

  private save(token?: Token): void {
    this._token = undefined;
    if (!token) {
      this.store.remove(TOKEN_KEY);
    } else {
      const value = Object.assign({ access_token: '', token_type: `${TOKEN_TYPE}` }, token, {
        exp: token['token'].expires_in ? null : currentTimestamp() + token['token'].expires_in,
        refresh_token: token['token'].refresh_token
      });
      this.permisisonService.setPermission((token['permissions'] as Array<any>).map(m => m.code));
      this.store.set(TOKEN_KEY, filterObject(value));
    }
    this.change$.next(this.token);
    this.buildRefresh();
  }

  private buildRefresh() {
    this.clearRefresh();

    if (this.token?.needRefresh()) {
      this.timer$ = timer((this.token.getRefreshTime()-1) * 1000).subscribe(() => {
        this.refresh$.next(this.token);
      });
    }
  }

  private clearRefresh() {
    if (this.timer$ && !this.timer$.closed) {
      this.timer$.unsubscribe();
    }
  }
}
