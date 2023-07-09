<script lang="ts">
import type { SearchService } from '../types/SearchBar'

interface SearchBarProperties {
  placeholder?: string
  searchTerm: string
  searchService: SearchService
  searchResponse: string
}
</script>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import debounce from 'lodash/debounce'
import SearchBarList from './SearchBarList.vue'
import { useSearch } from '../composables/useSearch'

const props = defineProps<SearchBarProperties>()
const emit = defineEmits(['update:searchTerm', 'update:searchResponse'])

const selectedItem = ref<string>('')
const selectedItemIndex = ref<number>(-1)
const input = ref()

onMounted(() => {
  input.value.focus()
})
onBeforeUnmount(() => {
  debouncedWatch.cancel()
})

const inputText = computed({
  get() {
    return props.searchTerm
  },
  set(value) {
    emit('update:searchTerm', value.length > 20 ? `${value.substring(0, 20)} ...` : value)
  }
})

const {
  result: suggestions,
  loading: loadingList,
  error: searchError,
  query: search
} = useSearch((search) => props.searchService.search(search))

const { result: suggestion, query: find } = useSearch((search) => props.searchService.find(search))

const debouncedWatch = debounce(async () => {
  if (!inputText.value || selectedItem.value) {
    suggestions.value = []
    return
  }
  search(inputText.value)
}, 500)

watch(inputText, debouncedWatch)

const clearInput = () => {
  suggestions.value = []
  inputText.value = ''
  selectedItem.value = ''
  input.value.focus()
  emit('update:searchResponse', '')
}
const onListItemClick = async ({ text, id }: { text: string; id: string | number }) => {
  suggestions.value = []
  inputText.value = text
  selectedItem.value = text
  input.value.focus()
  await find(`${id}`)
  emit('update:searchResponse', JSON.stringify(suggestion.value, null, 2))
}
const onChange = () => {
  selectedItemIndex.value = -1
}

const onKeyDown = (evt: KeyboardEvent) => {
  selectedItem.value = ''
  if (!suggestions.value?.length) {
    return
  }
  const len = suggestions.value?.length - 1
  const keyCode = evt.key
  switch (keyCode) {
    case 'ArrowDown': {
      if (selectedItemIndex.value < len) {
        selectedItemIndex.value += 1 % len
      } else {
        selectedItemIndex.value %= len
      }
      break
    }
    case 'ArrowUp': {
      if (selectedItemIndex.value !== 0) {
        selectedItemIndex.value -= 1
      }
      break
    }
    case 'Enter': {
      onListItemClick(suggestions.value[selectedItemIndex.value])
      break
    }
    case 'Escape': {
      clearInput()
      break
    }
  }
}
</script>
<template>
  <div class="search-bar">
    <input
      type="text"
      class="search-bar__input"
      v-model="inputText"
      ref="input"
      @keydown="onKeyDown"
      @input="onChange"
      :placeholder="props.placeholder"
    />

    <slot name="prepend-icon">
      <font-awesome-icon
        :icon="['fas', 'magnifying-glass']"
        class="search-bar-icon search-bar-icon--prepend"
        size="xl"
      />
    </slot>
    <slot name="append-icon">
      <font-awesome-icon
        v-show="loadingList"
        :icon="['fas', 'spinner']"
        class="search-bar-icon search-bar-icon--append"
        spin
        size="xl"
      />
    </slot>
    <font-awesome-icon
      v-show="!loadingList && inputText.length"
      :icon="['fas', 'xmark']"
      class="search-bar-icon search-bar-icon--append"
      size="xl"
      @click="clearInput"
    />
    <SearchBarList
      @click:listItem="onListItemClick"
      @click:outside="clearInput"
      :searchTerm="inputText"
      :selectedItemIndex="selectedItemIndex"
      :items="suggestions"
      :inputRef="input"
    ></SearchBarList>
    <div v-if="searchError" class="search-error">{{ searchError }}</div>
  </div>
</template>

<style>
.search-bar {
  min-width: 400px;
}
.search-bar > svg {
  position: absolute;
}
.search-bar__input {
  width: 100%;
  line-height: 40px;
  font-size: 20px;
  text-indent: 45px;
  color: #333;
  background-color: #f6f9fc;
  border: 1px solid #f6f9fc;
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out;
}
.search-error {
  color: red;
}
.search-bar__input:focus {
  outline: none !important;
  border: 1px solid #1ea7fd;
}
.search-bar-icon {
  font-size: 22px;
  top: 0px;
  padding: 13px;
  cursor: pointer;
}
.search-bar-icon--prepend {
  left: 0;
}
.search-bar-icon--append {
  right: 0;
}
</style>
