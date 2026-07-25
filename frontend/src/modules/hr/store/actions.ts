/**
 * HR模块Actions
 * @module modules/hr/store/actions
 */

import { Commit } from 'vuex';
import {
  Employee,
  Department,
  PayrollRecord,
  AttendanceRecord,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQueryParams,
} from './types';
import { hrApi } from '@/api/hr';

export const actions = {
  // 员工管理
  async fetchEmployees({ commit }: { commit: Commit }, params: EmployeeQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await hrApi.getEmployees(params);
      commit('SET_EMPLOYEES', response.data.items);
      commit('SET_TOTAL', response.data.total);
      if (response.data.stats) {
        commit('SET_STATS', response.data.stats);
      }
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取员工列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchEmployeeDetail({ commit }: { commit: Commit }, id: string): Promise<Employee> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await hrApi.getEmployeeDetail(id);
      commit('SET_CURRENT_EMPLOYEE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取员工详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createEmployee({ commit }: { commit: Commit }, data: CreateEmployeeRequest): Promise<Employee> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await hrApi.createEmployee(data);
      commit('ADD_EMPLOYEE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建员工失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateEmployee(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdateEmployeeRequest }
  ): Promise<Employee> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await hrApi.updateEmployee(id, data);
      commit('UPDATE_EMPLOYEE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新员工失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateEmployeeStatus(
    { commit }: { commit: Commit },
    { id, status }: { id: string; status: EmployeeStatus }
  ): Promise<Employee> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await hrApi.updateEmployeeStatus(id, status);
      commit('UPDATE_EMPLOYEE_STATUS', { id, status: response.data.status });
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新员工状态失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteEmployee({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      await hrApi.deleteEmployee(id);
      commit('DELETE_EMPLOYEE', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除员工失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 部门管理
  async fetchDepartments({ commit }: { commit: Commit }): Promise<void> {
    try {
      const response = await hrApi.getDepartments();
      commit('SET_DEPARTMENTS', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取部门列表失败');
      throw error;
    }
  },

  async createDepartment({ commit }: { commit: Commit }, data: any): Promise<Department> {
    try {
      const response = await hrApi.createDepartment(data);
      commit('ADD_DEPARTMENT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建部门失败');
      throw error;
    }
  },

  // 薪资管理
  async fetchPayrollRecords({ commit }: { commit: Commit }, params: { employeeId?: string; period?: string }): Promise<void> {
    try {
      const response = await hrApi.getPayrollRecords(params);
      commit('SET_PAYROLL_RECORDS', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取薪资记录失败');
      throw error;
    }
  },

  async createPayrollRecord({ commit }: { commit: Commit }, data: any): Promise<PayrollRecord> {
    try {
      const response = await hrApi.createPayrollRecord(data);
      commit('ADD_PAYROLL_RECORD', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建薪资记录失败');
      throw error;
    }
  },

  // 考勤管理
  async fetchAttendanceRecords({ commit }: { commit: Commit }, params: { employeeId?: string; startDate?: string; endDate?: string }): Promise<void> {
    try {
      const response = await hrApi.getAttendanceRecords(params);
      commit('SET_ATTENDANCE_RECORDS', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取考勤记录失败');
      throw error;
    }
  },

  async createAttendanceRecord({ commit }: { commit: Commit }, data: any): Promise<AttendanceRecord> {
    try {
      const response = await hrApi.createAttendanceRecord(data);
      commit('ADD_ATTENDANCE_RECORD', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建考勤记录失败');
      throw error;
    }
  },

  // 通用
  setFilters({ commit }: { commit: Commit }, filters: Partial<EmployeeQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  clearError({ commit }: { commit: Commit }): void {
    commit('CLEAR_ERROR');
  },

  clearState({ commit }: { commit: Commit }): void {
    commit('CLEAR_STATE');
  },
};

export default actions;