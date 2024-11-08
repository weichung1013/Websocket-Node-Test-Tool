const heartbeatInterval = 10; //seconds
const heartbeatTimeout = 5; //seconds

class WsService {
  constructor() {
    this.ws = null;
    this.pingInterval = null;
    this.pongTimeout = null;
  }

  connect(url) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connection opened");
      this.startHeartbeat();
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      this.stopHeartbeat();
      // reconnect
      // TODO: set retry count
      setTimeout(() => this.connect(url), 5000);
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    this.ws.onmessage = (message) => {
      console.log("WebSocket message received:", message.data);
      if (message.data === "pong") {
        clearTimeout(this.pongTimeout);
      }
    };
  }

  startHeartbeat() {
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send("ping");
        this.pongTimeout = setTimeout(() => {
          console.log("Pong not received, closing connection");
          this.ws.close();
        }, heartbeatTimeout * 1000);
      }
    }, heartbeatInterval * 1000);
  }

  stopHeartbeat() {
    clearInterval(this.pingInterval);
    clearTimeout(this.pongTimeout);
  }

  _unbindEvents(ws) {
    ws.onopen = null;
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
  }
}

// create new ws connection
const modelID = "019265cc-4e5a-4aa2-8a3f-4cdf060c629d";
const token = ``;
// client id = random uuid
const clientID = "b0a0e5e7-0f0b-4b4b-9a6b-7e1c0f3d8f6f";
const url =
  "ws://localhost:5088/connect/" + modelID + "/" + token + "/" + clientID;
console.log(url);
const wsService = new WsService();
wsService.connect(url);
