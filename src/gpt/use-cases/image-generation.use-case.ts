import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';


interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async( openai: OpenAI, options: Options ) => {

    const { prompt, originalImage, maskImage } = options;
    // console.log({ prompt, originalImage, maskImage });

    //? Verificar si no vienen ninguno de estos valores hacemos una imagen desde cero
    if ( !originalImage || !maskImage ) {
        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });
    
        //? Guardar imagen en file system 
        const fileName = await downloadImageAsPng( response.data[0].url );
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`
    
        // console.log(response)
    
        return {
            url: url,
            openAIUrl: response.data[0].url, // Esto sirve para ver la ruta de la imagen en OpenAI
            revised_prompt: response.data[0].revised_prompt, // Esto sirve para ver como se modifico el prompt
        }

    }

    //? si viene originalImage y maskImage significa que queremos editar la imagen

    const pngImagePath = await downloadImageAsPng( originalImage, true );
    const maskPath = await downloadBase64ImageAsPng( maskImage, true ); // Convertimos la imagen base64 a png

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt, // ejemplo: "Borra el sombrero", "ponle la camisa roja"
        image: fs.createReadStream(pngImagePath), // Imagen original
        mask: fs.createReadStream(maskPath), // Imagen mask
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });

    const fileName = await downloadImageAsPng( response.data[0].url );
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`


    return {
        url: url, 
        openAIUrl: response.data[0].url, // Esto sirve para ver la ruta de la imagen en OpenAI
        revised_prompt: response.data[0].revised_prompt, // Esto sirve para ver como se modifico el prompt
    }

}
