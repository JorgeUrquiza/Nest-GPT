import { IsString } from "class-validator";

//? Los DTOs sirven para definir la estructura de los datos que se van a recibir en el controlador y para enviar la respuesta al cliente.
export class TranslateDto {

    @IsString() // Decorador para validar que el campo sea de tipo string
    readonly prompt: string;

    @IsString()
    readonly lang: string;

}