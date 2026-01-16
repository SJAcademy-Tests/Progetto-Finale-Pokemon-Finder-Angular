import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { routes } from './app.routes';
<<<<<<< HEAD
import { environment } from '../environments/environment';
=======
import { environment } from '../environment/environment';
>>>>>>> backendBranch

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
<<<<<<< HEAD

      return {
        link: httpLink.create({
          uri: 'https://pokemonapp-backend-production-2e37.up.railway.app/graphql',
=======
      //controllo
      if(environment.url ) console.log("URL ATTUALMENTE IN USO: ",environment.url)
      const token = btoa(`${environment.basicAuthUser}:${environment.basicAuthPass}`);
  
      return {
        link: httpLink.create({
          uri: `${environment.url}`,
>>>>>>> backendBranch
          headers: new HttpHeaders({
            Authorization: `Basic ${environment.graphqlBasicAuth}`
          }),
          withCredentials: true,
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
