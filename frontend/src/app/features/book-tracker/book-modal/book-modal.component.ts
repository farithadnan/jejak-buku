import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../../shared/services/book.service';

interface ConfirmAction {
  title: string;
  message: string;
  confirmText: string;
  type: 'delete' | 'discard' | 'save';
  callback: () => void;
}

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

  // Confirmation dialog properties
  showConfirmDialog = false;
  confirmAction: ConfirmAction = {
    title: '',
    message: '',
    confirmText: '',
    type: 'discard',
    callback: () => {}
  };

  // Track if user has interacted with the form
  hasInteracted = false;
  private initialFormValue: any = {};

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buildForm();
    this.storeInitialFormValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book'] || changes['allGenres']) {
      this.buildForm();
      this.storeInitialFormValue();
      this.cdr.detectChanges();
    }
  }

  buildForm() {
    // Check if dates should be disabled based on their values
    this.unknownStartDate = !this.book.startedDate || this.book.startedDate === '';
    this.unknownCompletedDate = !this.book.completedDate || this.book.completedDate === '';

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
      startedDate: [{
        value: this.book.startedDate || '',
        disabled: this.unknownStartDate
      }, []],
      completedDate: [{
        value: this.book.completedDate || '',
        disabled: this.unknownCompletedDate
      }, []],
      isbn: [this.book.isbn || '', []],
      publishedDate: [this.book.publishedDate || '', []],
    });

    this.imagePreview = this.book.imageUrl || '';
  }

  storeInitialFormValue() {
    // Store initial form value for comparison
    this.initialFormValue = JSON.stringify({
      ...this.form.value,
      imageUrl: this.imagePreview,
      unknownStartDate: this.unknownStartDate,
      unknownCompletedDate: this.unknownCompletedDate
    });
    this.hasInteracted = false;
  }

  markAsInteracted() {
    this.hasInteracted = true;
  }

  hasFormChanged(): boolean {
    if (!this.hasInteracted) return false;

    const currentValue = JSON.stringify({
      ...this.form.value,
      imageUrl: this.imagePreview,
      unknownStartDate: this.unknownStartDate,
      unknownCompletedDate: this.unknownCompletedDate
    });

    return this.initialFormValue !== currentValue;
  }

  onGenreKeydown(event: KeyboardEvent) {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      this.addGenre();
    }
  }

  addGenre() {
    const genre = this.newGenre.trim();
    if (genre && !this.form.value.genres.includes(genre)) {
      this.form.patchValue({ genres: [...this.form.value.genres, genre] });
      this.markAsInteracted();
    }
    this.newGenre = '';
  }

  removeGenre(index: number) {
    const genres = [...this.form.value.genres];
    genres.splice(index, 1);
    this.form.patchValue({ genres });
    this.markAsInteracted();
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ imageUrl: reader.result as string });
        this.markAsInteracted();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };

      // Handle disabled fields - don't include them if unknown is checked
      if (this.unknownStartDate) {
        formValue.startedDate = '';
      }
      if (this.unknownCompletedDate) {
        formValue.completedDate = '';
      }

      const bookData = {
        ...formValue,
        userId: 1,
        ...(this.book.id ? { id: this.book.id } : {})
      };
      this.save.emit(bookData);
    }
  }

  onCancel() {
    if (this.hasFormChanged()) {
      this.showConfirmation({
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to close without saving?',
        confirmText: 'Discard',
        type: 'discard',
        callback: () => {
          this.hideConfirmation();
          this.cancel.emit();
        }
      });
    } else {
      this.cancel.emit();
    }
  }

  onDelete() {
    this.showConfirmation({
      title: 'Delete Book?',
      message: 'Are you sure you want to delete this book? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'delete',
      callback: () => {
        this.hideConfirmation();
        this.delete.emit();
      }
    });
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
    this.markAsInteracted();
  }

  removeImage() {
    this.imagePreview = '';
    this.form.patchValue({ imageUrl: '' });
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.markAsInteracted();
  }

  // Confirmation dialog methods
  showConfirmation(action: ConfirmAction) {
    this.confirmAction = action;
    this.showConfirmDialog = true;
  }

  hideConfirmation() {
    this.showConfirmDialog = false;
  }

  cancelConfirmation() {
    this.hideConfirmation();
  }
}
