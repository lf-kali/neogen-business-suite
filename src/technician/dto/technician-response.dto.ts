import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TechnicianResponseDto {

    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    profilePicture: string;

}