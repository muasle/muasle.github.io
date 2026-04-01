const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STORAGE_FILE = path.join(__dirname, 'chat_history.json');

// Middleware
app.use(cors({
  origin: '*', // Allow GitHub Pages and localhost
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Initialize storage
async function initStorage() {
  try {
    await fs.access(STORAGE_FILE);
  } catch {
    await fs.writeFile(STORAGE_FILE, JSON.stringify({ conversations: [] }));
  }
}

// Read chat history
async function readHistory() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { conversations: [] };
  }
}

// Write chat history
async function writeHistory(data) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

// Simulated chatbot response (replace with actual AI API)
function generateBotResponse(prompt) {
  // This is a mock response - replace with your actual chatbot API
  // For example: OpenAI, Anthropic, Cohere, or your custom model
  
  const responses = {
    'hello': 'Hello! How can I assist you today?',
    'hi': 'Hi there! What can I help you with?',
    'how are you': 'I\'m functioning optimally, thank you! How can I help you?',
    'bye': 'Goodbye! Have a great day!',
    'goodbye': 'See you later! Feel free to return anytime.',
    'thanks': 'You\'re welcome! Let me know if you need anything else.',
    'thank you': 'My pleasure! Happy to help.',
    'what can you do': 'I can chat with you and answer questions. Try asking me anything!',
    'help': 'I\'m here to help! Ask me any question and I\'ll do my best to respond.'
  };

  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Check for exact matches
  if (responses[lowerPrompt]) {
    return responses[lowerPrompt];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(responses)) {
    if (lowerPrompt.includes(key)) {
      return value;
    }
  }

  // Default response with helpful info
  return `You said: "${prompt}"\n\nThis is a simulated response. To integrate a real AI chatbot:\n1. Replace generateBotResponse() in server.js\n2. Add your API key (OpenAI, Anthropic, etc.)\n3. Make API calls to your chosen service`;
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// POST /api/chat - Send a prompt and get a response
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt too long (max 5000 characters)' });
    }

    console.log(`[${new Date().toISOString()}] Received prompt: ${prompt.substring(0, 50)}...`);

    // Generate bot response (replace with actual API call)
    const botResponse = generateBotResponse(prompt);

    // Store the conversation
    const history = await readHistory();
    const conversation = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      prompt: prompt,
      response: botResponse,
      timestamp: new Date().toISOString()
    };

    history.conversations.push(conversation);
    await writeHistory(history);

    console.log(`[${new Date().toISOString()}] Stored conversation ID: ${conversation.id}`);

    // Send response
    res.json({
      id: conversation.id,
      response: botResponse,
      timestamp: conversation.timestamp
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/history - Retrieve chat history
app.get('/api/history', async (req, res) => {
  try {
    const history = await readHistory();
    res.json({
      history: history.conversations,
      count: history.conversations.length
    });
  } catch (error) {
    console.error('Error in /api/history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/history/:id - Retrieve a specific conversation
app.get('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await readHistory();
    const conversation = history.conversations.find(c => c.id === id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error in /api/history/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/history - Clear all chat history
app.delete('/api/history', async (req, res) => {
  try {
    await writeHistory({ conversations: [] });
    console.log(`[${new Date().toISOString()}] Chat history cleared`);
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error in DELETE /api/history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  await initStorage();
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(50));
    console.log('Waiting for connections...');
  });
}

startServer();