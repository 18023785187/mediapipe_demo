<template>
  <div class="hands">
    <viewer ref="controller" />
  </div>
</template>

<script>
import * as Hands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
// import * as Control from "@mediapipe/control_utils";
import * as Drawing from "@mediapipe/drawing_utils";

export default {
  name: "Hands",
  data() {
    return {
      options: {
        maxNumHands: 2, // 检测手的最大数目
        modelComplexity: 1, // 检查手的复杂性, 0 1
        minDetectionConfidence: 0.5, // 越高越好，越消耗性能，0-1
        minTrackingConfidence: 0.5, // 越高越好，越消耗性能，0-1
      },
    };
  },
  mounted() {
    console.log("@mediapipe/hands", Hands);
    const hands = this.init();
  },
  methods: {
    init() {
      // 载入重要文件，会以script标签的形式插入
      const hands = new Hands.Hands({
        locateFile: (file) => {
          return `${this.$MEDIAPIPE_MODEL_RESOURCE}/hands/${file}`;
        },
      });
      hands.setOptions(this.options);

      const video = this.$refs.controller.getVideo();
      const canvas = this.$refs.controller.getCanvas();
      const canvasCtx = canvas.getContext("2d");

      // 监听检测返回的结果
      hands.onResults((results) => {
        // // 打印检测结果
        // console.log('results:', results)
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            Drawing.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 5,
            });
            Drawing.drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }
        canvasCtx.restore();
      });

      const camera = new Camera(video, {
        // 每帧进行检测
        onFrame: async () => {
          await hands.send({ image: video });
        },
      });
      camera.start();

      return hands;
    },
  },
};
</script>

<style></style>
