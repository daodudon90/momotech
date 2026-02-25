import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Define interface for global settings injected by WordPress
interface MomotechSettings {
  apiKey: string;
}

declare global {
  interface Window {
    momotechSettings?: MomotechSettings;
  }
}

// Default API Key provided by user (Hardcoded for GitHub deployment)
const DEFAULT_API_KEY = "AIzaSyDDRhfe8BlZCbZlnAujQUn3T5o-sTWSLoY";

let aiClient: GoogleGenAI | null = null;

// Initialize the client
const initializeAI = () => {
    if (!aiClient) {
        // Priority: 
        // 1. Key from WordPress Customizer (if set)
        // 2. Hardcoded Default Key (for GitHub/Auto-deployment)
        // 3. Env var (dev)
        const apiKey = window.momotechSettings?.apiKey || DEFAULT_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
        
        if (!apiKey) {
            console.warn("Momotech AI: No API Key found.");
            throw new Error("API Key is missing");
        }
        
        aiClient = new GoogleGenAI({ apiKey: apiKey });
    }
    return aiClient;
};

export const getChatResponse = async (
    userMessage: string, 
    products: Product[],
    history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
    
    try {
        const client = initializeAI();
        
        // Create a context string about available products
        const productContext = products.map(p => 
            `- ${p.name}: ${p.price}. ${p.description}. Specs: ${p.specs.join(', ')}`
        ).join('\n');

        const systemInstruction = `
        Bạn là một trợ lý ảo chuyên nghiệp của Momotech, một website bán laptop.
        Nhiệm vụ của bạn là tư vấn cho khách hàng chọn mua laptop phù hợp dựa trên danh sách sản phẩm hiện có của cửa hàng.
        
        Dưới đây là danh sách sản phẩm hiện có:
        ${productContext}
        
        Nguyên tắc trả lời:
        1. Chỉ tư vấn các sản phẩm có trong danh sách trên.
        2. Trả lời ngắn gọn, thân thiện, lịch sự (dùng tiếng Việt).
        3. Nếu khách hỏi về sản phẩm không có, hãy gợi ý sản phẩm tương tự trong danh sách.
        4. Nhấn mạnh vào lợi ích sử dụng phù hợp với nhu cầu khách (ví dụ: sinh viên, đồ họa, gaming).
        5. Đừng bịa đặt giá cả.
        `;

        const response = await client.models.generateContent({
            model: "gemini-3-flash-preview", 
            contents: [
                ...history.map(h => ({ role: h.role, parts: h.parts })),
                { role: 'user', parts: [{ text: userMessage }] }
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text || "Xin lỗi, tôi không thể trả lời lúc này.";
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        
        // Check for Quota Exceeded (429) or generic errors
        if (error.message?.includes('429') || error.status === 429) {
            return "Hệ thống đang quá tải (đạt giới hạn gói miễn phí). Vui lòng thử lại sau 1 phút.";
        }
        
        return "Vui lòng kiểm tra API Key trong phần Tùy biến giao diện (Customize) hoặc thử lại sau.";
    }
};
