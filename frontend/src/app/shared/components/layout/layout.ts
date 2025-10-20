import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { filter, map, mergeMap, Observable, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  @Input() pageTitle: string = 'Books';

  appTitle = 'Jejak Buku';

  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Optionally update page title from route data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.pageTitle = data['title'] || 'Books';
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
