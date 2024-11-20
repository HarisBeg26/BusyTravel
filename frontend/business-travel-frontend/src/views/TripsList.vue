<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Your Trips</h1>
    <button @click="goToAddTrip" class="bg-blue-500 text-white px-5 py-2 rounded">
      Add new Trip
    </button>
    <ul class="mt-4">
      <li
        v-for="trip in trips":key="trip.id" class="bg-gray-100 p-4 mb-2 rounded shadow">
        <h2 class="font-bold">{{trip.destination}}</h2>
        <p>{{trip.description}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {ref, onMounted} from "vue";
import {fetchTrips} from "../services/api";

export default{
  setup(){
    const trips=ref([]);

    const loadTrips = async() => {
      trips.value = await fetchTrips();
    };

    onMounted(loadTrips);

    const goToAddTrip = () => {
      window.location.href="/trips/add;"
    };

    return {trips, goToAddTrip};
  },
};
</script>


<style scoped>

</style>