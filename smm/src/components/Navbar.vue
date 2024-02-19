<template>
  <nav class="bg-emerald-700 p-4 flex justify-between items-center shadow-lg fixed top-0 w-full">
    <div class="flex items-center">
      <img src="../assets/Squealer.png" alt="Logo" class="mr-2 h-10 w-auto">
      <router-link to="/" class="text-white text-2xl  font-bold">Squealer For SMMs</router-link>
    </div>
    <div v-if="isUserLoggedIn">
      <button to="/login" class="text-white mr-4 px-4 py-2 border border-white rounded-full hover:bg-white hover:text-emerald-700 focus:outline-none focus:bg-white focus:text-text-emerald-700 font-bold" @click="logout">Logout</button>
    </div>
    <div v-else>
      <router-link to="/login" class="text-white mr-4 px-4 py-2 border border-white rounded-full hover:bg-white hover:text-emerald-700 focus:outline-none focus:bg-white focus:text-text-emerald-700 font-bold" >Login</router-link>
      <router-link to="/register" class="text-white px-4 py-2 border border-white rounded-full hover:bg-white hover:text-emerald-700 focus:outline-none focus:bg-white focus:text-emerald-700 font-bold">Register</router-link>
    </div>
  </nav>        
</template>
<script>
export default {      
  name: 'Navbar',
  computed: {
    isUserLoggedIn() {
      return localStorage.getItem('isUserLoggedIn') === 'true';
    },
  },
  methods: {
    logout(){
      console.log('logout')
      localStorage.clear()
      this.$router.push({ name: 'home' });
      window.location.reload();
    }
  }

};
</script>


