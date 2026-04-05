import { Module } from '@nestjs/common';
import { TabletModelService } from './tablet-model.service';
import { TabletModelController } from './tablet-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabletModel } from '../entities/portable-device-model.entity';
import { TabletBrandModule } from '../../portable-device-brand/tablet-brand/tablet-brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([TabletModel]), TabletBrandModule],
  providers: [TabletModelService],
  controllers: [TabletModelController],
  exports: [TabletModelService],
})
export class TabletModelModule {}
