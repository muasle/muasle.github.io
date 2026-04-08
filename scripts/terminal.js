// Configuration
const CONFIG = {
  host: 'http://localhost:11434',
  model: 'llama3.2'
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

// State
let promptHistory = [];    // saves prompt history
let historyIndex = -1;      // tracks position
let isProcessing = false;   // prevents too many prompts
let websocket = null;       // web connection to TD
let response = '';

// Initialize
function init(){
  userInput.addEventListener('keydown', handleKeyDown);
  userInput.focus();
  connectToTouchDesigner();
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
        // Send prompt to Ollama (no restrictions)
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
          prompt: prompt,  // Send prompt as-is, no modification
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

    connectToTouchDesigner({
      type: 'text_response',
      prompt: prompt,
      response: aiResponse,
      timestamp: Date.now()
    });

    // TEST
    //addLine('sending ---------------', 'system');
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


function connectToTouchDesigner(){
    try{
      websocket = new WebSocket('ws://localhost:8080');
      
      websocket.onopen = () => {
          addLine('TouchDesigner connected', 'system');
      };
      
      websocket.onerror = () => {
          addLine('Error: TouchDesigner not connected', 'warning');
      };
      
      websocket.onclose = () => {
          console.log('TouchDesigner disconnected');
      };
      
  } catch (error) {
      console.log('TouchDesigner connection failed');
  }
}


function sendToTouchDesigner(data){
  if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(data));
      return true;
  }
  return false;
}


function showHelp(){
  addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  addLine('AVAILABLE promptS:', 'prompt');
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
  
  // Check TouchDesigner
  const tdStatus = websocket && websocket.readyState === WebSocket.OPEN;
  addLine(`  TouchDesigner:   ${tdStatus ? 'CONNECTED' : 'STANDBY'}`, tdStatus ? 'system' : 'warning');
  
  addLine(`  Prompts Run:    ${promptHistory.length}`, 'system');
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


window.visualizeAI = {
    generate: generateResponse,
    sendToTD: sendToTouchDesigner,
    getLastResponse: () => latestResponse,
    getHistory: () => commandHistory,
    clear: clearTerminal
};