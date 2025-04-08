import { environment } from 'src/environments/environment';

export const API = {
  AUTH: {
    LOGIN: `api/${environment.apiVersion}/auth/login`,
    REGISTER: `api/${environment.apiVersion}/auth/register`,
  },
  USER_PERMIISON: "user-permission"
};

export const CORE_URL = `api/${environment.apiVersion}`;
