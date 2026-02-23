import { Product } from "../types";

// API Key provided by user for Deepseek
const API_KEY = "sk-1927fa0e7d1e47718db65b5e7b49113b";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const getChatResponse = async (
    userMessage: string, 
    products: Product[],
    history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
    
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

    // Convert Gemini history format to OpenAI/Deepseek format
    const messages = [
        { role: "system", content: systemInstruction },
        ...history.map(h => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.parts[0].text
        })),
        { role: "user", content: userMessage }
    ];

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Deepseek API Error:", errorData);
            throw new Error(`Deepseek API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content || "Xin lỗi, tôi không thể trả lời lúc này.";

    } catch (error) {
        console.error("Deepseek API Request Failed:", error);
        return "Hiện tại tôi đang gặp chút sự cố kỹ thuật với Deepseek. Vui lòng thử lại sau.";
    }
};
