import { Route } from 'vue-router';

import { authService } from '@/services/auth';
import { notificationHelper } from './notification-helper';
import { i18nHelper } from './i18n-helper';

export function routerPermissionGuard(to: Route, from: Route, next: (option?: any) => void) {
  if (authService.user && authService.user.featrues) {
    next();
  } else if (from.path === '/') {
    next({ path: '/401', replace: true });
  } else {
    notificationHelper.error(i18nHelper.getLocale('framework.nonpermission'), '401');
    next({ path: from.path, replace: true });
  }
}
