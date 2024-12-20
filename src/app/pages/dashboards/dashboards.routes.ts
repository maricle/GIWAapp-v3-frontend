import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard5Component } from './dashboard5/dashboard5.component';
import { AppDashboard6Component } from './dashboard6/dashboard6.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: AppDashboard1Component,
        data: {
          title: 'Dashboard 1',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Dashboard 1' },
          ],
        },
      },
      {
        path: 'dashboard5',
        component: AppDashboard5Component,
        data: {
          title: 'Main Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Dashboard' },
          ],
        },
      },
      {
        path: 'dashboard6',
        component: AppDashboard6Component,
        data: {
          title: 'Dashboard 6',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Dashboard 6' },
          ],
        },
      },
    ],
  },
];
