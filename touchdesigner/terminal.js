// Configuration
const CONFIG = {
  host: 'http://localhost:11434',
  model: 'llama3.2',
  oscBridge: 'ws://localhost:8081'
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

// State
let promptHistory = [];
let historyIndex = -1;
let isProcessing = false;
let oscSocket = null;  // Changed from oscPort
let latestResponse = '';

// Initialize OSC with raw WebSocket
function initOSC() {
  try {
    oscSocket = new WebSocket(CONFIG.oscBridge);

    oscSocket.onopen = function () {
      addLine('OSC Bridge Connected (TouchDesigner ready)', 'system');
    };

    oscSocket.onerror = function (error) {
      addLine('Error: OSC Bridge not connected', 'warning');
    };

    oscSocket.onclose = function () {
      console.log('OSC Bridge disconnected');
    };

  } catch (error) {
    addLine('OSC connection failed', 'warning');
  }
}

// Send OSC Message
function sendOSC(address, args) {
  if (oscSocket && oscSocket.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      address: address,
      args: args
    });
    oscSocket.send(message);
    return true;
  }
  return false;
}

// Initialize
function init(){
  userInput.addEventListener('keydown', handleKeyDown);
  userInput.focus();
  initOSC();  // Changed from connectToTouchDesigner
  checkStatus();
}

// Check Keyboard Press
function handleKeyDown(e){
  if(e.key === 'Enter'){
    handleprompt();
  }
  else if (e.key === 'ArrowUp'){
    navigateHistory('up');
  }
}

function navigateHistory(direction){
  if (direction === 'up' && historyIndex < promptHistory.length - 1){
      historyIndex++;
      userInput.value = promptHistory[promptHistory.length - 1 - historyIndex];
  } 
  else if (direction === 'down' && historyIndex > 0){
      historyIndex--;
      userInput.value = promptHistory[promptHistory.length - 1 - historyIndex];
  } 
  else if (direction === 'down' && historyIndex === 0){
      historyIndex = -1;
      userInput.value = '';
  }
}

// Handle prompts
async function handleprompt() {
    if (isProcessing) return;
    
    const prompt = userInput.value.trim();
    if (!prompt) return;
    
    // Add to history
    promptHistory.push(prompt);
    historyIndex = -1;
    
    // Display user input
    addLine(`user@terminal:~$ ${prompt}`, 'user-input');
    
    // Clear input
    userInput.value = '';
    
    // Process prompt
    isProcessing = true;
    
    if (prompt.toLowerCase() === 'help'){
        showHelp();
        isProcessing = false;
    } 
    else if (prompt.toLowerCase() === 'clear'){
        clearTerminal();
        isProcessing = false;
    } 
    else if (prompt.toLowerCase() === 'status'){
        await showStatus();
        isProcessing = false;
    } 
    else if (prompt.toLowerCase() === 'history'){
        showHistory();
        isProcessing = false;
    } 
    else if (prompt.toLowerCase() === 'last'){
        showLastResponse();
        isProcessing = false;
    } 
    else{
        await generateResponse(prompt);
        isProcessing = false;
    }
    
    scrollToBottom();
}

async function generateResponse(prompt){
  addLine('The AI is thinking...', 'bot-response');

  try{
    const response = await fetch(`${CONFIG.host}/api/generate`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          model: CONFIG.model,
          prompt: prompt,
          stream: false
      })
    });

    if(!response.ok){
      throw new Error('Error: API Request Failed');
    }

    const data = await response.json();
    const aiResponse = data.response;

    latestResponse = aiResponse;

    addLine('─────────────────────────────────────────────────────────', 'system');
    addLine('AI RESPONSE:', 'bot-response');
    addLine(aiResponse, 'bot-response');
    addLine('─────────────────────────────────────────────────────────', 'system');

    // Send via OSC to TouchDesigner
    sendOSC('/ai/response', [
      { type: 's', value: aiResponse }
    ]);
    
    sendOSC('/ai/promptcount', [
      { type: 'i', value: promptHistory.length }
    ]);
    
    sendOSC('/ai/prompt', [
      { type: 's', value: prompt }
    ]);

    addLine('→ Data sent to TouchDesigner via OSC', 'system');
  }

  catch(error){
    addLine(`ERROR: ${error.message}`, 'error');
  }
}

async function checkStatus(){
  try{
    const response = await fetch(`${CONFIG.host}/api/tags`);
    if (response.ok){
      addLine('Ollama Connected', 'system');
    }
  }
  catch(error){
    addLine('Error: Ollama Disconnected', 'system');
  }
}

async function showStatus(){
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('SYSTEM STATUS:', 'prompt');
  
  try {
      const response = await fetch(`${CONFIG.host}/api/tags`);
      if (response.ok) {
          addLine(`  Ollama: CONNECTED`, 'system');
          addLine(`  Active Model: ${CONFIG.model}`, 'system');
      }
  } catch (error) {
      addLine(`  Ollama: OFFLINE`, 'error');
  }
  
  const oscStatus = oscPort && oscPort.socket.readyState === WebSocket.OPEN;
  addLine(`  TouchDesigner (OSC): ${oscStatus ? 'CONNECTED' : 'STANDBY'}`, oscStatus ? 'system' : 'warning');
  
  addLine(`  Prompts Run: ${promptHistory.length}`, 'system');
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
}

function showHistory() {
  if (promptHistory.length === 0) {
      addLine('No prompts in history', 'system');
      return;
  }
  
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('PROMPT HISTORY:', 'prompt');
  promptHistory.forEach((cmd, index) => {
      addLine(`  ${index + 1}. ${cmd}`, 'system');
  });
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
}

function showLastResponse(){
  if (!latestResponse) {
      addLine('No response yet', 'system');
      return;
  }
  
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('LAST AI RESPONSE:', 'prompt');
  addLine(latestResponse, 'bot-response');
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
}

function showHelp(){
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('AVAILABLE COMMANDS:', 'prompt');
  addLine('  help                 - Show this help message', 'system');
  addLine('  clear                - Clear terminal screen', 'system');
  addLine('  status               - Check system status', 'system');
  addLine('  history              - Show prompt history', 'system');
  addLine('  last                 - Show last AI response', 'system');
  addLine('  <any text>           - Send to AI (responds freely)', 'system');
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('EXAMPLES:', 'prompt');
  addLine('  Tell me a story about space', 'warning');
  addLine('  What is the meaning of life?', 'warning');
  addLine('  Write a haiku about technology', 'warning');
  addLine('  Generate random numbers', 'warning');
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
}

function clearTerminal(){
  output.innerHTML = '';
  addLine('Terminal cleared', 'system');
}

function addLine(text, className = ''){
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`;
  line.textContent = text;
  output.appendChild(line);
}

function scrollToBottom(){
    terminal.scrollTop = terminal.scrollHeight;
}

window.addEventListener('load', init);

// Global API
window.visualizeAI = {
    generate: generateResponse,
    sendOSC: sendOSC,
    getLastResponse: () => latestResponse,
    getHistory: () => promptHistory,
    getPromptCount: () => promptHistory.length,
    clear: clearTerminal
};