import { IsInt, IsOptional, IsString } from "class-validator";


export class TextToAudioDto {

    @IsString() // Decorador para validar que el campo sea de tipo string
    readonly prompt: string;

    @IsString() // Decorador para validar que el campo sea de tipo string
    @IsOptional() // Decorador para que el campo sea opcional
    readonly voice?: string;

}