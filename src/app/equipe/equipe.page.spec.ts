import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipePage } from './equipe.page';

describe('EquipePage', () => {
  let component: EquipePage;
  let fixture: ComponentFixture<EquipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
