import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async createThread() {
        return await createThreadUseCase( this.openai ); 
    }


    async userQuestion( questionDto: QuestionDto ) {
        const { threadId, question } = questionDto;

        const message = await createMessageUseCase( this.openai, { threadId, question } ) // El mensaje es la pregunta que el usuario hace al asistente
        // console.log({message});

        const run = await createRunUseCase( this.openai, { threadId } ); // El run es el que se encarga de hacer la pregunta al asistente

        await checkCompleteStatusUseCase( this.openai, { runId: run.id, threadId: threadId  } ) // Verificamos que el run haya sido completado
        
        const messages = await getMessageListUseCase( this.openai, {threadId} ) // Obtenemos la lista de mensajes del hilo para mostrar al usuario

        return messages.reverse();

    }
    
    
    
}