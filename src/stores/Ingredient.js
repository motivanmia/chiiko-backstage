import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
const apiBase = import.meta.env.VITE_API_BASE;

//  ID 對中文名
const categoryIdToLabel = {
  1: '植物性食材',
  2: '動物性食材',
};

function safeParseJSON(input, fallback = null) {
  try {
    if (typeof input === 'string') return JSON.parse(input);
    if (Array.isArray(input) || typeof input === 'object') return input;
    return fallback;
  } catch {
    return fallback;
  }
}

export const useIngredientStore = defineStore('ingredient', () => {
  const list = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadIngredients() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${apiBase}/school/get_ingredients.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      const rows = Array.isArray(result?.data) ? result.data : [];
      list.value = rows.map((item) => {
        const id = String(item.ingredient_id ?? item.id ?? '');
        const catId = String(item.ingredients_categary_id ?? item.ingredients_category_id ?? '');
        const catLabel = categoryIdToLabel[catId] ?? '';

        const images = Array.isArray(item.image) ? item.image : [];
        const imgFirst = images[0] ?? '';
        const content = safeParseJSON(item.content, []);

        return {
          raw: item,
          number: id,
          categoryId: catId,
          categoryLabel: catLabel,

          category: catLabel,

          name: item.name ?? '',
          img: imgFirst,
          images,
          status: item.status ?? '0',
          storage_method: item.storage_method ?? '',
          content,
        };
      });
    } catch (e) {
      error.value = e?.message || '讀取失敗';
    } finally {
      loading.value = false;
    }
  }

  const tableRows = computed(() => list.value);

  return { list, tableRows, loading, error, loadIngredients };
});
