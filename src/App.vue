<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import { geoSearch, userSearch, todoSearch } from './services/services'

const searchTerm = ref('')
const searchResponse = ref('')

const params = ref({
  placeholder: 'Geo Search',
  searchService: geoSearch
})

const setService = (serviceName: string) => {
  searchTerm.value = ''
  searchResponse.value = ''

  switch (serviceName) {
    case 'GEO':
      params.value = { placeholder: 'Geo Search', searchService: geoSearch }
      break
    case 'USER':
      params.value = { placeholder: 'User Search', searchService: userSearch }
      break
    case 'TODO': {
      params.value = { placeholder: 'Todo Search', searchService: todoSearch }
      break
    }
  }
}
</script>

<template>
  <header>
    <h1>Playground for vue-searchbar</h1>
    <p><a href="">vue-searchbar</a> is a Vue.js 3 search input component.</p>
  </header>
  <br />
  <div class="examples">
    <h1>Examples</h1>
    <p>Choose your search store...</p>

    <a href="#" @click.prevent="setService('GEO')"> OSM Search </a>
    <a href="#" @click.prevent="setService('USER')"> User Search </a>
    <a href="#" @click.prevent="setService('TODO')"> Todo Search </a>
  </div>
  <div class="searchbar-wrapper">
    <SearchBar
      v-bind="params"
      v-model:searchTerm="searchTerm"
      v-model:searchResponse="searchResponse"
    >
    </SearchBar>
  </div>

  <div>
    <pre>{{ searchResponse }}</pre>
  </div>
</template>

<style scoped>
.examples > a {
  margin-right: 20px;
  color: #1ea7fd;
}

.searchbar-wrapper {
  display: flex;
  justify-content: start;
  margin: 50px 0 50px 0;
}
</style>
