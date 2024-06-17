//? Los casos de uso son los encargados de implementar la lógica de negocio de la aplicación. 
//? En este caso, el caso de uso orthographyCheckUseCase se encarga de recibir un prompt y devolverlo en un objeto con el campo prompt.

import OpenAI from "openai";


interface Options {
    prompt: string;
}


export const orthographyCheckUseCase = async( openai: OpenAI, options: Options ) => {   

    const { prompt } = options;

    //? El método chat.completions.create de la librería openai recibe un objeto con las opciones de la petición.
    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Te seran proveidos textos en español con posibles errores ortograficos y gramaticales,
                    Las palabras usadas deben de existir en el diccionario de la RAE,
                    Debes de responder en formato JSON,
                    tu tarea es corregirlos y retornar informacion soluciones,
                    tambien debes de dar un porcentaje de acierto por el usuario,


                    Si no hay errores, debes de retornar un mensaje de felicitaciones.

                    Ejemplo de salida:
                    {
                        userScore: number,
                        errors: string[], // ['error' => solucion]
                        message: string, // Usa emojis y texto para dar feedback
                    }

                ` 
            },
            {
                role: "user",
                content: prompt,
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 150,
        response_format: {
            type: 'json_object',
        }
      });
    
    //   console.log(completion);
    const jsonResp = JSON.parse(completion.choices[0].message.content);

    return jsonResp;

}
