import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, products } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API Key is missing on server" });
      }

      const client = new GoogleGenAI({ apiKey });

      // Create a context string about available products
      const productContext = products.map((p: any) => 
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

      // Prepare contents for Gemini
      const contents = [
        ...history.map((h: any) => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await client.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ text: response.text });

    } catch (error: any) {
      console.error("Server API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
