<template>
  <div class="face-mesh">
    <viewer ref="controller" />
  </div>
</template>

<script>
import * as FaceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
// import * as Control from "@mediapipe/control_utils";
import * as Drawing from "@mediapipe/drawing_utils";

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
  mounted() {
    console.log("@mediapipe/face_mesh", FaceMesh);
    const faceMesh = this.init();
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

      // 监听检测返回的结果
      faceMesh.onResults((results) => {
        // // 打印检测结果
        // console.log('results:', results)
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_TESSELATION, {
              color: "#C0C0C070",
              lineWidth: 1,
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_RIGHT_EYE, {
              color: "#FF3030",
            });
            Drawing.drawConnectors(
              canvasCtx,
              landmarks,
              FaceMesh.FACEMESH_RIGHT_EYEBROW,
              {
                color: "#FF3030",
              }
            );
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_RIGHT_IRIS, {
              color: "#FF3030",
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LEFT_EYE, {
              color: "#30FF30",
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LEFT_EYEBROW, {
              color: "#30FF30",
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LEFT_IRIS, {
              color: "#30FF30",
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_FACE_OVAL, {
              color: "#E0E0E0",
            });
            Drawing.drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LIPS, {
              color: "#E0E0E0",
            });
          }
        }
        canvasCtx.restore();
      });

      const camera = new Camera(video, {
        // 每帧进行检测
        onFrame: async () => {
          await faceMesh.send({ image: video });
        },
      });
      camera.start();

      return faceMesh;
    },
  },
};
</script>

<style></style>
