import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {Observable, Subject} from 'rxjs';

const AUTH_CONFIGURATION: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '765370138215-gd294sgoh6kto9da7ve02uilin6514eq.apps.googleusercontent.com',

  // set the scope for the permissions the client should request
  // scope: '',
  showDebugInformation: true,
};

export interface UserInfo {
  info: {sub: string
    email: string,
    name: string,
    picture: string
  }
}

export interface TUserInfo extends UserInfo {
  accessToken: string;
}

@Injectable({providedIn: 'root'})
export class OAuthConfigurationService {
  public userInfo: UserInfo;
  private _userProfileSubject$ = new Subject<TUserInfo>();

  public constructor(
      private readonly _oAuthService: OAuthService,
  ) {
    this._setConfiguration();
  }

  public getUserProfileInfo$(): Observable<TUserInfo> {
    return this._userProfileSubject$.asObservable();
  }

  public async loginWithGoogle(): Promise<void> {
    await this._oAuthService.loadDiscoveryDocument();
    await this._oAuthService.tryLoginImplicitFlow();
    if (!this._oAuthService.hasValidAccessToken()) {
      this._oAuthService.initLoginFlow();
      return;
    }

    const userProfile: UserInfo = (await this._oAuthService.loadUserProfile()) as UserInfo;
    const accessToken: string = this._oAuthService.getAccessToken();
    this._userProfileSubject$.next({...userProfile, accessToken});
    this.userInfo = userProfile;
  }

  public getToken(): string {
    return this._oAuthService.getAccessToken();
  }

  public isLoggedIn(): boolean {
    return this._oAuthService.hasValidAccessToken();
  }

  public signOut(): void {
    this._oAuthService.logOut();
  }

  private _setConfiguration(): void {
    // confiure oauth2 service
    this._oAuthService.configure(AUTH_CONFIGURATION);
    // manually configure a logout url, because googles discovery document does
    // not provide it
    this._oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
  }
}