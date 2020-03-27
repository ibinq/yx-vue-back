<template>
  <div class="act-form">
    <iframe class="iframe" :src="src"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "http://127.0.0.1:8081/druid/index.html"
    };
  }
};
</script>
<style  >
.iframe {
  width: 100%;
  height: calc(100vh - 150px);
}
</style>