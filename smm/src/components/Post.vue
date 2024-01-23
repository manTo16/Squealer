<template>
  <div class="bg-white p-4 mb-4 rounded-md shadow-md">
    <div class="flex items-center">
      <!-- tutto ancora da fare
      <img :src="" alt="Profile Image" class="w-10 h-10 rounded-full mr-4"-->

      <!-- Contenuto del tweet -->
      <div>
        <h3 class="font-semibold">{{ post.username }}</h3>
        <p>{{ post.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

