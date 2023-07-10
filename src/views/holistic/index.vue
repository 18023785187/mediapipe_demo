<template>
  <div class="holistic">
    <viewer ref="controller" />
  </div>
</template>

<script>
import * as Holistic from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
// import * as Control from "@mediapipe/control_utils";
import * as Drawing from "@mediapipe/drawing_utils";

export default {
  name: "Holistic",
  data() {
    return {
      options: {
        selfieMode: false, // 镜面是否翻转
        modelComplexity: 1, // 模型的复杂性 0 1 2
        smoothLandmarks: true, // 减少抖动
        enableSegmentation: false, // 遮罩层
        smoothSegmentation: true, // 减少抖动
        refineFaceLandmarks: false, // 细化眼睛和嘴唇周围的地标坐标，并输出虹膜周围的其他地标
        minDetectionConfidence: 0.5, // 越高越好，越消耗性能，0-1
        minTrackingConfidence: 0.5, // 越高越好，越消耗性能，0-1
      },
    };
  },
  mounted() {
    console.log("@mediapipe/holistic", Holistic);
    const [holistic, onResults] = this.init();
    onResults((results) => {
      // todo
    });
  },
  methods: {
    init() {
      // 载入重要文件，会以script标签的形式插入
      const holistic = new Holistic.Holistic({
        locateFile: (file) => {
          return `${this.$MEDIAPIPE_MODEL_RESOURCE}/holistic/${file}`;
        },
      });
      holistic.setOptions(this.options);

      const video = this.$refs.controller.getVideo();
      const canvas = this.$refs.controller.getCanvas();
      const canvasCtx = canvas.getContext("2d");

      const camera = new Camera(video, {
        // 每帧进行检测
        onFrame: async () => {
          await holistic.send({ image: video });
        },
      });
      camera.start();

      // 把检测结果绘制到canvas中
      const drawResults = (results) => {
        // // 打印检测结果
        // console.log('results:', results)
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.options.enableSegmentation) {
          canvasCtx.drawImage(
            results.segmentationMask,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = "source-in";
        canvasCtx.fillStyle = "#00FF00";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = "destination-atop";
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        canvasCtx.globalCompositeOperation = "source-over";
        Drawing.drawConnectors(
          canvasCtx,
          results.poseLandmarks,
          Holistic.POSE_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 4,
          }
        );
        Drawing.drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
        Drawing.drawConnectors(
          canvasCtx,
          results.faceLandmarks,
          Holistic.FACEMESH_TESSELATION,
          {
            color: "#C0C0C070",
            lineWidth: 1,
          }
        );
        Drawing.drawConnectors(
          canvasCtx,
          results.leftHandLandmarks,
          Holistic.HAND_CONNECTIONS,
          {
            color: "#CC0000",
            lineWidth: 5,
          }
        );
        Drawing.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "#00FF00",
          lineWidth: 2,
        });
        Drawing.drawConnectors(
          canvasCtx,
          results.rightHandLandmarks,
          Holistic.HAND_CONNECTIONS,
          {
            color: "#00CC00",
            lineWidth: 5,
          }
        );
        Drawing.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
        canvasCtx.restore();
      };

      return [
        holistic,
        (callback = (results) => {}) => {
          // 监听检测返回的结果
          holistic.onResults((results) => {
            drawResults(results);
            callback(results);
          });
        },
      ];
    },
  },
};
</script>

<style></style>
