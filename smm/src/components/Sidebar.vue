<template>
  <aside class="w-1/4 bg-emerald-200 p-4 mt-16">
    <h2 class="text-lg font-bold mb-4 text-center">Vips</h2>
    <div v-for="(vip, index) in vips" :key="vip">
      <button :class="{ 'border-2 border-white bg-emerald-500': index === lastSelectedIndex }" @click="emitEvent(vip,index)" class="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-full mb-2">{{ vip }}</button>
    </div>

  </aside>
</template>

<script>

import { ref } from 'vue';

export default {
  data(){
    return{
      lastSelectedIndex: -1
    };
  },
  setup (){
    const vips = ref([])
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? {}
    vips.value = userDetails.smmClients
    return {
      vips,
    }
  },
  methods:{
    emitEvent(vip,index){
      this.lastSelectedIndex=index
      this.$emit('vip-selected',vip)
    }
  }
};
</script>

