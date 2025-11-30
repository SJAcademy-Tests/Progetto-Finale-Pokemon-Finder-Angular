import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentSize } from '../../service/component-size';
import { GameStore } from '../../service/game-store';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.scss'],
})
export class NavBar implements AfterViewInit {

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  constructor(
    private size: ComponentSize,
    private store: GameStore
  ) {}

  ngAfterViewInit() {
    const el = this.container.nativeElement;

    const rect = el.getBoundingClientRect();
    if (rect.height > 0) {
      this.store.updateNavbarHeight(rect.height);
      //console.log("Navbar initial height:", rect.height);
    }

    this.size.observeSize(el, (rect: DOMRectReadOnly) => {
      if (rect.height > 0) {
        this.store.updateNavbarHeight(rect.height);
        //console.log("Navbar updated height:", rect.height);
      }
    });
  }
}
