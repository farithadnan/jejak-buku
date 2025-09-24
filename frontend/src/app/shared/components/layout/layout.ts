import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { filter, map, mergeMap, Observable, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  adminOnly: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  @Input() pageTitle: string = 'Dashboard';

  // Mock user observable for development
  currentUser$: Observable<any> = of({
    username: 'testuser',
    email: 'testuser@example.com',
    role: 'admin'
  });

  sidebarOpen: boolean = false;
  sidebarCollapsed: boolean = false;
  currentYear: number = new Date().getFullYear();

  navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      route: '/home',
      icon: 'M3 12l2-2m0 0l7-7 7 7',
      adminOnly: false
    },
    {
      label: 'My Books',
      route: '/books',
      icon: 'M9 7h6m0 10v-3m-3 3h.01',
      adminOnly: false
    },
    // {
    //   label: 'Add Book',
    //   route: '/books/add',
    //   icon: 'M17 9V7a2 2 0 00-2-2H5',
    //   adminOnly: false
    // },
    // {
    //   label: 'Profile',
    //   route: '/profile',
    //   icon: 'M15 6.75a3 3 0 1 1-6 0',
    //   adminOnly: false
    // },
    // {
    //   label: 'Settings',
    //   route: '/settings',
    //   icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0',
    //   adminOnly: false
    // }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // Get page title from route data
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
      this.pageTitle = data['title'] || 'Dashboard';
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarCollapse(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {

  }
}
