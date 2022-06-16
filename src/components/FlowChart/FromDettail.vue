<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-14 17:13:38
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-16 15:11:28
-->
<script lang="ts" setup>
defineProps(['detailData'])
</script>
<template>
  <div class="form-detail">
    <div class="title">修改属性</div>
    <div class="content">
      <el-form label-width="auto">
        <el-form-item
          v-for="item of detailData"
          :label="item.title"
          :prop="item.key"
        >
          <template v-if="item.key !== 'color'">
            <el-input v-model="item.value" />
          </template>
          <template v-else>
            <div class="demo-color-block">
              <span class="demonstration">{{ item.title }}</span>
              <el-color-picker v-model="item.value" />
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="less">
.form-detail {
  font-size: 12px;
  width: 200px;
  height: 100%;
  background: #f5f5f5;
  .title {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #e9e9e9;
  }
  .content {
    height: calc(100% - 30px);
    overflow-y: auto;
    padding: 10px;
    text-align: left;
  }
}
</style>
