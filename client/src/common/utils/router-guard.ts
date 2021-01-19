import { Route } from 'vue-router';

import { authService } from '@/services/auth';

export function routerGuard(to: Route, from: Route, next: (option?: any) => void) {
  authService.getAuthState().subscribe(
    () => {
      next();
    },
    error => {
      if (error && error.response && error.response.status === 401) {
        // 服务端会对 sso 接入进行直接跳转，所以此处可以使用 Router 进行跳转
        next(error.response.data);
      }
    }
  );
}
