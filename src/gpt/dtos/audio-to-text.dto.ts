import { IsOptional, IsString } from "class-validator";

//? Los DTOs sirven para definir la estructura de los datos que se van a recibir en el controlador y para enviar la respuesta al cliente.
export class AudioToTextDto {

    @IsString() // Decorador para validar que el campo sea de tipo string
    @IsOptional()
    readonly prompt: string;

}