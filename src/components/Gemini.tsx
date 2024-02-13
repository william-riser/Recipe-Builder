import { GoogleGenerativeAI } from '@google/generative-ai';
import.meta.env


interface GeminiResponse {
   text: string;
}


async function generateGeminiText(prompt: string): Promise<GeminiResponse> {
 // Ensure that API_KEY is provided
 const apiKey = import.meta.env.VITE_API_KEY as string;
 if (!apiKey) {
   throw new Error('Missing API_KEY in environment variables');
 }


 const genAI = new GoogleGenerativeAI(apiKey);
 const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


 try {
   const result = await model.generateContent(prompt);
   const response = await result.response;
   const text = response.text();


   return { text };
 } catch (error: unknown) {
   if (error instanceof Error) {
     throw new Error(`Error generating text: ${error.message}`);
   } else {
     throw new Error('Unexpected error generating text');
   }
 }
}


export { generateGeminiText };
