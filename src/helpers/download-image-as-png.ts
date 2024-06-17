import { InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import * as sharp from 'sharp';


export const downloadImageAsPng = async( url: string, fullPath: boolean = false ) => {
    
    const response = await fetch( url ); // Hacemos una petición a la url de la imagen

    if ( !response.ok ) {
        throw new InternalServerErrorException('Error downloading image');
    }

    const folderPath = path.resolve( './','./generated/images/' ); // Definimos la ruta donde se va a guardar la imagen
    fs.mkdirSync( folderPath, { recursive: true } ) // Creamos la carpeta donde se va a guardar la imagen si no existe

    const imageNamePng = `${ new Date().getTime() }.png`; // Creamos un nombre unico para la imagen, poner uuid es mejor
    const buffer = Buffer.from( await response.arrayBuffer() ); // Convertimos la imagen a un buffer que es lo que se guarda en el sistema de archivos

    // fs.writeFileSync( `${folderPath}/${imageNamePng}`, buffer ); // Guardamos la imagen en el sistema de archivos

    const completePath = path.join( folderPath, imageNamePng) // Definimos la ruta donde se va a guardar la imagen

    await sharp( buffer )
        .png() // Convertimos la imagen a png
        .ensureAlpha() // Aseguramos que tenga canal alpha (transparencia)
        .toFile(completePath)

    return fullPath ? completePath : imageNamePng; // Retornamos el nombre de la imagen o la ruta completa dependiendo de la bandera
}

    export const downloadBase64ImageAsPng = async ( base64Image: string,  fullPath: boolean = false ) => {

        // Remover encabezado
        base64Image = base64Image.split(';base64,').pop();
        const imageBuffer = Buffer.from(base64Image, 'base64');
    
        const folderPath = path.resolve('./', './generated/images/');
        fs.mkdirSync(folderPath, { recursive: true });
    
        const imageNamePng = `${ new Date().getTime() }-64.png`;
        
        const completePath = path.join( folderPath, imageNamePng)
    
        // Transformar a RGBA, png // Así lo espera OpenAI
        await sharp(imageBuffer)
        .png()
        .ensureAlpha()
        .toFile(completePath);
    
        return fullPath ? completePath : imageNamePng;
    }