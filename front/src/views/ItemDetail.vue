<template>
  <div class="detail-container" v-if="item" :class="{ 'fade-in': showContent }">
    <div class="detail-image">
      <img :src="item.imageUrl" :alt="item.imageName">
    </div>
    <div class="detail-content">
      <h1 class="detail-title">{{ item.imageName }}</h1>
      <div class="detail-info">
        <div class="price-container">
          <p class="price">약 {{ item.price.toLocaleString() }}원</p>
          <div v-if="!item.name" class="wish-button" @click="showNameInput">
            찜하기
          </div>
          <div v-else class="wished-container">
              <div class="wished-by"><span>{{ item.name }}</span>님이 찜!</div>
              <button class="cancel-wish-button" @click="cancelWish">찜 취소하기</button>
          </div>
        </div>
        <p class="description">
          [추천 구매링크]<br/>
          <a :href="item.link">{{ item.link }}</a>
        </p>
      </div>
    </div>
    
    <!-- 이름 입력 모달 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <input 
          ref="nameInput"
          v-model="inputName" 
          placeholder="이름을 입력하세요"
          @keyup.enter="saveName"
        >
        <div class="modal-buttons">
          <button @click="saveName">확인</button>
          <button @click="showModal = false">취소</button>
        </div>
      </div>
    </div>
    <div class="exit-button-container">
      <button class="exit-button" @click="goToHome">뒤로가기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick  } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import { PROXY } from '../../config';

const showContent = ref(false)
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const inputName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

interface Item {
  imageUrl: string;
  imageName: string;
  id: number;
  price: number;
  name?: string;
  link?: string;
}
const item = ref<Item | null>(null);

// showNameInput 함수 수정
const showNameInput = async () => {
  showModal.value = true
  await nextTick()
  nameInput.value?.focus()
}

const goToHome = () => {
  router.push('/')
}

const saveName = async () => {
  if (!inputName.value) return
  
  try {
    // const PROXY = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/proxy';
    const response = await fetch(`${PROXY}/api/items/${route.params.id}/name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ name: inputName.value })
    })
    
    if (response.ok) {
      item.value && (item.value.name = inputName.value);
      showModal.value = false
      inputName.value = ''
    }
  } catch (error) {
    console.error('Error saving name:', error)
  }
}

const cancelWish = async () => {
  const userConfirmed = confirm("정말 취소하시겠습니까?\n기존에 찜한 내용이 삭제됩니다.");

  if (!userConfirmed) {
    return;
  }

  try {
    // const PROXY = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/proxy';
    const response = await fetch(`${PROXY}/api/items/${route.params.id}/name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ name: '' })
    })
    
    if (response.ok) {
      item.value && (item.value.name = '');
    }
  } catch (error) {
    console.error('Error canceling wish:', error)
  }
}

const fetchItem = async () => {
  try {
    // const PROXY = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/proxy';
    const response = await fetch(`${PROXY}/api/items/${route.params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    if (response.ok) {
      const data = await response.json();
      item.value = data;
      return;
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
}

onMounted(() => {
  fetchItem()
  // 컴포넌트 마운트 직후 애니메이션 시작
  setTimeout(() => {
    showContent.value = true
  }, 100)
})
</script>

<style scoped>

.detail-container {
  background: #2c2c2c;
  border-radius: 10px;
  min-width: 345px;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(100px);
  transition: all 0.5s ease-out;
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.detail-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  opacity: 0;
  transform: rotateY(90deg);
  animation: pageFlip .5s ease-out forwards;
}
@keyframes pageFlip {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  padding: 20px 0;
}

.detail-title {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.4;
  animation: pageFlip 1s ease-out forwards;
}

.detail-info {
  animation: pageFlip 1.5s ease-out forwards;
  padding: 16px;
  border-radius: 8px;
  background: #f8f8f8;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price {
  color: #000;
  font-size: 20px;
  font-weight: bold;
}

.wish-button {
  padding: 8px 16px;
  background-color: #ff3b30; 
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-wish-button {
  padding: 6px 8px;
  position: absolute;
  top: 30px;
  right: 0;
  background-color: transparent;
  border: 1px solid #666;
  border-radius: 4px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.wished-container {
  position: relative;
}

.wished-by {
  color: #997aff;
}
.wished-by span {
  transform: translateY(5px);
  display: inline-block;
  font-weight: bold;
  color: #007aff;
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  word-break: break-word;
}

.description a {
  word-break: break-all; 
  display: inline-block; 
  width: 100%; 
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: #222;
  padding: 20px;
  padding-top:30px;
  border-radius: 8px;
  width: 80%;
  max-width: 345px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content input {
  width: 90%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #aaa;
  color: #fff;
  background: #333;
  border-radius: 4px;
}

.modal-content input::placeholder {
  color: #ccc;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #ff3b30;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #aaa;
}

.exit-button-container {
  text-align: right;
}

.exit-button {
  padding: 8px 10px;
}
</style>