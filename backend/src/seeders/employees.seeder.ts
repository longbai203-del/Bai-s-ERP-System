/**
 * 员工种子数据
 * 生成测试员工数据
 * @module seeders/employees.seeder
 */

import { Db } from 'mongodb';
import { faker } from '@faker-js/faker';

/**
 * 员工种子数据生成器
 */
export class EmployeesSeeder {
  private static instance: EmployeesSeeder;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): EmployeesSeeder {
    if (!EmployeesSeeder.instance) {
      EmployeesSeeder.instance = new EmployeesSeeder();
    }
    return EmployeesSeeder.instance;
  }

  /**
   * 生成员工数据
   */
  private generateEmployee(index: number): any {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Customer Service', 'Research & Development'];
    const positions = ['Manager', 'Senior', 'Junior', 'Intern', 'Lead', 'Director', 'VP', 'Associate'];
    const statuses = ['active', 'active', 'active', 'on_leave', 'active', 'probation'];

    return {
      employeeId: `EMP-${String(index + 1).padStart(6, '0')}`,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      department: faker.helpers.arrayElement(departments),
      position: faker.helpers.arrayElement(positions),
      managerId: faker.helpers.maybe(() => `EMP-${faker.number.int({ min: 1, max: 20 }).toString().padStart(6, '0')}`, { probability: 0.5 }),
      hireDate: faker.date.past({ years: 5 }),
      birthDate: faker.date.birthdate({ min: 22, max: 60, mode: 'age' }),
      status: faker.helpers.arrayElement(statuses),
      salary: faker.number.float({ min: 30000, max: 150000, fractionDigits: 0 }),
      address: faker.location.streetAddress(),
      emergencyContact: {
        name: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
        phone: faker.phone.number(),
      },
      documents: faker.helpers.arrayElements(['ID', 'Passport', 'Contract', 'Certification'], { min: 0, max: 3 }),
      skills: faker.helpers.arrayElements(['JavaScript', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'React', 'Node.js', 'MongoDB'], { min: 2, max: 6 }),
      createdAt: faker.date.past({ years: 5 }),
      updatedAt: new Date(),
    };
  }

  /**
   * 执行种子数据生成
   */
  async seed(db: Db, count: number = 50): Promise<number> {
    console.log(`[EmployeesSeeder] 开始生成 ${count} 条员工数据...`);

    const collection = db.collection('employees');
    const employees = [];

    for (let i = 0; i < count; i++) {
      employees.push(this.generateEmployee(i));
    }

    // 分批插入
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      try {
        const result = await collection.insertMany(batch, { ordered: false });
        insertedCount += result.insertedCount;
        console.log(`[EmployeesSeeder] 已插入 ${insertedCount}/${employees.length}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`[EmployeesSeeder] 跳过重复数据`);
        } else {
          console.error(`[EmployeesSeeder] 插入失败:`, error);
        }
      }
    }

    console.log(`[EmployeesSeeder] 完成，共插入 ${insertedCount} 条记录`);
    return insertedCount;
  }

  /**
   * 清空员工数据
   */
  async clear(db: Db): Promise<number> {
    const collection = db.collection('employees');
    const result = await collection.deleteMany({});
    console.log(`[EmployeesSeeder] 已清空 ${result.deletedCount} 条记录`);
    return result.deletedCount || 0;
  }
}

/**
 * 执行种子数据生成（便捷函数）
 */
export async function seed(db: Db, count: number = 50): Promise<number> {
  const seeder = EmployeesSeeder.getInstance();
  return seeder.seed(db, count);
}

/**
 * 清空员工数据（便捷函数）
 */
export async function clear(db: Db): Promise<number> {
  const seeder = EmployeesSeeder.getInstance();
  return seeder.clear(db);
}

export default EmployeesSeeder;