<template>
  <div class="item-box" @click="goToDetail">
    <div class="item-content">
      <div class="image-container">
        <img :src="imageUrl" :alt="itemName" class="item-image">
      </div>
      <div class="text-container">
        <p class="item-name">{{ itemName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
  imageUrl: string
  itemName: string
  id: string
}>()

const goToDetail = () => {
  router.push(`/items/${props.id}`)
}
</script>

<style scoped>
.item-box {
  min-width: 345px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  height: 100px; /* 박스의 높이 설정 */
}

.item-content {
  display: flex;
  height: 100%;
}

.image-container {
  width: 100px; /* 3:1 비율을 위한 이미지 영역 */
  height: 100%;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-container {
  flex: 1;
  padding: 10px;
  display: flex;
  align-items: center;
}

.item-name {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}
</style>