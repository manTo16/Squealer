<template>
  <aside class="w-1/4 bg-emerald-200 p-4">
    <h2 class="text-lg font-bold mb-4 text-center">Vips</h2>
    <div v-for="vip in vips" :key="vip">
      <button class="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-full mb-2">{{ vip }}</button>
    </div>

  </aside>
</template>

<script>

import { ref } from 'vue';

export default {
  setup (){
    const vips = ref([])
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}
    vips.value = userDetails.smmClients
    return {
      vips,
    }
  }
};
</script>

