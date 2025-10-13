import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../../shared/services/book.service';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit, OnChanges {
  @Input() book: Partial<Book> = {};
  @Input() mode: 'edit' | 'create' = 'create';
  @Input() allGenres: string[] = [];
  @Output() save = new EventEmitter<Partial<Book>>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  imagePreview: string | ArrayBuffer | null = '';
  newGenre = '';

  unknownStartDate = false;
  unknownCompletedDate = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book'] || changes['allGenres']) {
      this.buildForm();
      this.cdr.detectChanges();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      imageUrl: [this.book.imageUrl || '', []],
      title: [this.book.title || '', [Validators.required]],
      author: [this.book.author || '', [Validators.required]],
      status: [this.book.status || 'planned', [Validators.required]],
      genres: [this.book.genres ? [...this.book.genres] : [], []],
      pages: [this.book.pages ?? '', [Validators.min(1)]],
      currentPage: [this.book.currentPage ?? '', [Validators.min(0)]],
      rating: [this.book.rating ?? undefined, []],
      notes: [this.book.notes || '', []],
      description: [this.book.description || '', []],
      startedDate: [{ value: this.book.startedDate || '', disabled: this.unknownStartDate }, []],
      completedDate: [{ value: this.book.completedDate || '', disabled: this.unknownCompletedDate }, []],
    });

    this.imagePreview = this.book.imageUrl || '';
  }

  addGenre() {
    const genre = this.newGenre.trim();
    if (genre && !this.form.value.genres.includes(genre)) {
      this.form.patchValue({ genres: [...this.form.value.genres, genre] });
    }
    this.newGenre = '';
  }

  removeGenre(index: number) {
    const genres = [...this.form.value.genres];
    genres.splice(index, 1);
    this.form.patchValue({ genres });
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      // Add userId (hardcoded for now, or get from auth/user service)
      const bookData = { ...this.form.value, userId: 1 };
      this.save.emit(bookData);
    }
  }

  onDelete() {
    this.delete.emit();
  }

  setUnknownDate(field: 'startedDate' | 'completedDate', value: boolean) {
    if (field === 'startedDate') {
      this.unknownStartDate = value;
      const control = this.form.get('startedDate');
      if (value) {
        control?.disable();
        control?.setValue('');
      } else {
        control?.enable();
      }
    } else {
      this.unknownCompletedDate = value;
      const control = this.form.get('completedDate');
      if (value) {
        control?.disable();
        control?.setValue('');
      } else {
        control?.enable();
      }
    }
  }

  removeImage() {
    this.imagePreview = '';
    this.form.patchValue({ imageUrl: '' });
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
