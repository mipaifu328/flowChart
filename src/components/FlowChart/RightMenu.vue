<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-17 09:41:24
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-17 11:12:53
-->
<script setup lang="ts">
import { computed, onMounted } from 'vue'

const { visible, position } = defineProps<{
  visible: boolean
  position: { x: number; y: number }
}>()
defineEmits(['deleteNode'])

const style = computed(() => {
  return {
    display: visible ? 'block' : 'none',
    left: `${position.x + 180}px`,
    top: `${position.y}px`,
  }
})
</script>

<template>
  <ul class="menu-list" :style="style">
    <li @click="$emit('deleteNode')">删除节点</li>
  </ul>
</template>

<style scoped lang="less">
.menu-list {
  position: absolute;
  z-index: 9999;
  display: none;
  max-height: 320px;
  padding: 0;
  overflow-y: scroll;
  font-size: 12px;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 20%) 0px 1px 6px;
  li {
    display: flex;
    place-content: center space-between;
    align-items: center;
    width: 100%;
    height: 28px;
    padding: 0px 12px;
    color: rgb(89, 89, 89);
    text-align: left;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    cursor: pointer;
  }
}
</style>
