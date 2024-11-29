<template>
    <div class="container">
    <div class="wishlist-header">
      <div class="profile">
        <div class="profile-image" @click="toggleScale" :style="{ transform: `scale(${scale})` }">
          <img src="../assets/og.png" alt="프로필" style="display:none;"> 
          <img src="../assets/profile.png" alt="프로필">
        </div>
        <h1 class="title"><strong>안유엘</strong>님의 위시리스트</h1>
        <p class="text">선물을 <strong>'찜'</strong> 해주세요 ~</p>
      </div>
    </div>
    <Item
      v-for="(item, index) in items"
      :key="index"
      :imageUrl="item.imageUrl"
      :itemName="item.imageName"
      :id="item.id"
      :price="item.price"
      :name="item.name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Item from '../components/ItemBox.vue'
import { PROXY } from '../../config';


interface Item {
  id: string;
  imageUrl: string;
  imageName: string;
  price: number;
  name?: string;
  link?: string;
}

const items = ref<Item[]>([]);
const scale = ref<number>(1);

const fetchItems = async () => {
  try {
    const response = await fetch(`${PROXY}/api/items`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      items.value = data;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

const toggleScale = () => {
  scale.value = scale.value === 1 ? 3 : 1; // Toggle between 1 and 2
};

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.container {
  max-width: 345px;
  margin: 0 auto;
  padding-bottom: 50px;
  /* padding: 20px; */
  box-sizing: border-box;
}

.wishlist-header {
  margin-bottom: 20px;
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-image {
  position: relative;
  z-index: 9999;
  margin-top: 30px;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(150,150,150,.9);
  background:#eaeaea;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 0px;
  transform:scale(1.0)
}

.profile-image img {
  width: 60px;
  transform: translate(20px, 5px);
  /* height: 130px; */
}

.title {
  font-size: 24px;
  font-weight: 400;
}

.text {
  font-size: 18px;
  font-weight: 200;
  color: salmon;
  position: absolute;
  right: 70px;
  bottom: 0px;
}
</style>