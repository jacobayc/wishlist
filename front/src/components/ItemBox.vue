<template>
  <div class="item-box" @click="goToDetail">
    <div class="item-content">
      <div class="image-container">
        <img :src="imageUrl" :alt="itemName" class="item-image">
      </div>
      <div class="text-container">
        <p class="item-name">{{ itemName }}</p>
        <div v-if="name" class="badge">찜 완료!</div>
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
  name?: string
}>()

const goToDetail = () => {
  router.push(`/items/${props.id}`)
}
</script>

<style scoped>
.item-box {
  min-width: 345px;
  border: 1px solid #e0a3b2;
  border-radius: 12px;
  /* overflow: hidden; */
  margin-bottom: 20px;
  height: 100px; /* 박스의 높이 설정 */
  box-shadow: 2px 2px 10px rgba(255,255,255,0.3);
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
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.text-container {
  position: relative;
  flex: 1;
  padding: 10px;
  display: flex;
  align-items: center;
}

.item-name {
  margin: 0;
  font-size: 15px;
  letter-spacing: -1px;
  line-height: 1.4;
  word-break: break-word;
}

.badge {
  padding: 2px 5px;
  text-align: center;
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  position: absolute;
  right: -20px;
  top:-5px;
  background: linear-gradient(to right, #F38367, #800080);
}
</style>