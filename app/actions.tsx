'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { MODELS } from './clients/Models';

export type BasicResumeInfo = {
    name: string
    email : string
    role: string
    description?: string
    dob?: string
    social?: {
        linkedin?: string
        github?: string
        [key: string]: string | undefined
    }
    education?: {
        degree: string
        school: string
        startYear?: string
        endYear?: string
        description?: string
    }[]
    [key: string]: string | object | undefined
}

export type CustomResponse = {
    status: "error" | "success"
    message: any
}

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResume(resumeInfo: BasicResumeInfo) : Promise<CustomResponse> {
    try {

        const message = generateResumeInfoMessage(resumeInfo)
        const modelDefinition = MODELS.find(model => model.provider === 'groq');
        if (!modelDefinition) {
            throw new Error("Model not found for groq")
        }
        const modelProvider = modelDefinition.provider === "groq" ? groq : openai;
        const model = modelProvider(modelDefinition.id);
        console.log(message)
        const result = await streamText({
            model,
            prompt: message,
            system: `You are an AI named quickcv that generates resumes in markdown format with a high ATS score. Only return the resume content in markdown format using the provided data. Do not include any greetings, confirmations, errors, or pleasantries. The output should only be the resume itself`
        });

        const stream = createStreamableValue(result.textStream);
        return {
            status: "success",
            message: stream.value
        }
    } catch (error) {
        console.error(error)
        return {
            status: "error",
            message: (error as Error).message
        }
    }
}


function generateResumeInfoMessage(resumeInfo: BasicResumeInfo) : string {
    let message = ``
    for (const key in resumeInfo) {
        // if name start with i am or i'm {name}
        if (key === 'name') {
            message += `I am ${resumeInfo[key]}. `
        }
        // if email and my email is {email}
        if (key === 'email') {
            message += `My email is ${resumeInfo[key]}. `
        }
        // for date of birth
        if (key === 'dob') {
            message += `I was born on ${resumeInfo[key]}. `
        }
        // if socials are present add them by stringifying the object
        if (key === 'social') {
            message += `I can be found on ${JSON.stringify(resumeInfo[key])}. `
        }
        // for role
        if (key === 'role') {
            message += `I am a ${resumeInfo[key]}. `
        }
        // for description
        if (key === 'description') {
            message += `${resumeInfo[key]}. `
        }
        // for education
        if (key === 'education') {
            message += `Here is my educational background. `
            for (const edu of (resumeInfo['education'] ?? [])) {
                message += `I have a ${edu.degree} from ${edu.school}. `
                if (edu.startYear ) {
                    message += `I started in ${edu.startYear}. `
                }
                if (edu.endYear) {
                    message += `and finished in ${edu.endYear}. `
                }
                if (edu.description) {
                    message += `${edu.description}. `
                }
            }
        }
    }
    return message;
}