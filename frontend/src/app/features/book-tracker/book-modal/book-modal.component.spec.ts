import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookModalComponent } from './book-modal.component';

describe('BookModalComponent', () => {
  let component: BookModalComponent;
  let fixture: ComponentFixture<BookModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark title as required', () => {
    component.form.get('title')?.setValue('');
    component.form.get('title')?.markAsTouched();
    fixture.detectChanges();
    expect(component.form.get('title')?.invalid).toBeTrue();
  });

  it('should emit save event when form is valid and onSubmit is called', () => {
    spyOn(component.save, 'emit');
    component.form.get('title')?.setValue('Test Book');
    component.form.get('author')?.setValue('Test Author');
    component.form.get('status')?.setValue('planned');
    component.onSubmit();
    expect(component.save.emit).toHaveBeenCalled();
  });
});
