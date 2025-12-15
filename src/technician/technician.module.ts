import { Module } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { TechnicianController } from './technician.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { AuthModule } from '../auth/auth.module';
import { PublicDataModule } from '../public-data/public-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician]),
    AuthModule,
    PublicDataModule,
  ],
  providers: [TechnicianService],
  controllers: [TechnicianController],
  exports: [TechnicianService],
})
export class TechnicianModule {}
