import { Route } from 'vue-router';

import { authService } from '@/services/auth';

export function routerLoginGuard(to: Route, from: Route, next: (option?: any) => void) {
  authService.getAuthState().subscribe(
    () => {
      // 登录过的直接跳回首页，不允许再次登录
      next({ path: '/', replace: true });
    },
    error => {
      console.log('🚀error.response.data', error.response.data);
      if (error && error.response && error.response.status === 401 && error.response.data.startsWith('http')) {
        window.location.href = error.response.data;
      } else {
        next();
      }
    }
  );
}

export function routerLogoutGuard(to: Route, from: Route, next: (option?: any) => void) {
  authService.logout().subscribe(() => {
    if (authService.logoutUri.startsWith('http')) {
      window.location.href = authService.logoutUri;
    } else {
      next({ path: '/login', replace: true });
    }
  });
}
