import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndGameModal } from './end-game-modal';

describe('EndGameModal', () => {
  let component: EndGameModal;
  let fixture: ComponentFixture<EndGameModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndGameModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndGameModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
