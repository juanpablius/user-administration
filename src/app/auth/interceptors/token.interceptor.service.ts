import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {WHITE_LIST} from '../constants';
import {OAuthConfigurationService} from '../services/oauth-configuration.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public constructor(
      private readonly _oAuthConfigurationService: OAuthConfigurationService,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._oAuthConfigurationService.getToken() && !WHITE_LIST.some((domain: string) => req.url.includes(domain))) {
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${this._oAuthConfigurationService.getToken()}`)});
    }
    return next.handle(req);
  }
}
