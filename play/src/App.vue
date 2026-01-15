<script setup lang="ts">
import { SharedPersistentConnection } from "../../src";

const connection = new SharedPersistentConnection('http://localhost:3000/sse', {
  onmessage: (event) => {
    console.log(event)
  }
})
</script>

<template>

</template>

<style scoped>
</style>
