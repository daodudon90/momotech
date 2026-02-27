import { Product } from "../types";

export const getChatResponseStream = async function* (
    userMessage: string, 
    products: Product[],
    history: {role: string, parts: {text: string}[]}[]
): AsyncGenerator<string, void, unknown> {
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                products: products,
                history: history
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        yield data.text;

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        yield "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI (Backend).";
    }
};
