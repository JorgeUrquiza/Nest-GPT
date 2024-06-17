import OpenAI from 'openai';

interface Options {
    threadId: string;
    assistantId?: string;
}


export const createRunUseCase = async( openai: OpenAI, options: Options ) => {

    const { threadId, assistantId = 'asst_A8DsVAn6LI8dpEQ1B84n39Db' } = options; // Tenemos por default el asistente de Sam creado en OpenAI

    const run = await openai.beta.threads.runs.create( threadId, {
        assistant_id: assistantId,
        // Intstructions; //! Lo que escribamos aqui sobrescribe el asistente creado en OpenAI
    })


    console.log({run});

    return run;

}
