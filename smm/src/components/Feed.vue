<template>
  <div>
    <Post v-for="post in posts" :key="post._id" :post="post"/> 
    <button v-if="currentPage < totalPages" @click="loadMorePosts">Carica più post</button>
  </div>
</template>

<script>
import Post from './Post.vue';

export default {
  components: {
    Post,
  },
  data() {
    return {
      posts: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
  methods: {
    async loadPosts(page) {
      const limit = 10; 
      const apiUrl = `http://localhost:3001/posts/test?page=${page}&limit=${limit}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        this.posts = this.posts.concat(data.posts);
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        console.log(this.posts)
      } catch (error) {
        console.error('Errore durante il recupero dei post:', error);
      }
    },
    loadMorePosts() {
      this.loadPosts(this.currentPage + 1);
    },
  },
  mounted() {
    this.loadPosts(this.currentPage);
  },
};
</script>
