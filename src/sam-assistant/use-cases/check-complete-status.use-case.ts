import OpenAI from "openai";

interface Options {
    threadId: string;
    runId: string;
}

export const checkCompleteStatusUseCase = async( openai: OpenAI, options: Options ) => {

    const { threadId, runId } = options;

    //? Revisamos el estado del run para saber si ya se completo
    const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    console.log({ status: runStatus.status}); // Seguir ejecutando hasta que el status sea "completed"

    if ( runStatus.status === 'completed' ) {
        return runStatus;
    } 

    //? Esperar 1 segundo antes de volver a llamar a la funcion para revisar el estado del run
    await new Promise( resolve => setTimeout( resolve, 1000 ) ) 
    
    //? Si no esta completado, volvemos a llamar a la funcion para revisar el estado
    return await checkCompleteStatusUseCase( openai, options ); 


}