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
// Note: In a real production environment, this should be handled more securely.
const DEFAULT_API_KEY = "AIzaSyDDRhfe8BlZCbZlnAujQUn3T5o-sTWSLoY";

let aiClient: GoogleGenAI | null = null;

// Initialize the client
const initializeAI = () => {
    if (!aiClient) {
        // Priority: 
        // 1. Key from WordPress Customizer (if set)
        // 2. Hardcoded Default Key (for GitHub/Auto-deployment)
        // 3. Env var (dev)
        // 4. Process env (platform)
        const apiKey = window.momotechSettings?.apiKey || DEFAULT_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
        
        if (!apiKey) {
            console.warn("Momotech AI: No API Key found.");
            throw new Error("API Key is missing");
        }
        
        aiClient = new GoogleGenAI({ apiKey: apiKey });
    }
    return aiClient;
};

export const getChatResponseStream = async function* (
    userMessage: string, 
    products: Product[],
    history: {role: string, parts: {text: string}[]}[]
): AsyncGenerator<string, void, unknown> {
    
    try {
        const client = initializeAI();
        
        // Create a context string about available products
        const productContext = products.map(p => 
            `- ${p.name}: ${p.price}. ${p.description}. Specs: ${p.specs.join(', ')}`
        ).join('\n');

        const systemInstruction = `
        Vai trò: Bạn là trợ lý AI ảo cốt lõi của ứng dụng MomoTech Smart Hub, hoạt động trên website affiliate momotech.vn.
        
        Nhiệm vụ chính: 
        * Tư vấn chuyên sâu về các dòng laptop (văn phòng, gaming, đồ họa, sinh viên...).
        * Phân tích, so sánh các thông số kỹ thuật (CPU, RAM, GPU, Màn hình) một cách dễ hiểu để giúp khách hàng đưa ra quyết định.
        
        Mục tiêu kinh doanh: Trả lời đúng trọng tâm và khéo léo điều hướng, kích thích khách hàng click vào các liên kết affiliate tham khảo sản phẩm trên momotech.vn.
        
        Giọng điệu: Chuyên nghiệp, nhiệt tình, ngắn gọn. Xưng hô là "Trợ lý MomoTech" và "bạn/quý khách".
        
        Giới hạn (Guardrails): Chỉ tập trung vào lĩnh vực công nghệ, thiết bị điện tử và laptop. Lịch sự từ chối trả lời các câu hỏi không liên quan đến cấu hình máy tính hoặc dịch vụ của hệ thống.

        Dữ liệu sản phẩm hiện có (Sử dụng thông tin này để tư vấn):
        ${productContext}
        
        Lưu ý: Nếu khách hỏi về sản phẩm không có trong danh sách, hãy gợi ý sản phẩm tương tự trong danh sách trên. Đừng bịa đặt giá cả.
        `;

        const responseStream = await client.models.generateContentStream({
            model: "gemini-3.1-pro-preview", 
            contents: [
                ...history.map(h => ({ role: h.role, parts: h.parts })),
                { role: 'user', parts: [{ text: userMessage }] }
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        for await (const chunk of responseStream) {
            yield chunk.text || "";
        }

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        yield "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.";
    }
};
