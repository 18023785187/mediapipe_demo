<template>
  <div class="face-mesh">
    <viewer ref="controller" />
    <div ref="container3d" class="container3d"></div>
  </div>
</template>

<script>
import * as FaceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
// import * as Control from "@mediapipe/control_utils";
import * as Drawing from "@mediapipe/drawing_utils";
import renderMorphTargetsFace from "./renderMorphTargetsFace";
import faceConnect from "./faceConnect";

export default {
  name: "FaceMesh",
  data() {
    return {
      options: {
        selfieMode: false, // 镜面是否翻转
        maxNumFaces: 1, // 最大检查人脸数
        refineLandmarks: true, // 细化眼睛和嘴唇周围的地标坐标，并输出虹膜周围的其他地标
        enableSegmentation: false, // 遮罩层
        minDetectionConfidence: 0.5, // 越高越好，越消耗性能，0-1
        minTrackingConfidence: 0.5, // 越高越好，越消耗性能，0-1
      },
    };
  },
  async mounted() {
    console.log("@mediapipe/face_mesh", FaceMesh);
    const [faceMesh, onResults] = this.init();
    // 创建3d模型
    const object3D = await renderMorphTargetsFace(this.$refs.container3d);
    onResults((results) => {
      faceConnect(object3D, results);
    });
  },
  methods: {
    init() {
      // 载入重要文件，会以script标签的形式插入
      const faceMesh = new FaceMesh.FaceMesh({
        locateFile: (file) => {
          return `${this.$MEDIAPIPE_MODEL_RESOURCE}/face_mesh/${file}`;
        },
      });
      faceMesh.setOptions(this.options);

      const video = this.$refs.controller.getVideo();
      const canvas = this.$refs.controller.getCanvas();
      const canvasCtx = canvas.getContext("2d");

      const camera = new Camera(video, {
        // 每帧进行检测
        onFrame: async () => {
          await faceMesh.send({ image: video });
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
        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_TESSELATION,
              {
                color: "#C0C0C070",
                lineWidth: 1,
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_RIGHT_EYE,
              {
                color: "#FF3030",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_RIGHT_EYEBROW,
              {
                color: "#FF3030",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_RIGHT_IRIS,
              {
                color: "#FF3030",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_LEFT_EYE,
              {
                color: "#30FF30",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_LEFT_EYEBROW,
              {
                color: "#30FF30",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_LEFT_IRIS,
              {
                color: "#30FF30",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_FACE_OVAL,
              {
                color: "#E0E0E0",
              }
            );
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_LIPS,
              {
                color: "#E0E0E0",
              }
            );
          }
        }
        canvasCtx.restore();
      };

      return [
        faceMesh,
        (callback = (results) => {}) => {
          // 监听检测返回的结果
          faceMesh.onResults((results) => {
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
.container3d {
  width: 500px;
  height: 500px;
}
</style>
