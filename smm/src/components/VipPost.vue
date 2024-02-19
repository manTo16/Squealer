<template>
  <div class="bg-white p-4 rounded-lg shadow-md mt-16 w-2/5 ml-10">
    <div class="my-2 text-slate-500">Attenzione: se i destinatari non iniziano con @ (per gli utenti) o $ (per i canali), non verranno considerati</div>
    <select v-model="postMode" class="border border-gray-300 rounded-md px-2 py-1 mb-4">
      <option value="text">Testo</option>
      <option value="image">Immagine</option>
      <option value="location">Geolocazione</option>
    </select>
    <div v-if="postMode === 'text'">
      <textarea v-model="postText" @input="updateCharacterCount" class="w-full h-32 border border-gray-300 rounded-md resize-none p-2 mb-4" placeholder="Scrivi il tuo post..."></textarea>
    </div>
    <div v-else-if="postMode === 'image'" class="mb-4">
      <input type="file" @change="handleImageUpload" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-emerald-50 file:text-emerald-700
      hover:file:bg-emerald-100">
    </div>
    <div v-else-if="postMode === 'location'">
      <!-- Campo per la geolocazione -->
      <!-- Sostituisci questo div con il componente per la geolocazione -->
      <div class="mb-4">Campo per la geolocazione</div>
    </div>
    <div class="flex flex-col mb-4">
      <div v-for="(recipient, index) in recipients" :key="index" class="flex items-center mb-2">
        <input v-model="recipients[index]" type="text" class="border border-gray-300 rounded-md px-2 py-1 mr-2" placeholder="Destinatario">
        <button @click="removeRecipient(index)" class="text-red-500 focus:outline-none">-</button>
      </div>
      <button @click="addRecipient" class="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none">Aggiungi destinatario</button>
    </div>
    <div class="flex justify-between mb-4">
      <span class="text-gray-500">{{ characterCount }} / 280 caratteri</span>
      <button @click="postTweet" :disabled="!postText.trim()" class="bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">Invia Post per {{ username }}</button>
    </div>
  </div>
</template>

<script>
import { apiPostsURL } from '@/URLs';
import convertToBase64 from '@/composables/convertToBase64';

export default {
  data() {
    return {
      postMode: 'text', // Modalità predefinita: testo
      postText: '',
      characterCount: 0,
      recipients: [''] 
    };
  },
  methods: {
    updateCharacterCount() {
      this.characterCount = this.postText.length;
    },
    addRecipient() {
      this.recipients.push('');
    },
    removeRecipient(index) {
      this.recipients.splice(index, 1);
    },
    async postTweet() {
      try{
        const response = await fetch(apiPostsURL+'/smm',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.userToken}` 
          },
          body:JSON.stringify({username: this.username, text: this.postText, receivers: this.recipients.filter(recipient => recipient.trim() !== ''), smmUsername: this.smmUsername})
        })
        //debug
        const postData = {
          mode: this.postMode,
          text: this.postText,
          recipients: this.recipients.filter(recipient => recipient.trim() !== '') // Rimuove i destinatari vuoti
        };
        console.log("Post inviato:", postData);
      }catch(err){
        console.log(err)
      }


      this.postText = '';
      this.characterCount = 0;
      this.recipients = [''];
    },
     async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      try{
        const imgBase64 = await convertToBase64(file)
        this.postText = imgBase64
      }
      catch(err){
        console.error(err)
      }
    }
  },
  setup(){
    const username = JSON.parse(localStorage.getItem('selected-vip')).username || ''
    const smmUsername = JSON.parse(localStorage.getItem('user')).username || ''
    const userToken = localStorage.getItem('token') || ''
    return {username, userToken,smmUsername}
  }
}
</script>
