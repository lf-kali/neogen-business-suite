import { Module } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { CostumerController } from './costumer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costumer } from './entities/costumer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Costumer])],
  providers: [CostumerService],
  controllers: [CostumerController],
})
export class CostumerModule {}
