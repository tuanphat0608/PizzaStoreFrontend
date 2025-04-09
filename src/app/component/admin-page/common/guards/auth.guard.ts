import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { RouterConstants } from "src/app/share/router-constants";
import { PermisisonService } from "src/app/share/services/permisison.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  isTokenAvalible :boolean ;
  constructor(private router: Router ,private permisisonService:PermisisonService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authenticate(next);
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authenticate(next);
  }

  authenticate(next: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = JSON.parse(localStorage.getItem('userData'));
    if (isAuth) {
      return new Observable<boolean | UrlTree>(observer => {
        this.permisisonService.checkToken(isAuth?._token).subscribe(data => {
          const userRolesFromStorage = localStorage.getItem('role');
          const userRoles = userRolesFromStorage ? JSON.parse(userRolesFromStorage) : [];
          const requiredRoles = next.data['requiredRoles'];
          if (data && requiredRoles.some(role => userRoles.includes(role))) {
            observer.next(true);
            observer.complete();
          } else {
            observer.next(this.router.parseUrl(`${RouterConstants.ADMIN}/${RouterConstants.LOGIN}`));
            observer.complete();
          }
        });
      });
    } else {
      return this.router.parseUrl(`${RouterConstants.ADMIN}/${RouterConstants.LOGIN}`);
    }
  
  }
}
