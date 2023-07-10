# mediapipe_demo

mediapipe js例子🌰

## 启动项目

```
npm install
```

```
npm run serve
```

开发环境需在 `public/@mediapipe` 文件夹下放入 mediapipe 各模块的静态资源，例如使用 hands 模块，需要到 `@mediapipe/hands` github下载静态资源。

或者令 `Vue.prototype.$MEDIAPIPE_MODEL_RESOURCE='https://cdn.jsdelivr.net/npm/@mediapipe'`。

# 参考资料

- <https://chuoling.github.io/mediapipe>

- <https://developers.google.cn/mediapipe/solutions/guide>

![手部检测结果数组参考](./docs/hand-landmarks.png)