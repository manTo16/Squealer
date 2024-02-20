<template>
  <div>
    <div class="bg-white p-4 mb-4 rounded-md shadow-md">
      <div class="flex flex-col">
        <div>
          <div class="flex mb-2">
            <h3 class="font-semibold">{{ postData.displayName }}</h3>
            <p class="ml-2 text-slate-500">@{{ postData.username }}</p>
          </div>
            <p v-if="type==='text'">{{ postData.text }}</p>
            <img v-if="type==='img'" :src="postData.text" alt="">
            <Map v-if="type==='map'" :coordinates="postData.text" :isArea="isArea"/>
        </div>
        <div class="flex align-top mt-3">  
          <ViewsSvg class="m-1" />
          <p v-if="postData.impressions && postData.impressions.views && postData.impressions.views.number" >{{ postData.impressions.views.number }}</p>
          <p v-else>0</p>
          <HeartSvg class="ml-5 m-1"/>
          <p v-if="postData.impressions && postData.impressions.veryLikes && postData.impressions.veryLikes.number">{{ postData.impressions.veryLikes.number }}</p>
          <p v-else>0</p>
          <ThumbsUpSvg class="ml-5 m-1" />
          <p v-if="postData.impressions && postData.impressions.likes && postData.impressions.likes.number">{{ postData.impressions.likes.number }}</p>
          <p v-else>0</p>
          <ThumbsDownSvg class="ml-5 m-1" />
          <p v-if="postData.impressions && postData.impressions.dislikes && postData.impressions.dislikes.number">{{ postData.impressions.dislikes.number }}</p>
          <p v-else>0</p>
          <BrokenHeartSvg class="ml-5 m-1" />
          <p v-if="postData.impressions && postData.impressions.veryDisikes && postData.impressions.veryDisikes.number">{{ postData.impressions.veryDislikes.number }}</p>
          <p v-else>0</p>
          <button class="ml-auto border border-black rounded-full px-2 py-1" @click="HandleShowReplies" v-if="replies">Toggle Risposte ({{ replies }})</button>
        </div>
      </div>
    </div>
    <RepliesFeed v-if="showReplies" :repliesTo="id" :key="id"/>
  </div>
</template>

<script>
import { apiPostsURL } from '@/URLs';
import { ref } from 'vue';
import BrokenHeartSvg from './svg/BrokenHeartSvg.vue';
import ThumbsDownSvg from './svg/ThumbsDownSvg.vue';
import ThumbsUpSvg from './svg/ThumbsUpSvg.vue';
import ViewsSvg from './svg/ViewsSvg.vue';
import HeartSvg from './svg/HeartSvg.vue';
import Map from './Map.vue';
import RepliesFeed from './RepliesFeed.vue'

export default {
  props: {
    postId: String
  },
  components: {
    BrokenHeartSvg,
    ThumbsDownSvg,
    ThumbsUpSvg,
    ViewsSvg,
    HeartSvg,
    Map,
    RepliesFeed
  },
  setup(props){
    const showReplies = ref(false)
    const postData = ref({})
    const id = ref('')
    const replies = ref(0)
    const type = ref('text')
    const isArea = ref(false)
    const isBase64 = (str) => {
      return str.startsWith('data:image/');
    }
    const isCoordinates = (str) => {
      const regex = /^((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)[+]?)+|area$/;
      if (str.endsWith('area')) {
        isArea.value = true
      }
      return regex.test(str);
    }

    const loadPost = async () =>{
      try{
        const response = await fetch(apiPostsURL+'/'+props.postId)
        if (response.ok){
          postData.value = await response.json()
          if (isBase64(postData.value.text)) type.value = 'img'
          replies.value = postData.value.replies.length
          id.value = postData.value.postId
          if (isCoordinates(postData.value.text)) {
            type.value = 'map'
            if (isArea){
              postData.value.text = postData.value.text.slice(0,-4)
            }
          }
        }
      }catch(err){
        console.log(err)
      }
    }
    
    loadPost()
    
    
    const HandleShowReplies = () => {
      showReplies.value = !showReplies.value
    }



    return{
      postData, type, showReplies, HandleShowReplies, replies, id
    }
  }
};
</script>

