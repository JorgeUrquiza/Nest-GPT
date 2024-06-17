import OpenAI from "openai";


interface Options {
    prompt: string;
}


export const prosConsDicusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {


    return await openai.chat.completions.create({ // retornamos todo el objeto que nos devuelve la API para poder trabajar con el stream
        stream: true, // Aca se especifica que se va a trabajar con un stream de mensajes
        // model: 'gpt-4',
        model: 'gpt-3.5-turbo-1106',
        messages: [
            {
                role: 'system',
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                    la respuesta debe de ser en formato markdown,
                    los pros y contras deben de estar en una lista,
                `,
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        temperature: 0.8, // Especifica cuán creativa es la respuesta
        max_tokens: 500
    })



}