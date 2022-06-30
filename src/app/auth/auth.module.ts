import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {BackendErrorInterceptor} from './interceptors/backend-error.interceptor.service';
import {LogUserInterceptor} from './interceptors/log-user.interceptor.service';
import {TokenInterceptor} from './interceptors/token.interceptor.service';

@NgModule({
  declarations: [
    // Screens as Login, register and so on
  ],
  imports: [
    // Angular
    CommonModule,

    // Author
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogUserInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendErrorInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {
}
