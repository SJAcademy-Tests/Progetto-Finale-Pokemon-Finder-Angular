import { Injectable, provideBrowserGlobalErrorListeners } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComponentSize {
  observeSize(el: HTMLElement, callback: (size: DOMRectReadOnly) => void){
    const observer = new ResizeObserver(entries => {
      for(const e of entries){
        callback(e.contentRect)
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }
}
