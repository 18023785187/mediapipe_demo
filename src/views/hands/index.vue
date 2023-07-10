<template>
  <div class="hands">
    <viewer ref="controller" />
    <div class="box" :style="boxStyle"></div>
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
        selfieMode: true, // 镜面是否翻转
        maxNumHands: 2, // 检测手的最大数目
        modelComplexity: 1, // 检查手的复杂性, 0 1
        minDetectionConfidence: 0.5, // 越高越好，越消耗性能，0-1
        minTrackingConfidence: 0.5, // 越高越好，越消耗性能，0-1
      },
      boxPosX: 0,
      boxPosY: 0,
      boxScale: 1
    };
  },
  computed: {
    boxStyle() {
      return {
        transform: `translate3d(${this.boxPosX}, ${this.boxPosY}, 0) scale(${this.boxScale})`,
      }
    }
  },
  mounted() {
    console.log("@mediapipe/hands", Hands);
    const [hands, onResults] = this.init();

    // 编写一个图片跟踪手指🌰
    const imageTrace = (results) => {
      if(results.multiHandLandmarks.length) {
        // 拇指指尖
        const { x: x4, y: y4, z: z4 } = results.multiHandLandmarks[0][4]
        // 食指指尖
        const { x: x8, y: y8, z: z8 } = results.multiHandLandmarks[0][8]
        this.boxPosX = x8 * 100 + 'vw'
        this.boxPosY = y8 * 100 + 'vh'

        // 计算两个坐标距离
        const distance = Math.sqrt(
          (x4 - x8)**2 + (y4 - y8)**2 + (z4 - z8)**2
        )
        const unitDistance = .3
        this.boxScale = distance / unitDistance
      }
    }

    onResults((results) => {
      // console.log(results)
      imageTrace(results)
    });
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

      const camera = new Camera(video, {
        // 每帧进行检测
        onFrame: async () => {
          await hands.send({ image: video });
        },
      });
      camera.start();

      // 把检测结果绘制到canvas中
      const drawResults = (results) => {
        // // 打印检测结果
        // console.log('results:', results)
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              Hands.HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 5,
              }
            );
            Drawing.drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }
        canvasCtx.restore();
      };

      return [
        hands,
        (callback = (results) => {}) => {
          // 监听检测返回的结果
          hands.onResults((results) => {
            drawResults(results);
            callback(results);
          });
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.hands {}

.box {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  background: url(https://img.bosszhipin.com/beijin/upload/avatar/20230628/607f1f3d68754fd0a797ee87c86e0555a5e23d22e4d1a5519fa9e4de5f683d8a28a90754fd577d7d_s.png)  center center no-repeat;
}
</style>
