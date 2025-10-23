import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRelatoriosPage } from './admin-relatorios.page';

describe('AdminRelatoriosPage', () => {
  let component: AdminRelatoriosPage;
  let fixture: ComponentFixture<AdminRelatoriosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRelatoriosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
