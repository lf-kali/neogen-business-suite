import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicDataService {
  selectPublicData(): object {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePicture: true,
    };
  }
}
