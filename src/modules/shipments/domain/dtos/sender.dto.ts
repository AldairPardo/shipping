import { IsNotEmpty, IsString } from 'class-validator';
import { ReceiverDto } from './receiver.dto';

export class SenderDto extends ReceiverDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
 }