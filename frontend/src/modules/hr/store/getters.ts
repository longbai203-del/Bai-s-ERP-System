/**
 * HR模块Getters
 * @module modules/hr/store/getters
 */

import { HrState, Employee, EmployeeStatus, Department, PayrollRecord, AttendanceRecord } from './types';

export const getters = {
  // 基础Getters
  getEmployees: (state: HrState): Employee[] => state.employees,
  getCurrentEmployee: (state: HrState): Employee | null => state.currentEmployee,
  getDepartments: (state: HrState): Department[] => state.departments,
  getPayrollRecords: (state: HrState): PayrollRecord[] => state.payrollRecords,
  getAttendanceRecords: (state: HrState): AttendanceRecord[] => state.attendanceRecords,
  getStats: (state: HrState): EmployeeStats | null => state.stats,
  getTotal: (state: HrState): number => state.total,
  isLoading: (state: HrState): boolean => state.loading,
  getError: (state: HrState): string | null => state.error,
  getCurrentPage: (state: HrState): number => state.filters.page || 1,
  getPageSize: (state: HrState): number => state.filters.limit || 20,
  getFilters: (state: HrState): EmployeeQueryParams => state.filters,

  // 员工筛选Getters
  getActiveEmployees: (state: HrState): Employee[] => {
    return state.employees.filter((e) => e.status === EmployeeStatus.ACTIVE);
  },

  getOnLeaveEmployees: (state: HrState): Employee[] => {
    return state.employees.filter((e) => e.status === EmployeeStatus.ON_LEAVE);
  },

  getProbationEmployees: (state: HrState): Employee[] => {
    return state.employees.filter((e) => e.status === EmployeeStatus.PROBATION);
  },

  getTerminatedEmployees: (state: HrState): Employee[] => {
    return state.employees.filter((e) => e.status === EmployeeStatus.TERMINATED);
  },

  // 部门相关Getters
  getDepartmentTree: (state: HrState): Department[] => {
    const departments = [...state.departments];
    const map = new Map<string, Department>();
    const roots: Department[] = [];

    departments.forEach((d) => map.set(d.id, { ...d, children: [] }));
    departments.forEach((d) => {
      if (d.parentId && map.has(d.parentId)) {
        const parent = map.get(d.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(map.get(d.id)!);
      } else {
        roots.push(map.get(d.id)!);
      }
    });

    return roots;
  },

  getDepartmentEmployees: (state: HrState) => (departmentId: string): Employee[] => {
    return state.employees.filter((e) => e.department === departmentId);
  },

  // 薪资相关Getters
  getTotalSalary: (state: HrState): number => {
    return state.employees.reduce((sum, e) => sum + e.salary, 0);
  },

  getAverageSalary: (state: HrState): number => {
    if (state.employees.length === 0) return 0;
    return getters.getTotalSalary(state) / state.employees.length;
  },

  getSalaryByDepartment: (state: HrState): Record<string, number> => {
    const result: Record<string, number> = {};
    state.employees.forEach((e) => {
      result[e.department] = (result[e.department] || 0) + e.salary;
    });
    return result;
  },

  getPayrollStats: (state: HrState): { total: number; paid: number; pending: number } => {
    const stats = { total: 0, paid: 0, pending: 0 };
    state.payrollRecords.forEach((p) => {
      stats.total += p.netSalary;
      if (p.status === 'paid') stats.paid += p.netSalary;
      else if (p.status === 'pending') stats.pending += p.netSalary;
    });
    return stats;
  },

  // 考勤相关Getters
  getTodayAttendance: (state: HrState): AttendanceRecord[] => {
    const today = new Date().toISOString().split('T')[0];
    return state.attendanceRecords.filter((a) => a.date === today);
  },

  getAttendanceByDate: (state: HrState) => (date: string): AttendanceRecord[] => {
    return state.attendanceRecords.filter((a) => a.date === date);
  },

  getAttendanceStats: (state: HrState): { present: number; absent: number; late: number; leave: number } => {
    const stats = { present: 0, absent: 0, late: 0, leave: 0 };
    state.attendanceRecords.forEach((a) => {
      stats[a.status as keyof typeof stats] = (stats[a.status as keyof typeof stats] || 0) + 1;
    });
    return stats;
  },

  // 统计Getters
  getDepartmentStats: (state: HrState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.employees.forEach((e) => {
      stats[e.department] = (stats[e.department] || 0) + 1;
    });
    return stats;
  },

  getPositionStats: (state: HrState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.employees.forEach((e) => {
      stats[e.position] = (stats[e.position] || 0) + 1;
    });
    return stats;
  },

  getRecentEmployees: (state: HrState, limit: number = 10): Employee[] => {
    return [...state.employees]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getUpcomingAnniversaries: (state: HrState): Employee[] => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    return state.employees.filter((e) => {
      const hireDate = new Date(e.hireDate);
      return hireDate.getMonth() === month && hireDate.getDate() === day && e.status !== EmployeeStatus.TERMINATED;
    });
  },
};

export default getters;