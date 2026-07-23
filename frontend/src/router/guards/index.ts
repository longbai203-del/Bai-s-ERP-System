import { Router } from 'vue-router';
import setupAuthGuard from './auth';
import setupPermissionGuard from './permission';

export function setupGuards(router: Router) {
  setupAuthGuard(router);
  setupPermissionGuard(router);
}

export { default as setupAuthGuard } from './auth';
export { default as setupPermissionGuard } from './permission';
