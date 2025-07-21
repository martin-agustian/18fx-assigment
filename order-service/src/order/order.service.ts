import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';

import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { MenuService } from 'src/menu/menu.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    private menuService: MenuService,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.customerEmail = dto.customerEmail;
    order.status = 'Pending';

    const items: OrderItem[] = [];

    for (const i of dto.items) {
      const menu = await this.menuService.findAll();
      const found = menu.find((m) => m.id === i.menuId);
      if (!found) throw new Error('Menu not found');

      const item = new OrderItem();
      item.name = found.name;
      item.price = found.price;
      item.quantity = i.quantity;
      items.push(item);
    }

    order.items = items;
    const saved = await this.orderRepo.save(order);
    return saved;
  }

  async findById(id: number): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { id } });
  }
}

