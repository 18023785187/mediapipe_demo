<template>
  <div class="viewer">
    <video
      ref="video"
      class="input_video"
      :width="width"
      :height="height"
      autoplay
    ></video>
    <canvas ref="canvas" class="output_canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
export default {
  name: "Viewer",
  data() {
    return {
      // width: 640,
      // height: 480,
      width: 320,
      height: 240,
    };
  },
  methods: {
    getVideo() {
      return this.$refs.video;
    },
    getCanvas() {
      return this.$refs.canvas;
    },
  },
};
</script>

<style lang="scss" scoped>
.viewer {
  width: 100%;
  min-width: 1300px;

  .output_canvas {
    margin-left: 20px;
  }
}
</style>
