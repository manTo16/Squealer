<template>
  <div class="bg-white p-4 rounded-lg shadow-md mt-16 w-2/5 ml-10">
    <select v-model="feedMode" class="border border-gray-300 rounded-md px-2 py-1 mb-4">
      <!-- <option value="all">Tutti i post</optio> -->
      <option value="most-viewed">Post più visti</option>
      <option value="most-liked">Post più positivi</option>
      <option value="most-disliked">Post più negativi</option>
    </select>
    <div v-if="feedMode === 'all'">
      <Feed query="all"/>
    </div>
    <div v-else-if="feedMode === 'most-viewed'">
      <Feed query="views"/>
    </div>
    <div v-else-if="feedMode === 'most-liked'">
      <Feed query="positiveReactions" />
    </div>
    <div v-else-if="feedMode === 'most-disliked'">
      <Feed query="negativeReactions"/>
    </div>
  </div>
</template>

<script>
import Feed from '@/components/Feed.vue'

export default {
  components: {
    Feed
  },
  data(){
    return{
      feedMode:'most-viewed'
    }
  }
}
</script>

<style>

</style>