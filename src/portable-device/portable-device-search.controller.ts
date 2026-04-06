import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PortableDeviceSearchService } from "./portable-device-search.service";
import { PortableDevice } from "./entities/portable-device.entity";

@UseGuards(JwtAuthGuard)
@ApiTags('Device Search')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/portable-device-search') 
export class PortableDeviceSearchController {
    constructor(
        private readonly service: PortableDeviceSearchService,
    ){}

    @Get('/all')
    async findAll(): Promise<PortableDevice[]> {
        return this.service.findAll()
    }

    @Get('/id/:id')
    async findByID(@Param('id', ParseIntPipe) id: number): Promise<PortableDevice> {
        return this.service.findbyID(id);
    }
}
