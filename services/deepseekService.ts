import OpenAI from 'openai';
import { Product } from "../types";

// Define interface for global settings injected by WordPress
interface MomotechSettings {
  deepseekApiKey?: string;
  apiKey?: string;
}

declare global {
  interface Window {
    momotechSettings?: MomotechSettings;
  }
}

// Default API Key provided by user (Hardcoded for GitHub deployment)
// Note: In a real production environment, this should be handled more securely.
const DEFAULT_API_KEY = ""; // User needs to provide this

let aiClient: OpenAI | null = null;

// Initialize the client
const initializeAI = () => {
    if (!aiClient) {
        // Priority: 
        // 1. Key from WordPress Customizer (if set)
        // 2. Env var (dev)
        // 3. Process env (platform)
        const apiKey = window.momotechSettings?.deepseekApiKey || import.meta.env.VITE_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || "";
        
        if (!apiKey) {
            console.warn("Momotech AI: No DeepSeek API Key found.");
            throw new Error("DeepSeek API Key is missing. Please set VITE_DEEPSEEK_API_KEY in .env");
        }
        
        aiClient = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Required for client-side usage
        });
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

        // Convert history format from Gemini to OpenAI
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: "system", content: systemInstruction },
            ...history.map(h => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.parts[0].text
            } as OpenAI.Chat.Completions.ChatCompletionMessageParam)),
            { role: "user", content: userMessage }
        ];

        const stream = await client.chat.completions.create({
            messages: messages,
            model: "deepseek-chat", // V3 model (cheaper/faster) or "deepseek-reasoner" (R1)
            stream: true,
            temperature: 0.7,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                yield content;
            }
        }

    } catch (error: any) {
        console.error("DeepSeek API Error:", error);
        
        // Handle specific error cases
        if (error.message && error.message.includes("API Key is missing")) {
            yield "Lỗi: Chưa cấu hình API Key. Vui lòng thêm VITE_DEEPSEEK_API_KEY vào file .env hoặc cấu hình trong CMS.";
        } else if (error.status === 401) {
            yield "Lỗi xác thực (401): API Key không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (error.status === 402) {
            yield "Lỗi thanh toán (402): Tài khoản DeepSeek hết tín dụng. Vui lòng nạp thêm.";
        } else if (error.status === 429) {
            yield "Lỗi quá tải (429): Gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
        } else if (error.message && error.message.toLowerCase().includes("network error")) {
            yield "Lỗi kết nối mạng (CORS): Không thể gọi trực tiếp API từ trình duyệt. Vui lòng kiểm tra kết nối hoặc sử dụng Proxy.";
        } else {
            // Return the actual error message for debugging
            yield `Xin lỗi, đã có lỗi xảy ra: ${error.message || "Lỗi không xác định"}`;
        }
    }
};
