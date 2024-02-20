<template>
  <div>
    <l-map :zoom="13" :center="center" style="height: 300px">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></l-tile-layer>

      <l-marker :lat-lng="center"></l-marker>

      <l-polyline
        v-if="crd.length > 1"
        :lat-lngs="crd"
        :options="{ color: 'blue' }"
      ></l-polyline>

      <l-circle
        v-if="isArea"
        :lat-lng="crd[0]"
        :radius="400"
        :options="{ color: 'red' }"
      ></l-circle>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPolyline, LCircle } from "@vue-leaflet/vue-leaflet";

export default {
  components: { LMap, LTileLayer, LMarker, LPolyline, LCircle },
  props: {
    coordinates: String,
    isArea: Boolean,
  },
  computed: {
    crd() {
      return this.coordinatesArrayToLatLngTuples(this.coordinates);
    },
    center() {
      return this.crd.length ? this.crd[this.crd.length - 1] : latLng(0, 0);
    },
  },
  methods: {
    coordinatesArrayToLatLngTuples(coordinates) {
      const coordinatesArray = this.splitStringByPlus(coordinates);
      return coordinatesArray.map((coordinates) => {
        const parts = coordinates.split(",");
        return latLng(parseFloat(parts[0]), parseFloat(parts[1]));
      });
    },
    splitStringByPlus(input) {
      return input.split("+");
    },
  },
};
</script>