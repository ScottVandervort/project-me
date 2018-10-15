import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewSelectorComponent } from './new-view-selector.component';

describe('NewViewSelectorComponent', () => {
  let component: NewViewSelectorComponent;
  let fixture: ComponentFixture<NewViewSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewViewSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
