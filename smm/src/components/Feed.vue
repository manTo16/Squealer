<template>
  <div class="mx-10 mt-50">
    <Suspense>
      <template #default>
        <Post v-for="post in posts" :key="post" :postId="post"/> 
      </template>
      <template #fallback>
        <!-- Fallback content while the component is loading -->
        <div>Caricamento in corso...</div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import Post from './Post.vue';
import { apiPostsURL } from '@/URLs';
import { defineAsyncComponent, ref } from 'vue';


export default {
  components: {
    Post: defineAsyncComponent(() => import('./Post.vue'))
  },
  props:{
    query: String,
    repliesTo: String
  },
  data() {
    return {
    };
  },
  setup(props){
    const username = JSON.parse(localStorage.getItem('selected-vip')).username || ''
    const posts = ref([])
    console.log(props.query)
    if(props.query){
      const loadUserPosts = async () => {
        try {
          const response = await fetch(apiPostsURL+`/user/sortBy/${username}/${props.query}`);
          if (response.ok) {
            const data = await response.json()
            posts.value = data
          }
        } catch (err) {
          console.error('Errore durante il recupero dei post utente:', err);
        }
      }
      loadUserPosts()
    }
    else{
      const loadReply = async () => {
        try{
          const response = await fetch(apiPostsURL+`/${props.repliesTo}/replies`);
          if (response.ok) {
            const data = await response.json()
            posts.value = data
          }
        }catch(err){
          console.log(err)
        }
      }
      loadReply()
    }
    return{
    posts
  }
    
  }
};
</script>
