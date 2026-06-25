import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./request-form/request-form').then(m => m.RequestForm),
  },
  {
    path: 'chat/:caseId',
    loadComponent: () =>
      import('./chat/chat').then(m => m.Chat),
  },
];
