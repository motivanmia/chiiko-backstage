<template>
  <div class="recipe-board">
    <div class="recipe-board__manage">
      <MyTitle title="商品管理"></MyTitle>
      <IncreaseButton></IncreaseButton>
    </div>

    <table class="product-table">
      <thead>
        <tr>
          <th>商品編號</th>
          <th>商品分類</th>
          <th>商品預覽圖片</th>
          <th>商品名稱</th>
          <th>單價</th>
          <th>商品狀態</th>
          <th>編輯</th>
          <th>刪除</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(product, index) in products"
          :key="index"
        >
          <td>{{ product.code }}</td>
          <td>{{ product.category }}</td>
          <td>
            <img
              :src="getImage(product.image)"
              alt="商品圖"
              class="product-img"
            />
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>
            <label class="switch">
              <input
                type="checkbox"
                v-model="product.active"
              />
              <span class="slider round"></span>
            </label>
          </td>
          <td>
            <button @click="editProduct(index)">
              <img
                src="@/assets/images/Product/pan-icon.png"
                class="icon"
                alt="編輯"
              />
            </button>
          </td>
          <td>
            <button @click="deleteProduct(index)">
              <img
                src="@/assets/images/Product/trash-icon.png"
                class="icon"
                alt="編輯"
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import IncreaseButton from '@/components/common/IncreaseButton.vue';//新增+
  import MyTitle from '@/components/common/Title.vue';//文字
  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';//上下架
  import Table from '@/components/Table.vue';

  const products = ref([
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img1.png',
      name: '不鏽鋼奶油刀',
      price: 'NT$ 300',
      active: true,
    },
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img2.png',
      name: '魚鱗剝刀',
      price: 'NT$ 300',
      active: true,
    },
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img3.png',
      name: '日式和風筷架',
      price: 'NT$ 300',
      active: true,
    },
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img4.png',
      name: '韓式雪平鍋 18cm',
      price: 'NT$ 300',
      active: true,
    },
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img5.png',
      name: '刨絲器／磨泥器',
      price: 'NT$ 300',
      active: true,
    },
    {
      code: 'P0000216',
      category: '餐廚小物',
      image: 'product-img6.png',
      name: '量匙',
      price: 'NT$ 300',
      active: true,
    },
  ]);

  function getImage(filename) {
    return new URL(`../assets/images/Product/${filename}`, import.meta.url).href;
  }

  function editProduct(index) {
    alert(`編輯商品：${products.value[index].name}`);
  }

  function deleteProduct(index) {
    if (confirm('確定要刪除這個商品嗎？')) {
      products.value.splice(index, 1);
    }
  }
</script>

<style scoped>
  .icon {
    width: 20px;
  }
  .product-page {
    padding: 30px;
    font-family: 'Noto Sans TC', sans-serif;
    background-color: #fefcf6;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .product-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #eee2d3;
    text-align: center;
    font-size: 15px;
    color: #4a4a4a;
  }

  th {
    background-color: #f8e8d0;
    font-weight: bold;
  }

  .product-img {
    width: 70px;
    height: 70px;
    border-radius: 12px;
    object-fit: cover;
  }

  /* switch 開關 */
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 22px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 22px;
  }

  .slider::after {
    content: '上架';
    position: absolute;
    right: 6px;
    top: 2px;
    font-size: 12px;
    color: white;
    pointer-events: none;
  }

  input:checked + .slider::after {
    content: '下架';
    left: 6px;
    right: auto;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #f4a259;
  }
  input:checked + .slider:before {
    transform: translateX(22px);
  }

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
</style>
