<template>
  <div class="flex flex-col h-screen">
    <Navbar/>
    <div class="flex flex-1 ">
      <Sidebar @vip-selected="handleSelection"/>
      <VipHistory :key="vipKey" v-if="display==='feed'" />
      <VipPost v-if="display==='post'" />
      <VipCard v-if="vipdata" :vipdata="vipdata" @switch-display="handleSwitch"/>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Feed from '@/components/Feed.vue';
import Sidebar from '@/components/Sidebar.vue';
import VipCard from '@/components/VipCard.vue'
import getUserData from '@/composables/getUserData.js'
import VipPost from '@/components/VipPost.vue';
import VipHistory from '@/components/VipHistory.vue'

export default {
  name: 'HomeView',
  data(){
    return{
      vipdata: null,
      display: '',
      vipKey: 0
    };
  },
  components: {
    Navbar,
    Feed,
    Sidebar,
    VipCard,
    VipPost,
    VipHistory
  },
  methods:{
    async handleSelection(vip){
      await getUserData(vip);
      const selectedVip = localStorage.getItem('selected-vip');
      if (selectedVip) {
        this.vipdata = JSON.parse(selectedVip);
        this.display='feed'
        this.vipKey++;
      } else {
        console.error('Il dato "selected-vip" non esiste nel localStorage');
      }
    },
    handleSwitch(display){
      this.display = display
    }
  }
}
</script>
