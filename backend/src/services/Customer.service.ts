import { BaseService } from './BaseService';
import { CustomerRepository } from '../repositories/Customer.repository';
import { generateCode } from '../utils';

export class CustomerService extends BaseService<any> {
  private customerRepository: CustomerRepository;
  
  constructor() {
    super(new CustomerRepository());
    this.customerRepository = new CustomerRepository();
  }

  async createCustomer(data: any): Promise<any> {
    data.customerCode = generateCode('CUS');
    return this.create(data);
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.customerRepository.findByEmail(email);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.customerRepository.findByCode(code);
  }

  async findByPhone(phone: string): Promise<any | null> {
    if (!phone) return null;
    return this.customerRepository.findByPhone(phone);
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.customerRepository.search(keyword);
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.customerRepository.findByStatus(status);
  }

  async updateBalance(id: string, amount: number): Promise<any | null> {
    this.validateId(id);
    return this.customerRepository.updateBalance(id, amount);
  }

  async getStatistics(): Promise<any> {
    return this.customerRepository.getStatistics();
  }

  async toggleStatus(id: string): Promise<any | null> {
    this.validateId(id);
    const customer = await this.findById(id);
    if (!customer) return null;
    
    const statusMap: any = {
      'active': 'inactive',
      'inactive': 'active',
      'blocked': 'active'
    };
    return this.update(id, { status: statusMap[customer.status] });
  }
}
