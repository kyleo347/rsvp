import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth.config';
import * as auth0 from 'auth0-js';

// Avoid name not found warnings
declare var auth0: any;

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: any;
  isAdmin: boolean;
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // If authenticated, set local profile property
    // and update login status subject.
    // If not authenticated but there are still items
    // in localStorage, log out.
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
        this.userProfile = JSON.parse(lsProfile);
        this.isAdmin = localStorage.getItem('isAdmin') === 'true' ;
        this.setLoggedIn(true);
    } else if (!this.tokenValid && lsProfile) {
        this.logout();
    }
  }

    setLoggedIn(value: boolean) {
        this.loggedIn$.next(value);
        this.loggedIn = value;
    }

    login(redirect?: string) {
        // set URL redirect for after login
        const _redirect = redirect ? redirect : this.router.url;
        localStorage.setItem('authRedirect', _redirect);
        // Auth0 authentication
        this._auth0.authorize();
    }

    handleAuth() {
        // when auth0 hash parsed, get profile
        this._auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash =  '';
                this._getProfile(authResult);
            } else if (err) {
                this._clearRedirect();
                this.router.navigate(['/']);
                console.error(`Error authenticating: ${err.error}`);
            }
            this.router.navigate(['/']);
        });
    }

    private _getProfile(authResult) {
        // use access token to retrieve the user's profile and set session
        this._auth0.client.userInfo(authResult.accessToken, (err, profile) =>{
            if (profile) {
                this._setSession(authResult, profile);
                this.router.navigate([localStorage.getItem('authRedirect') || '/']);
                this._clearRedirect();
            } else if (err) {
                console.error(`Error authenticating: ${err.error}`);
            }
            this._redirect();
            this._clearRedirect();
        });
    }

    private _setSession(authResult, profile) {
        // save session data and update login status subject
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
        // set tokens and expiration in localStorage and props
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        // update login status in loggedIn$ stream
        this.isAdmin = this._checkAdmin(profile);
        localStorage.setItem('isAdmin', this.isAdmin.toString());
        this.setLoggedIn(true);
    }

    private _checkAdmin(profile) {
        // check if user has the admin role
        const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
        return roles.indexOf('admin') > -1;
    }

    private _redirect() {
        // redirect with or without tab parameter
        const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
        const redirectArr = fullRedirect.split('?tab=');
        const navArr = [redirectArr[0] || '/'];
        const tabObj = redirectArr[1] ? { queryParams: { tab: redirectArr[1] } } : null;

        if (!tabObj) {
            this.router.navigate(navArr);
        } else {
            this.router.navigate(navArr, tabObj);
        }
    }
    private _clearRedirect() {
        // remove redirect from local storage
        localStorage.removeItem('authRedirect');
    }

    logout()  {
        // ensure all auth items removed from localstorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('authRedirect');
        localStorage.removeItem('isAdmin');
        this._clearRedirect();
        // reset local properties, update loggedIn$stream
        this.userProfile = undefined;
        this.isAdmin = undefined;
        this.setLoggedIn(false);
        // return to homepage
        this.router.navigate(['/']);
    }

    get tokenValid(): boolean{
        // check if current time is past access token' expiration
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return Date.now() < expiresAt;
    }

}
