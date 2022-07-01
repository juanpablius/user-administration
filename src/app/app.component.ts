import {Component, OnInit} from '@angular/core';
import {tap} from 'rxjs';

import {OAuthConfigurationService, UserInfo} from './auth/services/oauth-configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'user-administration';
  public userInfo: UserInfo;

  public constructor(
      private readonly _oauthConfigurationService: OAuthConfigurationService,
  ) {
    this._oauthConfigurationService.loginWithGoogle();
  }

  public ngOnInit(): void {
    this._oauthConfigurationService.getUserProfileInfo$()
        .pipe(
            tap((userInfo: UserInfo) => this.userInfo = userInfo),
            )
        .subscribe();
  }

  public isLoggedIn(): boolean {
    return this._oauthConfigurationService.isLoggedIn();
  }

  public login(): void {
    this._oauthConfigurationService.loginWithGoogle();
  };

  public logout(): void {
    this._oauthConfigurationService.signOut();
  }
}
