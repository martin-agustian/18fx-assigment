import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepo.find();
  }

  async onModuleInit() {
    await this.seedMenu();
  }

  async seedMenu() {
    const existing = await this.menuRepo.find();
    if (existing.length === 0) {
      await this.menuRepo.save([
        { name: 'Nasi Goreng', price: 20000 },
        { name: 'Mie Ayam', price: 15000 },
        { name: 'Sate Ayam', price: 25000 },
      ]);
      console.log('✅ Menu berhasil di-seed!');
    }
  }
}
