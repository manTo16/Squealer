<!-- UserDetailsCard.vue -->
<template>
  <div class="fixed right-0 p-4 m-3 rounded-md bg-white shadow-md">
    <h2 class="text-lg  mb-4"> Dettagli Vip</h2>
    <div>
      <p><strong>Nome:</strong> </p>
      <p><strong>Email:</strong> </p>
      <!-- Aggiungi altri dettagli utente secondo necessità -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object, // Passa l'oggetto utente come prop
  },
};
</script>

