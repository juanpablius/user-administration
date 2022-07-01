import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WarningPopupComponent, WarningPopupInput} from 'src/app/shared/components/warning/warning-popup.component';

@Injectable()
export class BackendErrorInterceptor implements HttpInterceptor {
  public constructor(private _dialog: MatDialog) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError((httpResponse: any) => {
          this._check401Error(httpResponse);
          this._check500Error(httpResponse);
          return throwError(httpResponse);
        }),
    );
  }

  private _check401Error(httpResponse: HttpResponse<any>): void {
    if (httpResponse instanceof HttpErrorResponse && (httpResponse.error === 401 || httpResponse.status === 401)) {
      const data: WarningPopupInput = {
        headerMessage: 'You are not allowed to perform this action',
        errorMessage: `You don't have permission to perform this action`,
      };

      this._dialog.open(WarningPopupComponent, {
        width: '800px',
        data,
      });
    }
  }

  private _check500Error(httpResponse: HttpResponse<any>): any {
    if (httpResponse instanceof HttpErrorResponse && (httpResponse.error === 500 || httpResponse.status === 500)) {
      const data: WarningPopupInput = {
        headerMessage: 'Internal server error',
        errorMessage: `Backend failed please try later`,
      };

      this._dialog.open(WarningPopupComponent, {
        width: '800px',
        data,
      });
    }
  }
}
