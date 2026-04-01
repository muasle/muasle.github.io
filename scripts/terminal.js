// Configuration
const CONFIG = {
  // Local API URL - update this to match your local server
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Alternative: If you want to make it configurable
  // API_BASE_URL: localStorage.getItem('apiUrl') || 'http://localhost:3000/api'
};

// DOM Elements
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

// State
let commandHistory = [];
let historyIndex = -1;
let isProcessing = false;
let isConnected = false;

// Initialize
window.addEventListener('load', () => {
  userInput.focus();
  checkConnection();
  loadHistory();
});

// Check API connection
async function checkConnection() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (response.ok) {
      isConnected = true;
      addLine('<span class="system">✓ Connected to local API server</span>');
    } else {
      handleDisconnection();
    }
  } catch (error) {
    handleDisconnection();
  }
}

function handleDisconnection() {
  isConnected = false;
  addLine('<span class="warning">⚠ Warning: Local API server not connected</span>');
  addLine('<span class="system">Please ensure the backend server is running on ' + CONFIG.API_BASE_URL + '</span>');
  addLine('<span class="system">Run: npm start (in the backend directory)</span>');
  addLine('<span class="system">================================</span>');
}

// Handle input
userInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && !isProcessing) {
    const input = userInput.value.trim();
    if (input) {
      commandHistory.push(input);
      historyIndex = commandHistory.length;
      await processCommand(input);
      userInput.value = '';
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      userInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      userInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      userInput.value = '';
    }
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    clearTerminal();
  }
});

// Process commands
async function processCommand(input) {
  isProcessing = true;
  
  // Display user input
  addLine(`<span class="prompt">user@terminal:~$ </span><span class="user-input">${escapeHtml(input)}</span>`);

  // Handle special commands
  const command = input.toLowerCase().trim();
  
  if (command === 'help') {
    showHelp();
    isProcessing = false;
    return;
  }

  if (command === 'clear') {
    clearTerminal();
    isProcessing = false;
    return;
  }

  if (command === 'history') {
    await showHistory();
    isProcessing = false;
    return;
  }

  if (command === 'status') {
    await checkConnection();
    isProcessing = false;
    return;
  }

  if (command.startsWith('setapi ')) {
    const newUrl = input.substring(7).trim();
    CONFIG.API_BASE_URL = newUrl;
    localStorage.setItem('apiUrl', newUrl);
    addLine(`<span class="system">API URL updated to: ${escapeHtml(newUrl)}</span>`);
    await checkConnection();
    isProcessing = false;
    return;
  }

  // Check connection before sending to API
  if (!isConnected) {
    addLine('<span class="error">Error: Not connected to API server</span>');
    addLine('<span class="system">Type "status" to check connection</span>');
    isProcessing = false;
    return;
  }

  // Show loading indicator
  const loadingLine = addLine('<span class="loading">Processing</span>');

  try {
    // Send to chatbot API
    const response = await fetch(`${CONFIG.API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    // Remove loading indicator
    loadingLine.remove();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Display bot response
    addLine(`<span class="bot-response">${escapeHtml(data.response)}</span>`);
    
    if (data.id) {
      addLine(`<span class="system">[Message ID: ${data.id} | ${new Date(data.timestamp).toLocaleTimeString()}]</span>`);
    }

  } catch (error) {
    loadingLine.remove();
    
    if (error.name === 'AbortError') {
      addLine(`<span class="error">Error: Request timed out</span>`);
    } else {
      addLine(`<span class="error">Error: ${escapeHtml(error.message)}</span>`);
      isConnected = false;
      addLine(`<span class="system">Connection lost. Type "status" to reconnect.</span>`);
    }
  }

  isProcessing = false;
  scrollToBottom();
}

// Add line to terminal
function addLine(html) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = html;
  output.appendChild(line);
  scrollToBottom();
  return line;
}

// Clear terminal
function clearTerminal() {
  output.innerHTML = '';
}

// Show help
function showHelp() {
  addLine('<span class="system">Available commands:</span>');
  addLine('<span class="system">  help       - Show this help message</span>');
  addLine('<span class="system">  clear      - Clear the terminal</span>');
  addLine('<span class="system">  history    - Show chat history</span>');
  addLine('<span class="system">  status     - Check API connection status</span>');
  addLine('<span class="system">  setapi URL - Change API endpoint URL</span>');
  addLine('<span class="system">  Ctrl+L     - Clear terminal (shortcut)</span>');
  addLine('<span class="system">  ↑/↓        - Navigate command history</span>');
  addLine('<span class="system"></span>');
  addLine('<span class="system">Current API: ' + escapeHtml(CONFIG.API_BASE_URL) + '</span>');
  addLine('<span class="system">Any other input will be sent to the chatbot.</span>');
}

// Load and show chat history
async function loadHistory() {
  if (!isConnected) return;
  
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/history`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.history && data.history.length > 0) {
        addLine('<span class="system">Loading previous chat history...</span>');
        // Only show last 5 conversations on load
        const recentHistory = data.history.slice(-5);
        recentHistory.forEach(item => {
          addLine(`<span class="prompt">user@terminal:~$ </span><span class="user-input">${escapeHtml(item.prompt)}</span>`);
          addLine(`<span class="bot-response">${escapeHtml(item.response)}</span>`);
        });
        if (data.history.length > 5) {
          addLine(`<span class="system">... (${data.history.length - 5} older messages. Type "history" to view all)</span>`);
        }
        addLine('<span class="system">================================</span>');
      }
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

// Show history command
async function showHistory() {
  if (!isConnected) {
    addLine('<span class="error">Error: Not connected to API server</span>');
    return;
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/history`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.history && data.history.length > 0) {
      addLine('<span class="system">Chat History (' + data.history.length + ' messages):</span>');
      addLine('<span class="system">================================</span>');
      data.history.forEach((item, index) => {
        addLine(`<span class="system">[${index + 1}] ${new Date(item.timestamp).toLocaleString()}</span>`);
        addLine(`<span class="user-input">  User: ${escapeHtml(item.prompt)}</span>`);
        addLine(`<span class="bot-response">  Bot: ${escapeHtml(item.response)}</span>`);
        addLine('<span class="system">---</span>');
      });
    } else {
      addLine('<span class="system">No chat history found.</span>');
    }
  } catch (error) {
    addLine(`<span class="error">Error loading history: ${escapeHtml(error.message)}</span>`);
    isConnected = false;
  }
}

// Scroll to bottom
function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Keep focus on input
document.addEventListener('click', () => {
  userInput.focus();
});

// Prevent losing focus
userInput.addEventListener('blur', () => {
  setTimeout(() => userInput.focus(), 0);
});