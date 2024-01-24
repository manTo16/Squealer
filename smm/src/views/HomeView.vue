<template>
  <div class="flex flex-col h-screen">
    <Navbar/>
    <div class="flex flex-1 ">
      <Sidebar />
      <Feed />
      <VipCard />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Feed from '@/components/Feed.vue';
import Sidebar from '@/components/Sidebar.vue';
import VipCard from '@/components/VipCard.vue'
export default {
  name: 'HomeView',
  components: {
    Navbar,
    Feed,
    Sidebar,
    VipCard
  }
}
</script>
