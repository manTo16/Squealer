<template>
  <div>

    <Navbar/>
    <Feed />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Feed from '@/components/Feed.vue'
export default {
  name: 'HomeView',
  components: {
    Navbar,
    Feed
  }
}
</script>
