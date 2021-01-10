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

  connect(token) {
    if (this.socketReconnectTimerId) {
      clearTimeout(this.socketReconnectTimerId);
      this.socketReconnectTimerId = 0;
    }
    // if (this.socketRef) {
    //   this.disconnect();
    // }
    const path = `${process.env.SOCKET_HOST}/ws/user?token=${token}`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log("error:", e.data);
    };
    this.socketRef.onclose = (closeEvent) => {
      if (closeEvent.code !== 1000) {
        console.log(
          `WebSocket closed unexpectedly; close event code: ${closeEvent.code}`
        );
        this.disconnect();

        this.socketReconnectTimerId = setTimeout(() => {
          this.connect(token);
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
      if (command === "new_message") {
        this.callbackList[command](parsedData.data);
      }
      if (command === "new_chat") {
        this.callbackList[command](parsedData.data);
      }
      if (command === "new_friend") {
        this.callbackList[command](parsedData.data);
      }
    }
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      chatId: parseInt(message.chatId),
      authorId: message.authorId,
      recipientId: message.recipientId,
      content: message.content,
    });
  }

  newChatCreation(chat) {
    this.sendMessage({
      command: "new_chat",
      userId: chat.userId,
      recipientId: chat.recipientId,
    });
  }

  newFriendCreation(idList) {
    this.sendMessage({
      command: "new_friend",
      userId: idList.userId,
      friendId: idList.friendId,
    });
  }

  addCallbackList(newMessageCallback, newChatCallback, newFriendCallback) {
    this.callbackList["new_message"] = newMessageCallback;
    this.callbackList["new_chat"] = newChatCallback;
    this.callbackList["new_friend"] = newFriendCallback;
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
