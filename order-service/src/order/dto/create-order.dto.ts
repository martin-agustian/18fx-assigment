import { IsEmail, IsNotEmpty, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsEmail()
  customerEmail: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  items: { menuId: number; quantity: number }[];
}
