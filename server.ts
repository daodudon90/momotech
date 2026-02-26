import express from 'express';
import { createServer as createViteServer } from 'vite';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import 'dotenv/config';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route for Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, productContext } = req.body;

      // Use the API Key from environment variables
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing API Key' });
      }

      const systemPrompt = `Bạn là trợ lý AI ảo của hệ thống momotech.vn. Nhiệm vụ của bạn là tư vấn các dòng laptop phù hợp với nhu cầu của khách hàng (như làm việc văn phòng, chơi game, thiết kế đồ họa). Hãy trả lời ngắn gọn, lịch sự, chuyên nghiệp. Phân tích thông số kỹ thuật dễ hiểu và khéo léo gợi ý khách hàng click tham khảo thêm các mẫu máy trên website momotech.vn.
      
      Dưới đây là danh sách sản phẩm hiện có tại cửa hàng (Sử dụng thông tin này để tư vấn chính xác):
      ${productContext || "Hiện không có dữ liệu sản phẩm."}
      `;

      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        system: systemPrompt,
      });

      // Handle streaming response using toDataStreamResponse
      const response = result.toDataStreamResponse();
      
      // Set headers from the response
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Pipe the body to the express response
      if (response.body) {
        const reader = response.body.getReader();
        const read = async () => {
          try {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              return;
            }
            res.write(value);
            read();
          } catch (err) {
            console.error('Stream error:', err);
            res.end();
          }
        };
        read();
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if needed)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
