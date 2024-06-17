import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';


interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async ( openai: OpenAI, { prompt, voice }: Options ) => {

    const voices = {
        'nova'   : 'nova',
        'alloy'  : 'alloy',
        'echo'   : 'echo',
        'fable'  : 'fable',
        'onyx'   : 'onyx',
        'shimmer': 'shimmer',
    }

    const selectedVoice = voices[voice] ?? 'nova'; // Si no se encuentra la voz seleccionada, se selecciona la voz por defecto


    const folderPath = path.resolve(__dirname, '../../../generated/audios/'); // Obtenemos la ruta de la carpeta donde se van a guardar los audios
    const speechFile = path.resolve( `${ folderPath }/${ new Date().getTime() }.mp3` );

    await fs.mkdirSync( folderPath, { recursive: true } ); // Creamos la carpeta si no existe para guardar los audios

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',
    });


    const buffer = Buffer.from( await mp3.arrayBuffer() );  // Convertimos el audio a un buffer para guardarlo en un archivo
    fs.writeFileSync( speechFile, buffer ); // Guardamos el audio en un archivo


    return speechFile; 

}