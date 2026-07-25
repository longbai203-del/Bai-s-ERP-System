/**
 * HR模块Mutations
 * @module modules/hr/store/mutations
 */

import { HrState, Employee, Department, PayrollRecord, AttendanceRecord, EmployeeQueryParams } from './types';

export const mutations = {
  // 员工相关
  SET_EMPLOYEES(state: HrState, employees: Employee[]): void {
    state.employees = employees;
  },

  SET_CURRENT_EMPLOYEE(state: HrState, employee: Employee | null): void {
    state.currentEmployee = employee;
  },

  SET_TOTAL(state: HrState, total: number): void {
    state.total = total;
  },

  SET_STATS(state: HrState, stats: EmployeeStats): void {
    state.stats = stats;
  },

  ADD_EMPLOYEE(state: HrState, employee: Employee): void {
    state.employees.unshift(employee);
    state.total += 1;
  },

  UPDATE_EMPLOYEE(state: HrState, employee: Employee): void {
    const index = state.employees.findIndex((e) => e.id === employee.id);
    if (index !== -1) {
      state.employees[index] = employee;
    }
    if (state.currentEmployee?.id === employee.id) {
      state.currentEmployee = employee;
    }
  },

  DELETE_EMPLOYEE(state: HrState, id: string): void {
    state.employees = state.employees.filter((e) => e.id !== id);
    state.total -= 1;
    if (state.currentEmployee?.id === id) {
      state.currentEmployee = null;
    }
  },

  UPDATE_EMPLOYEE_STATUS(state: HrState, { id, status }: { id: string; status: EmployeeStatus }): void {
    const employee = state.employees.find((e) => e.id === id);
    if (employee) {
      employee.status = status;
      employee.updatedAt = new Date().toISOString();
      if (status === EmployeeStatus.TERMINATED) {
        employee.terminatedAt = new Date().toISOString();
      }
    }
    if (state.currentEmployee?.id === id) {
      state.currentEmployee = employee || null;
    }
  },

  // 部门相关
  SET_DEPARTMENTS(state: HrState, departments: Department[]): void {
    state.departments = departments;
  },

  ADD_DEPARTMENT(state: HrState, department: Department): void {
    state.departments.push(department);
  },

  UPDATE_DEPARTMENT(state: HrState, department: Department): void {
    const index = state.departments.findIndex((d) => d.id === department.id);
    if (index !== -1) {
      state.departments[index] = department;
    }
  },

  DELETE_DEPARTMENT(state: HrState, id: string): void {
    state.departments = state.departments.filter((d) => d.id !== id);
  },

  // 薪资相关
  SET_PAYROLL_RECORDS(state: HrState, records: PayrollRecord[]): void {
    state.payrollRecords = records;
  },

  ADD_PAYROLL_RECORD(state: HrState, record: PayrollRecord): void {
    state.payrollRecords.unshift(record);
  },

  UPDATE_PAYROLL_RECORD(state: HrState, record: PayrollRecord): void {
    const index = state.payrollRecords.findIndex((p) => p.id === record.id);
    if (index !== -1) {
      state.payrollRecords[index] = record;
    }
  },

  // 考勤相关
  SET_ATTENDANCE_RECORDS(state: HrState, records: AttendanceRecord[]): void {
    state.attendanceRecords = records;
  },

  ADD_ATTENDANCE_RECORD(state: HrState, record: AttendanceRecord): void {
    state.attendanceRecords.unshift(record);
  },

  UPDATE_ATTENDANCE_RECORD(state: HrState, record: AttendanceRecord): void {
    const index = state.attendanceRecords.findIndex((a) => a.id === record.id);
    if (index !== -1) {
      state.attendanceRecords[index] = record;
    }
  },

  // 通用
  SET_LOADING(state: HrState, loading: boolean): void {
    state.loading = loading;
  },

  SET_ERROR(state: HrState, error: string | null): void {
    state.error = error;
  },

  SET_FILTERS(state: HrState, filters: Partial<EmployeeQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  RESET_FILTERS(state: HrState): void {
    state.filters = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' };
  },

  CLEAR_STATE(state: HrState): void {
    state.employees = [];
    state.currentEmployee = null;
    state.payrollRecords = [];
    state.attendanceRecords = [];
    state.total = 0;
    state.error = null;
  },

  CLEAR_ERROR(state: HrState): void {
    state.error = null;
  },
};

export default mutations;