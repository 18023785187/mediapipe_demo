<template>
  <el-container>
    <el-header>
      <el-button
        type="primary"
        v-for="link of links"
        :key="link.routeName"
        :disabled="currentRouteName === link.routeName"
        @click="to(link.routeName)"
        >{{ link.title }}</el-button
      >
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Container",
  data() {
    return {
      links: [
        {
          title: "人脸面网格",
          routeName: "face-mesh",
        },
        {
          title: "手部",
          routeName: "hands",
        },
        {
          title: "全身",
          routeName: 'holistic'
        }
      ],
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    to(routeName) {
      this.$router.push({
        name: routeName,
      });
    },
  },
};
</script>
<style>
.el-container {
  width: 100vw;
  height: 100vh;
}

.el-header {
  height: auto !important;
  padding: 20px !important;
}
</style>
