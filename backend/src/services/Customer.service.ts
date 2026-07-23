import { BaseService } from '../services/BaseService';
import { CustomerRepository } from '../repositories/Customer.repository';
import { ICustomer } from '../models/Customer.model';
import { generateCode } from '../utils';

export class CustomerService extends BaseService<ICustomer> {
  private customerRepository: CustomerRepository;
  
  constructor() {
    super(new CustomerRepository());
    this.customerRepository = new CustomerRepository();
  }
  
  async createCustomer(data: Partial<ICustomer>): Promise<ICustomer> {
    data.customerCode = generateCode('CUS');
    return this.repository.create(data);
  }
  
  async findByEmail(email: string): Promise<ICustomer | null> {
    return this.customerRepository.findByEmail(email);
  }
  
  async findByCode(code: string): Promise<ICustomer | null> {
    return this.customerRepository.findByCode(code);
  }
  
  async search(keyword: string): Promise<ICustomer[]> {
    return this.customerRepository.search(keyword);
  }
  
  async updateBalance(id: string, amount: number): Promise<ICustomer | null> {
    return this.customerRepository.updateBalance(id, amount);
  }
  
  async toggleStatus(id: string): Promise<ICustomer | null> {
    const customer = await this.repository.findById(id);
    if (!customer) return null;
    
    const statusMap = {
      'active': 'inactive',
      'inactive': 'active',
      'blocked': 'active'
    };
    return this.repository.update(id, { 
      status: statusMap[customer.status] as any,
      updatedAt: new Date()
    });
  }
}
