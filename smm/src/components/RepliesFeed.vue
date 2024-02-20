<template>
  <div class="ml-5 mt-50">
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
  props: {
    repliesTo: String
  },
  setup(props) {
    const posts = ref([]);
    const loadReplies = async () => {
      if (props.repliesTo) {
        try {
          const response = await fetch(apiPostsURL + `/${props.repliesTo}/replies`);
          if (response.ok) {
            const data = await response.json();
            posts.value = data;
          } else {
            console.error('Errore durante il recupero delle risposte:', response.status);
          }
        } catch (err) {
          console.error('Errore durante il recupero delle risposte:', err);
        }
      } else {
        console.error('Prop "repliesTo" non definito o vuoto');
      }
    };

    loadReplies();

    return { posts };
  }
};
</script>
