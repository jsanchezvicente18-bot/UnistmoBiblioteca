import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandarReporte } from './mandar-reporte';

describe('MandarReporte', () => {
  let component: MandarReporte;
  let fixture: ComponentFixture<MandarReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandarReporte],
    }).compileComponents();

    fixture = TestBed.createComponent(MandarReporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
