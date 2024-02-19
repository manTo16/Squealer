<template>
  <div class="fixed right-0 p-4 m-3 h-full mt-20 w-1/4 rounded-md bg-white shadow-md flex flex-col text-center">
    <h2 class="text-lg  mb-4">Dettagli Vip Selezionato</h2>
    <div>
      <img :src="vipdata.userImage" alt="Immagine VIP" class="w-32 mx-auto mb-4">
      <div class="flex items-center justify-center">
        <div class="font-bold text-3xl">{{ vipdata.displayName }}</div>
        <IconPro v-if="vipdata.pro" />
        <IconVerified v-if="vipdata.verified" />
      </div>
      <div class="font-bold text-base">@{{ vipdata.username }}</div>
      <div class="text-sm text-slate-500 mb-5">{{ vipdata.email }}</div>
      <div class="mb-2 font-semibold "> Caratteri rimanenti </div>
      <div  class="grid grid-cols-3 grid-rows-2 gap-4 bg-green-200 rounded-md">
        <div>Oggi</div>
        <div>Questa settimana</div>
        <div>Questo mese</div>
        <div>{{ vipdata.dailyChar }}</div>
        <div>{{ vipdata.weeklyChar }}</div>
        <div>{{ vipdata.monthlyChar }}</div>
      </div>
      <button class="bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 my-8" @click="handleShopRequest">
        Compra caratteri per {{ vipdata.username }}
      </button>
      <button class="bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
        Posta per conto di {{ vipdata.username }}
      </button>
    </div>
  </div>
</template>

<script>
import IconPro from './svg/ProSvg';
import IconVerified from './svg/VerifiedSvg';

export default {
  components:{
    IconPro,
    IconVerified
  },
  props: {
    vipdata: Object, 
  },
  methods:{
    handleShopRequest(){
      this.$router.push({ name: 'shop' });
    }
  }
};
</script>

