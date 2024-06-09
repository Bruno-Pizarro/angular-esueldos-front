import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor() {}

  setItem(name: string, value: string, expirationDateString: string): void {
    let expires = '';
    if (expirationDateString) {
      const date = new Date(expirationDateString);
      if (!isNaN(date.getTime())) {
        expires = '; expires=' + date.toUTCString();
      } else {
        console.error('Invalid expiration date format');
        return;
      }
    }
    const valueWithExpiration = `${value}|${expirationDateString}`;
    document.cookie = `${name}=${encodeURIComponent(
      valueWithExpiration
    )}${expires}; path=/`;
  }

  getItem(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        return value.split('|')[0];
      }
    }
    return null;
  }

  removeItem(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  }

  getItemExpiration(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        const parts = value.split('|');
        if (parts.length === 2) {
          return parts[1];
        }
      }
    }
    return null;
  }
}
