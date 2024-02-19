<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-md shadow-md w-full max-w-md">
      <img src="../assets/Squealer.png" alt="Logo" class="h-20 mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center ">Register to Squealer For SMMs</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input type="email" id="email" v-model="email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="type email here..." required>
        </div>
        <div class="mb-4">
          <label for="username" class="block text-gray-700 text-sm font-semibold mb-2">Username</label>
          <input type="text" id="username" v-model="username" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="choose a username..." required>
        </div>
        <div class="mb-4">
          <label for="displayName" class="block text-gray-700 text-sm font-semibold mb-2">Displayed Name</label>
          <input type="text" id="displayName" v-model="displayName" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="choose a displayed name..." required>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input type="password" id="password" v-model="password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="create a password..." required>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
          <input type="password" id="password" v-model="confirmPassword" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="type password again..." required>
        </div>
        <button type="submit" class="mt-4 w-full bg-emerald-700 text-white py-2 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600">Register as SMM</button>
      </form>
    </div>
  </div>
</template>


<script>
import { apiAuthURL } from '@/URLs';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        if (this.password!==this.confirmPassword){
          alert('Passwords are different')
          return
        }
        const response = await fetch(apiAuthURL+'/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.username, password: this.password, email: this.email, displayName: this.displayName, smm: true}),
        });
        console.log(response)
        if (response.ok) {
          alert('registration successful')
          this.$router.push({ name: 'login' });
        } else {
          console.error('Registration error:', response.statusText);
        }
      } catch (error) {
        console.error('Registration request error:', error);
      }
    },
  },
};
</script>

