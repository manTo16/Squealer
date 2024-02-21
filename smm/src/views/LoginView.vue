<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-md shadow-md w-full max-w-md">
      <img src="../assets/Squealer.png" alt="Logo" class="h-20 mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">Login to Squealer For SMMs</h2>
      <p v-if="userErr" class="text-red-500">Utente non esistente</p>
      <p v-if="passwordErr" class="text-red-500">Password errata </p>
      <p v-if="error" class="text-red-500">Errore </p>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 text-sm font-semibold mb-2">Username</label>
          <input type="text" id="username" v-model="username" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="Scrivi username qui..." required>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input type="password" id="password" v-model="password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500" placeholder="Scrivi password qui..." required>
        </div>
        <button type="submit" class="mt-4 w-full bg-emerald-700 text-white py-2 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600">Login</button>
      </form>
      <p class="text-center mt-3">oppure</p>
      <button @click="handleRedirect" type="submit" class="mt-4 w-full bg-emerald-700 text-white py-2 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600">Registrati come SMM</button>
    </div>
  </div>
</template>


<script>
import { apiAuthURL } from '@/URLs';
import getLoggedUserData from '@/composables/getLoggedUserData.js';
import router from '@/router';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      userErr: false,
      passwordErr: false,
      error: false,
    };
  },
  methods: {
    async handleLogin() {
      this.userErr = false
      this.passwordErr = false
      this.error = false
      try {
        const response = await fetch(apiAuthURL+'/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });
        if (response.ok) {
          const data = await response.json();
          const token = data.token
          localStorage.setItem('token', token)
          localStorage.setItem('isUserLoggedIn', 'true')
          await getLoggedUserData(this.username);
          this.$router.push({ name: 'home' });
        } else  {
          const errorMessage = await response.text()
          const msg = JSON.parse(errorMessage).message
          if (response.status === 400 && msg === "User not found") {
            this.userErr = true
          } else if (response.status === 401 && msg === "Invalid credentials") {
            this.passwordErr = true
          } else {
            this.error = true
          }
        }
      } catch (error) {
        console.error('Login request error:', error);
        this.error = true
      }
    },
    handleRedirect(){
      router.push('register')
    }
  },
};
</script>

