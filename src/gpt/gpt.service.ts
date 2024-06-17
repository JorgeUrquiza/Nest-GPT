import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';

import OpenAI from 'openai';

import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import { AudioToTextDto, ImageVariationDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { ImageGenerationDto } from './dtos/image-generation.dto';



@Injectable() // Se define como un servicio de NestJS para poder inyectarlo en otros componentes
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    // Solo va a llamar casos de uso

    async orthographyCheck( orthographyDto: OrthographyDto ) {
        return await orthographyCheckUseCase( this.openai, {
            prompt: orthographyDto.prompt,
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }

    async translateText({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async textToAudioGetter( fileId: string ) {
        const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);

        const wasFound = fs.existsSync( filePath );

        if ( !wasFound ) throw new NotFoundException(`File ${ fileId } not found`); // Si no se encuentra el archivo, se lanza un error

        return filePath;
    }

    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ) {
        const { prompt } = audioToTextDto;

        return await audioToTextUseCase( this.openai, { audioFile, prompt } )
    }

    async imageGeneration( imageGenerationDto: ImageGenerationDto ) {
        return await imageGenerationUseCase( this.openai, { ...imageGenerationDto } );
    }

    getGeneratedImage( fileName: string ) {
        const filePath = path.resolve('./', './generated/images/', fileName );

        const wasFound = fs.existsSync( filePath );
        if ( !wasFound ) throw new NotFoundException(`File ${ fileName } not found`); // Si no se encuentra el archivo, se lanza un error

        return filePath;
    }


    async generateImageVariation( { baseImage }: ImageVariationDto ) {
        return imageVariationUseCase( this.openai, { baseImage} );
    }



}
