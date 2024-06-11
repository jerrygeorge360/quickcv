'use server';

import { createStreamableValue } from 'ai/rsc';
import { streamText } from 'ai';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { MODELS } from '../helpers/Models';
import { headers } from 'next/headers';
import { ResumeGeneratorLimiter } from '@/helpers/rate-limiter';

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


function getIp() {
    let forwardFor = headers().get('x-forwarded-for')
    let ip = headers().get('x-real-ip')

    if (forwardFor) {
        return forwardFor.split(',')[0].trim()
    }
    if (ip) {
        return ip.trim()
    }
    return null
}


export async function generateResume(resumeInfo: BasicResumeInfo) : Promise<CustomResponse> {
    try {
        const ip = getIp() ?? 'localhost'
        const rl = await ResumeGeneratorLimiter.limit(ip)
        if (!rl.success) {
            throw new Error("You have exceeded the rate limit for this action. Please try again later.")
        }
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
            system: `You are an AI named quickcv that generates resumes in markdown format with a high ATS score. Only return the resume content in markdown format using the provided data. Do not include any greetings, confirmations, errors, or pleasantries. The output should only be the resume itself.`,
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

        if (!resumeInfo[key] || resumeInfo[key] === '') {
            continue;
        }
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

        if (key === 'targetCompany') {
            message += `I want this resume to be targeted at me getting a job at ${resumeInfo[key]}. `
        }
    }
    return message;
}