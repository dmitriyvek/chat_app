class WebSocketService {
  static instance = null;

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.callbackList = {};
    this.socketReconnectTimerId = 0;
  }

  connect(userId) {
    if (this.socketReconnectTimerId) {
      clearTimeout(this.socketReconnectTimerId);
      this.socketReconnectTimerId = 0;
    }
    // if (this.socketRef) {
    //   this.disconnect();
    // }
    const path = `ws://127.0.0.1:8000/ws/user/${userId}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log("error");
    };
    this.socketRef.onclose = (closeEvent) => {
      if (closeEvent.code !== 1000) {
        console.log("WebSocket closed unexpectedly");
        this.disconnect();

        this.socketReconnectTimerId = setTimeout(() => {
          this.connect(userId);
        }, 3000);
      } else {
        console.log("WebSocket closed on demand");
      }
    };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbackList).length !== 0) {
      if (command === "message_list") {
        this.callbackList[command](parsedData.message_list);
      }
      if (command === "new_message") {
        this.callbackList[command](parsedData.message);
      }
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
      recipientId: message.recipientId,
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
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
