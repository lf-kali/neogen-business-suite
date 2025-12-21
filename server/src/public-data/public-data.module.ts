import { Module } from '@nestjs/common';
import { PublicDataService } from './public-data.service';

@Module({
  providers: [PublicDataService],
  exports: [PublicDataService],
})
export class PublicDataModule {}
