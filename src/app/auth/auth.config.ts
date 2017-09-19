import { ENV } from './../core/env.config';

interface AuthConfig {
    CLIENT_ID:string,
    CLIENT_DOMAIN:string,
    AUDIENCE:string,
    REDIRECT:string,
    SCOPE:string,
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'Cz49fvJRx1yRaVx7Ee17CAr1TdTzgLvr',
  CLIENT_DOMAIN: 'kyleo.auth0.com',
  AUDIENCE: 'http://localhost:8082/api/', 
  REDIRECT: `${ENV.BASE_URI}/callback`,
  SCOPE: 'openid profile'
}