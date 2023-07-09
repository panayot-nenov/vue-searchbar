<script lang="ts">
interface ListProps {
  text: string
  id: string | number
}

interface SearchBarListProps {
  searchTerm: string
  items: ListProps[] | null
  selectedItemIndex: number
  inputRef: HTMLInputElement
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventListener } from '../composables/useEventListener'

const emit = defineEmits(['click:listItem', 'click:outside'])
const props = defineProps<SearchBarListProps>()
const searchList = ref()

const isOutsideClick = (evt: MouseEvent) => {
  return listVisible.value && !searchList.value.contains(evt.target) && !isInputClick(evt)
}

const isInputClick = (evt: MouseEvent) => evt.target === props.inputRef

const outsideClickListner = (evt: MouseEvent) => {
  if (isOutsideClick(evt)) {
    emit('click:outside')
  }
}

useEventListener(window, [{ event: 'click', cb: outsideClickListner }])

const listVisible = computed(() => !!props.items?.length)

const onListItemSelect = (evt: any, item: any) => {
  emit('click:listItem', item)
}
const getIndexOfSearchTerm = (text: string) => {
  return text.toLocaleLowerCase().indexOf(props.searchTerm.toLocaleLowerCase())
}
const substrText = (text: string, fromIndex: number, toIndex: number) => {
  return text.substring(fromIndex, toIndex)
}
</script>

<template>
  <ul class="search-bar__list" ref="searchList">
    <template v-if="listVisible" v-for="(item, idx) in props.items" :key="idx">
      <li
        v-if="getIndexOfSearchTerm(item.text) === 0"
        :class="{ 'search-bar__list-item--selected': selectedItemIndex === idx }"
        @click="onListItemSelect($event, item)"
      >
        <template v-if="getIndexOfSearchTerm(item.text) === 0">
          <span class="search-bar__list-mask">{{
            substrText(item.text, 0, searchTerm.length)
          }}</span>
          <span>{{ substrText(item.text, searchTerm.length, item.text.length) }} </span>
        </template>
        <template v-if="getIndexOfSearchTerm(item.text) > 0">
          <span>{{ substrText(item.text, 0, getIndexOfSearchTerm(item.text)) }}</span>
          <span class="search-bar__list-mask">{{
            substrText(item.text, getIndexOfSearchTerm(item.text), searchTerm.length)
          }}</span>

          <span>{{
            substrText(
              item.text,
              getIndexOfSearchTerm(item.text) + searchTerm.length,
              item.text.length
            )
          }}</span>
        </template>
      </li>
    </template>
  </ul>
</template>
<style>
.search-bar__list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-radius: 4px;
  /* optional change width prop to 100% */
  width: auto;
  cursor: pointer;
  position: absolute;
  z-index: 1000;
}
.search-bar__list-item--selected {
  background-color: #007ac2 !important;
  color: white;
}
.search-bar__list > li {
  font-family: system-ui, sans-serif;
  font-size: 20px;
  border: 1px solid #c4c1c1;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
  background-color: #f6f9fc;
}
.search-bar__list > li:last-child {
  border-bottom-left-radius: 0.35rem;
  border-bottom-right-radius: 0.35rem;
}

.search-bar__list > li:hover {
  background-color: #007ac2;
  color: white;
}
.search-bar__list-mask {
  color: rgba(0, 0, 0, 0.38);
}
</style>
