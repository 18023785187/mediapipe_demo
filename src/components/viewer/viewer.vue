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
      width: 640,
      height: 480,
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
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  min-width: 1300px;
}
</style>
