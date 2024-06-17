import * as fs from 'fs';
import OpenAI from 'openai';



interface Options {
    prompt?: string;
    audioFile: Express.Multer.File; // Obtenemos el archivo de audio
}

export const audioToTextUseCase = async( openai: OpenAI, options: Options ) => {

    const { audioFile, prompt } = options;
    // console.log({ prompt, audioFile });

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream( audioFile.path ), // Enviamos el archivo de audio como un stream
        prompt: prompt, // Tiene que ser mismo idioma que el audio
        language: 'es',
        // response_format: 'vtt', // 'srt',  // frmato de la respuesta
        response_format: 'verbose_json',
    })

    console.log(response);


    return response;

} 