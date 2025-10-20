import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { BookTrackerComponent } from './features/book-tracker/book-tracker.component';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', component: BookTrackerComponent }
        ]
    }
];
