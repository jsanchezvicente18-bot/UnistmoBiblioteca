import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactarAdmin } from './contactar-admin';

describe('ContactarAdmin', () => {
  let component: ContactarAdmin;
  let fixture: ComponentFixture<ContactarAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactarAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactarAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
