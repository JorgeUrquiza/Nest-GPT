import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';


//? Controladores son los encargados de recibir las peticiones y enviar las respuestas
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}


  @Post('orthography-check') // Aca se define la ruta para el endpoint
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }


  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }


  //? En este endpoint se va a trabajar con un stream de mensajes
  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response, // Para poder enviar la respuesta como un stream
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK );

    for await( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || ''; // Obtenemos el contenido del mensaje del stream, delta es el objeto que contiene el mensaje
      // console.log(piece);
      res.write(piece); // Escribimos el mensaje en la respuesta
    }

    res.end(); // Cerramos la respuesta
  }


  @Post('translate')
  translateText(
    @Body() translateDto: TranslateDto,
  ){
    return this.gptService.translateText(translateDto);
  }


  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response, // Para poder enviar la respuesta como un stream
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status( HttpStatus.OK );
    res.sendFile(filePath); // Enviamos el archivo de audio
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string, // Obtenemos el id del archivo de audio
  ){
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status( HttpStatus.OK );
    res.sendFile(filePath); // Enviamos el archivo de audio
  }


  @Post('audio-to-text')
  @UseInterceptors( // Usamos un interceptor para poder recibir archivos de audio en la peticion
    FileInterceptor( 'file', { // Definimos el nombre del campo del archivo que esperamos recibir
      storage: diskStorage({ // Definimos el almacenamiento del archivo en el servidor
        destination: './generated/uploads', // Definimos la carpeta donde se guardara el archivo
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop(); // Obtenemos la extension del archivo 
          const fileName = `${ new Date().getTime() }.${ fileExtension }`; // Creamos un nombre unico para el archivo (Se recomienda usar un UUID)
          return callback(null, fileName); // Retornamos el nombre del archivo (null es para indicar que no hubo errores
        }
      })
    })
  )
  async audioToText(
    @UploadedFile( // Usamos el decorador UploadedFile para obtener el archivo de audio
      new ParseFilePipe({ // Usamos un pipe para validar el archivo de audio
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5 , message: 'El archivo es muy grande, 5 mb' }),
          new FileTypeValidator({ fileType: 'audio/*' }) // Validamos que el archivo sea de tipo audio (cualquier tipo de audio)
        ]
      })
    ) file: Express.Multer.File, // Obtenemos el archivo de audio
    @Body() audioToTextDto: AudioToTextDto,
  ){
    return this.gptService.audioToText(file, audioToTextDto );
  }


  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
  ) {
    return await this.gptService.imageGeneration( imageGenerationDto );
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(
    @Res() res: Response,
    @Param('filename') fileName: string,
  ) {
    const filePath =  this.gptService.getGeneratedImage(fileName)
    
    res.setHeader( 'Content-Type', 'image/png');
    res.status( HttpStatus.OK );
    res.sendFile(filePath);
    
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ) {
    return await this.gptService.generateImageVariation( imageVariationDto );
  }


}
