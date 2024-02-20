<template>
  <div>
    <l-map
      style="height: 400px;"
      :center="center"
      :zoom="zoom"
      @click="handleMapClick"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="selectedPosition" v-if="selectedPosition"></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors',
      center: [44.5, 11.33], 
      zoom: 12, 
      selectedPosition: null, 
    };
  },
  methods: {
    handleMapClick(event) {

      const lat = event.latlng.lat;
      const lng = event.latlng.lng;

      this.selectedPosition = [lat, lng];
      // evento con le coordinate della posizione selezionata
      this.$emit("position-selected", { lat, lng });
    },
  },
};
</script>
