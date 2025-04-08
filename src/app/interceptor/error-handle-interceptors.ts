import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, throwError } from "rxjs";

export enum STATUS_ERROR_CODE {
  BAD_REQUEST = 400,
  UNAHTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERAL_SERVER_ERROR = 500,
  SERVICES_UNAVAILABLE = 503,
  SERVER_DOWN = 504
}

@Injectable()
export class ErrorHandleInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    // switch (error.status) {
    //   case STATUS_ERROR_CODE.BAD_REQUEST:
    //     this.toastr.error('Lỗi');
    //     break;
    //   case STATUS_ERROR_CODE.UNAHTHORIZED:
    //     this.toastr.error('Lỗi');
    //     break;
    //   case STATUS_ERROR_CODE.FORBIDDEN:
    //     this.toastr.error('Lỗi');
    //     break;
    //   case STATUS_ERROR_CODE.NOT_FOUND:
    //     this.toastr.error('Lỗi');
    //     localStorage.setItem('errorStatus', error.status.toString());
    //     this.router.navigate(['/thong-bao/khong-tim-thay-trang']);
    //     break;
    //   case STATUS_ERROR_CODE.INTERAL_SERVER_ERROR:
    //     this.toastr.error('Lỗi');
    //     localStorage.setItem('errorStatus', error.status.toString());
    //     this.router.navigate(['/thong-bao/khong-tim-thay-trang']);
    //     break;
    //   case STATUS_ERROR_CODE.SERVER_DOWN:
    //     this.toastr.error('Lỗi');
    //     break;
    //   default:
    //     this.toastr.error('Lỗi');
    //     break;
    // }
    //
    // return throwError(() => error);
    this.toastr.error('Lỗi');
    localStorage.setItem('errorStatus', error.status.toString());
    if ([STATUS_ERROR_CODE.NOT_FOUND, STATUS_ERROR_CODE.INTERAL_SERVER_ERROR].includes(error.status)) {
      // this.router.navigate(['/thong-bao/khong-tim-thay-trang']);
    }
    return throwError(() => error);
  }
  private handleErrorRefactor(error: HttpErrorResponse) {
    this.toastr.error('Lỗi');
    localStorage.setItem('errorStatus', error.status.toString());
    if ([STATUS_ERROR_CODE.NOT_FOUND].includes(error.status)) {
      // this.router.navigate(['/thong-bao/khong-tim-thay-trang']);
    }
    return throwError(() => error);
  }

}
