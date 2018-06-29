import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMenuComponent } from './users-menu.component';

describe('UsersMenuComponent', () => {
  let component: UsersMenuComponent;
  let fixture: ComponentFixture<UsersMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
