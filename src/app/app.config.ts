import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { routes } from './app.routes';
import { environment } from '../environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      //controllo
      if(environment.url ) console.log("URL ATTUALMENTE IN USO: ",environment.url)
      const token = btoa(`${environment.basicAuthUser}:${environment.basicAuthPass}`);
  
      return {
        link: httpLink.create({
          uri: `${environment.url}`,
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
