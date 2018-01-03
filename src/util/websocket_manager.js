export default class WebsocketManager {

  constructor(websocketServerPath, onWebsocketMessage) {
    var uri = undefined;
    if (window.location.protocol === "https:") {
      uri = "wss:";
    }
    else {
      uri = "ws:";
    }
    uri += "//" + window.location.host;
    uri += websocketServerPath;
    this.websocketServerUri = uri;
    this.websocketConnected = false;
    this.onWebsocketMessage = onWebsocketMessage;
  }

  connectWebsocket() {
    if (this.websocketConnected) {
      console.log('Websocket already connected...');
    }
    else {
      console.log(`Trying to connect to websocket @ ${this.websocketServerUri}...`);
      this.websocketConnected = true;
      this.websocket = new WebSocket(this.websocketServerUri);
      this.websocket.onopen = () => {
        this.websocketConnected = true;
        console.log('Socket opened');
      }
      this.websocket.onclose = () => {
        console.log('Socket closed');
        this.websocket = null;
        this.websocketConnected = false;
        setTimeout(() => { this.connectWebsocket() }, 5000);
      }
      this.websocket.onerror = (err) => {
        console.log('Socket error', err);
        this.websocket = null;
        this.websocketConnected = false;
        setTimeout(() => { this.connectWebsocket() }, 5000);
      }
      this.websocket.onmessage = (message) => {
        try {
          this.onWebsocketMessage(JSON.parse(message.data));
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }

  startWebsocket() {
    try {
      this.connectWebsocket();
    }
    catch (e) {
      setTimeout(() => { this.startWebsocket() }, 5000);
    };
  }
}