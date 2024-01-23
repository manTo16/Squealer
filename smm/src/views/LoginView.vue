<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-md shadow-md w-full max-w-md">
      <img src="../assets/Squealer.png" alt="Logo" class="h-20 mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Login to Squealer For SMMs</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input type="email" id="email" v-model="email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="type email here..." required>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input type="password" id="password" v-model="password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="type password here..." required>
        </div>
        <button type="submit" class="mt-4 w-full bg-emerald-700 text-white py-2 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600">Login</button>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      // logica da fare
    },
  },
};
</script>

