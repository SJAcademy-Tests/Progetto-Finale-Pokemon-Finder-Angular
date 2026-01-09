import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { provideHttpClient } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  providers: [
    provideHttpClient(), // registra HttpClient
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:3306/graphql', // URL diretto al backend
        }),
      }),
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
