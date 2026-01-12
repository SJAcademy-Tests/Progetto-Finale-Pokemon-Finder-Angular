import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      // Inserisci qui le tue credenziali per la Basic Auth
      const username = 'admin';
      const password = 'supersecret';
      const token = btoa(`${username}:${password}`); // Base64(username:password)

      return {
        link: httpLink.create({
          uri: 'http://localhost:3306/graphql',
          headers: new HttpHeaders({
            Authorization: `Basic ${token}`,
          }),
          withCredentials: true, // necessario se il backend usa cors con credentials
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};