const WebSocket = require('ws');
const osc = require('osc');

// WebSocket server for browser connection
const wss = new WebSocket.Server({ port: 8081 });

// UDP port for sending OSC to TouchDesigner
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  remoteAddress: "127.0.0.1",
  remotePort: 8000,
  metadata: true
});

udpPort.on("ready", function () {
  console.log("✓ UDP Port is ready");
});

udpPort.on("error", function (error) {
  console.log("UDP Error:", error);
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('✓ Browser connected to OSC bridge');

  ws.on('message', (data) => {
    try {
      // Parse JSON from browser
      const messageStr = data.toString();
      const oscMessage = JSON.parse(messageStr);
      
      console.log('→ Received:', oscMessage.address);
      
      // Format args properly with types
      const formattedArgs = oscMessage.args.map(arg => {
        // If arg already has type and value, use it
        if (typeof arg === 'object' && arg.type && arg.value !== undefined) {
          return {
            type: arg.type,
            value: arg.value
          };
        }
        // Otherwise infer the type
        else if (typeof arg === 'number') {
          // Check if integer or float
          return {
            type: Number.isInteger(arg) ? 'i' : 'f',
            value: arg
          };
        }
        else if (typeof arg === 'string') {
          return {
            type: 's',
            value: arg
          };
        }
        else {
          return {
            type: 's',
            value: String(arg)
          };
        }
      });
      
      // Send OSC message via UDP to TouchDesigner
      udpPort.send({
        address: oscMessage.address,
        args: formattedArgs
      });
      
      // Log preview
      const preview = formattedArgs[0] ? 
        (typeof formattedArgs[0].value === 'string' ? 
          formattedArgs[0].value.substring(0, 50) : 
          formattedArgs[0].value) 
        : '';
      console.log('✓ Sent to TD:', oscMessage.address, preview);
      
    } catch (err) {
      console.error('❌ Error:', err.message);
      console.error('   Stack:', err.stack);
    }
  });

  ws.on('close', () => {
    console.log('✗ Browser disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket Server error:', error.message);
});

console.log('╔════════════════════════════════════════╗');
console.log('║   OSC Bridge Server Running            ║');
console.log('╚════════════════════════════════════════╝');
console.log('WebSocket: ws://localhost:8081');
console.log('OSC Out:   127.0.0.1:8000 (UDP)');
console.log('Waiting for connections...\n');