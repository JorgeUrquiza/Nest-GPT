import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';


interface Options {
    baseImage: string;
}


export const imageVariationUseCase = async( openai: OpenAI, options: Options ) => {

    const { baseImage } = options;
    // console.log({ baseImage });

    const pngImagePath = await downloadImageAsPng( baseImage, true ); // Esta en true para que me devuelva la ruta de la imagen

    const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: fs.createReadStream( pngImagePath ), // Leemos la imagen en el sistema de archivos
        n: 1, // Numero de variaciones
        size: '1024x1024',
        response_format: 'url',
    });

    const fileName = await downloadImageAsPng( response.data[0].url );
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`

    return{
        url: url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
    }
}