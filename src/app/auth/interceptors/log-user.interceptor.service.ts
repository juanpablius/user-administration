import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {WHITE_LIST} from '../constants';
import {OAuthConfigurationService, UserInfo} from '../services/oauth-configuration.service';

const enum Methods {
  Delete = 'DELETE',
  Get = 'GET',
  Post = 'POST',
  Update = 'PUT',
}

@Injectable()
export class LogUserInterceptor implements HttpInterceptor {
  public constructor(
      private readonly _oauthConfigurationService: OAuthConfigurationService,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userInfo: UserInfo = this._oauthConfigurationService.userInfo;

    if (this._isInWhiteList(req)) {
      return next.handle(req);
    }

    switch (req.method) {
      case Methods.Post:
        req = req.clone({
          headers: req.headers.set('Accept', 'application/json'),
          body: {
            ...req.body,
            own: userInfo.info.sub,
          },
        });
        break;

      default:
        break;
    }
    return next.handle(req);
  }

  private _isInWhiteList(req: any): boolean {
    return WHITE_LIST.some((domain: string) => domain === req.url);
  }
}
