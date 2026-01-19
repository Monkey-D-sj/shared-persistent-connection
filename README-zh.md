# 共享持久连接
[中文](./README-zh.md) | [English](./README.md)

解决浏览器多标签页使用同一长连接SSE，占用多个TCP连接（HTTP 1.1）的问题(当然可以升级到http2解决)

需要浏览器支持
- [navigator.locks](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/locks)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

特色
- 基于[@microsoft/fetch-event-source](https://github.com/Azure/fetch-event-source/blob/main/package.json)，SSE支持多种请求（GET，POST等），自定义头部等等
- 基于`navigator.locks`，实现浏览器多标签页之间的协调，确保只有一个标签页连接SSE服务器，当连接sse的标签页关闭/刷新，下一个排队的标签自动发起新的sse
- 基于`BroadcastChannel`，实现浏览器多标签页之间的通信，确保所有标签页都能收到SSE服务器的消息

## 🚀 快速开始

### 安装
```bash
npm install shared-persistent-connection
# or
yarn add shared-persistent-connection
# or
pnpm install shared-persistent-connection
```

### 使用
```javascript
import SharedPersistentConnection from 'shared-persistent-connection';

const connection = new SharedPersistentConnection('https://api.example.com/sse', {
  method: 'POST', // 请求方法
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }, // 自定义头部
  onmessage: (event) => {
    console.log('Received:', event.data);
  }, // 接收消息
  onopen: () => {
    console.log('SSE connection established');
  }, // 连接成功
  onerror: (err) => {
    console.error('SSE error:', err);
  } // 错误
});

connection.close(); // 关闭连接
```
