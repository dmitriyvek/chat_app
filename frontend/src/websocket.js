class WebSocketService {
  static instance = null;
  callbackList = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(chatId) {
    const path = `ws://127.0.0.1:8000/ws/chat/${chatId}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect(chatNchatIdame);
    };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbackList).length === 0) {
      return;
    }
    if (command === "message_list") {
      this.callbackList[command](parsedData.message_list);
    }
    if (command === "new_message") {
      this.callbackList[command](parsedData.message);
    }
  }

  fetchMessageList(chatId) {
    this.sendMessage({
      command: "fetch_message_list",
      chatId: chatId,
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      chatId: message.chatId,
      authorId: message.authorId,
      content: message.content,
    });
  }

  addCallbackList(messageListCallback, newMessageCallback) {
    this.callbackList["message_list"] = messageListCallback;
    this.callbackList["new_message"] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback) {
    const socket = this;
    const recursionConnectionCall = this.waitForSocketConnection;
    setTimeout(function () {
      if (socket.state() === 1) {
        console.log("connection is made");
        if (callback !== null) {
          callback();
        }
        return;
      } else {
        console.log("waiting for connection...");
        recursionConnectionCall(callback);
      }
    }, 500);
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
