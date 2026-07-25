/**
 * HR模块状态
 * @module modules/hr/store/state
 */

import { HrState, EmployeeQueryParams, EmployeeStats } from './types';

const defaultFilters: EmployeeQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const defaultStats: EmployeeStats = {
  total: 0,
  byStatus: { active: 0, on_leave: 0, terminated: 0, probation: 0 },
  byDepartment: {},
  byGender: { male: 0, female: 0, other: 0 },
  averageSalary: 0,
  totalSalary: 0,
  activeCount: 0,
  newHiresThisMonth: 0,
  terminatedThisMonth: 0,
};

export const state: HrState = {
  employees: [],
  currentEmployee: null,
  departments: [],
  payrollRecords: [],
  attendanceRecords: [],
  stats: { ...defaultStats },
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

export function resetState(): HrState {
  return {
    employees: [],
    currentEmployee: null,
    departments: [],
    payrollRecords: [],
    attendanceRecords: [],
    stats: { ...defaultStats },
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;