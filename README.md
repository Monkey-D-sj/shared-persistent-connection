# Shared Persistent Connection
[中文](./README-zh.md) | [English](./README.md)

Solves the issue where multiple browser tabs using the same long-lived SSE connection occupy multiple TCP connections (HTTP 1.1).
However, this problem can be mitigated by upgrading to HTTP/2.

## Browser Requirements
- [navigator.locks](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/locks)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

## Features
- Based on [@microsoft/fetch-event-source](https://github.com/Azure/fetch-event-source/blob/main/package.json), SSE supports multiple request methods (GET, POST, etc.), custom headers, and more.
- Utilizes `navigator.locks` to coordinate between multiple browser tabs, ensuring only one tab connects to the SSE server. When the tab connected to SSE is closed/refreshed, the next queued tab will automatically initiate a new SSE
- Uses `BroadcastChannel` for communication between multiple browser tabs, ensuring all tabs receive messages from the SSE server.

## 🚀 Quick Start

### Installation
```bash
npm install shared-persistent-connection
# or
yarn add shared-persistent-connection
# or
pnpm install shared-persistent-connection
```

### Usage
```javascript
import SharedPersistentConnection from 'shared-persistent-connection';

const connection = new SharedPersistentConnection('https://api.example.com/sse', {
  method: 'POST', // request method
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }, // custom headers
  onmessage: (event) => {
    console.log('Received:', event.data);
  }, // accept message
  onopen: () => {
    console.log('SSE connection established');
  }, // connection success
  onerror: (err) => {
    console.error('SSE error:', err);
  } // error
});

connection.close(); // close connection
```
