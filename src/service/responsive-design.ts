import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveDesign {
  breakpointObserver = inject(BreakpointObserver);
  
}
