<template>
    <div class="container">
    <div class="wishlist-header">
      <div class="profile">
        <div class="profile-image">
          <img src="../assets/profile.png" alt="프로필">
        </div>
        <h1 class="title">안유엘님의 위시리스트</h1>
      </div>
    </div>
    <Item
      v-for="(item, index) in items"
      :key="index"
      :imageUrl="item.imageUrl"
      :itemName="item.imageName"
      :id="item.id"
      :price="item.price"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Item from '../components/ItemBox.vue'


interface Item {
  id: string;
  imageUrl: string;
  imageName: string;
  price: number;
  name?: string;
  link?: string;
}

const items = ref<Item[]>([]);

const fetchItems = async () => {
  try {
    const PROXY = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/proxy';
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-image {
  margin-top: 30px;
  width: auto;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.profile-image img {
  /* width: 100px; */
  height: 100%;
}


.title {
  font-size: 18px;
  font-weight: bold;
}
</style>