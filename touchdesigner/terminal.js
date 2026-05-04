// Configuration
const CONFIG = {
  host: 'http://localhost:11434',
  model: 'llama3.2',
  oscBridge: 'ws://localhost:8081'
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');
const inputLine = document.getElementById('input-line');

// State
let promptHistory = [];
let historyIndex = -1;
let isProcessing = false;
let oscSocket = null;  // Changed from oscPort
let latestResponse = '';


function init() {
  const asciiTitle = document.querySelector('.ascii-title');
  
  // Hide everything initially
  if (inputLine) inputLine.style.display = 'none';
  if (asciiTitle) asciiTitle.style.display = 'none';
  userInput.disabled = true;
  output.innerHTML = '';

  // Show only the start prompt
  addLine('PRESS [ENTER] TO START...', 'system');

  const startListener = (e) => {
    if (e.key === 'Enter') {
      window.removeEventListener('keydown', startListener);
      output.innerHTML = ''; // Clear the "Press Enter" message
      runSlowBoot(); // Start the slow loading sequence
    }
  };
  window.addEventListener('keydown', startListener);
}

async function runSlowBoot() {
  const asciiTitle = document.querySelector('.ascii-title');
  
  // A. Slowly draw the ASCII Title
  if (asciiTitle) {
    const fullText = asciiTitle.textContent;
    const lines = fullText.split('\n');
    asciiTitle.textContent = '';
    asciiTitle.style.display = 'block';

    for (let line of lines) {
      asciiTitle.textContent += line + '\n';
      scrollToBottom();
      await new Promise(r => setTimeout(r, 200)); // Very slow line drawing
    }
  }
  
  initOSC(); // Connect to TouchDesigner
  
  await checkStatus(); // Connect to AI
  
  if (inputLine) inputLine.style.display = 'flex';
  userInput.disabled = false;
  userInput.focus();
  
  // Enable regular input handling
  userInput.addEventListener('keydown', handleKeyDown);
}


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

// Check Keyboard Press
function handleKeyDown(e){
  if(e.key === 'Enter'){
    handleprompt();
  }
  else if (e.key === 'ArrowUp'){
    navigateHistory('up');
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
    
    if (prompt.toLowerCase() === 'clear'){
        clearTerminal();

        sendOSC('/ai/prompt', [{ type: 's', value: 'clear' }]);
        sendOSC('/ai/promptcount', [{ type: 'i', value: promptHistory.length }]);
        
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

    //addLine('→ Data sent to TouchDesigner via OSC', 'system');
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
    clear: clearTerminal
};