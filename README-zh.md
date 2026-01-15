# 共享持久连接
[中文](./README-zh.md) | [English](./README.md)

解决浏览器多标签页使用同一长连接SSE，占用多个TCP连接（HTTP 1.1）的问题

需要浏览器支持
- [navigator.locks](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/locks)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

特色
- SSE支持多种请求（GET，POST等），自定义头部，错误重试策略