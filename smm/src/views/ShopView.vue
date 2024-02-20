<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-md shadow-md w-full max-w-md">
      <button @click="goBack" class="border border-black rounded-full px-4 py-2 mb-6">Torna Indietro</button>
      <div class="text-2xl font-bold mb-2">Compra caratteri extra per il tuo vip!</div>
      <div>Pacchetto  SMM:</div>
      <ul>
        <li>+150 caratteri giornalieri</li>
        <li>+500 caratteri settimanali</li>
        <li>+1000 caratteri mensili</li>
      </ul>
      <div class="font-bold">Tutto per €19,99</div>
      <button @click="handleBuy(username)" class="mt-4 w-full bg-emerald-700 text-white py-2 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600">Compra per {{ username }}</button>
    </div>
  </div>
</template>

<script>

import { apiUsersURL } from '@/URLs'
export default {
  setup(){
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    if (!isUserLoggedIn) router.push('login')
    const username = JSON.parse(localStorage.getItem('selected-vip')).username || ''
    let vipDailyCh = JSON.parse(localStorage.getItem('selected-vip')).dailyChar || 0
    let vipWeeklyCh = JSON.parse(localStorage.getItem('selected-vip')).weeklyChar || 0
    let vipMonthlyCh = JSON.parse(localStorage.getItem('selected-vip')).monthlyChar || 0
    const handleBuy = async (username) =>{
      vipDailyCh+=150
      vipWeeklyCh+=500
      vipMonthlyCh+=1000
      try {
        const response = await fetch(apiUsersURL+'/'+username+'/characters',{
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            daily: 150, weekly: 500, monthly: 1000
          })
        })
        if (response.ok) {
          alert('purchase successful')
        } else {
          console.error('Error in purchase:', response.statusText);
        }
      }catch(err){
        console.log(err)
      }
    }
    return {username, handleBuy}
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style>

</style>