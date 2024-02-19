<template>
  <div class="flex flex-col h-screen">
    <Navbar/>
    <div class="flex flex-1 ">
      <Sidebar @vip-selected="handleSelection"/>
      <VipPost />
      <VipCard v-if="vipdata" :vipdata="vipdata" />
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

export default {
  name: 'HomeView',
  data(){
    return{
      vipdata: null
    };
  },
  components: {
    Navbar,
    Feed,
    Sidebar,
    VipCard,
    VipPost
  },
  methods:{
    async handleSelection(vip){
      await getUserData(vip);
      const selectedVip = localStorage.getItem('selected-vip');
      if (selectedVip) {
        this.vipdata = JSON.parse(selectedVip);
      } else {
        console.error('Il dato "selected-vip" non esiste nel localStorage');
  }
}
  }
}
</script>
