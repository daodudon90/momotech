import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

let aiClient: GoogleGenAI | null = null;

// Initialize the client
const initializeAI = () => {
    if (!process.env.API_KEY) {
        console.warn("API Key not found. AI Chat will not work.");
        return null;
    }
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiClient;
};

export const getChatResponse = async (
    userMessage: string, 
    products: Product[],
    history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
    
    const client = initializeAI();
    if (!client) return "Xin lỗi, hệ thống AI chưa được cấu hình (Thiếu API Key).";

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

    try {
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
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Hiện tại tôi đang gặp chút sự cố kỹ thuật. Vui lòng thử lại sau.";
    }
};
