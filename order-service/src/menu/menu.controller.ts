import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }
}
