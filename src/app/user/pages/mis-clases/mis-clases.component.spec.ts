import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisClasesComponent } from './mis-clases.component';

describe('MisClasesComponent', () => {
  let component: MisClasesComponent;
  let fixture: ComponentFixture<MisClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisClasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
