import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const apiBase = import.meta.env.VITE_API_BASE;

export const useIngredientCategoryStore = defineStore('ingredientCategory', () => {
  const list = ref([]); // [{ id, name, image }]
  const loading = ref(false);
  const error = ref(null);
  const hasLoaded = ref(false);

  async function loadCategories(force = false) {
    if (hasLoaded.value && !force) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${apiBase}/school/get_ingredient_categary.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rows = Array.isArray(json?.data) ? json.data : [];

      list.value = rows.map((r) => ({
        id: String(r.ingredient_category_id ?? r.id ?? ''),
        name: r.name ?? '',
        image: r.image ?? '',
      }));
      hasLoaded.value = true;
    } catch (e) {
      error.value = e?.message || '讀取分類失敗';
    } finally {
      loading.value = false;
    }
  }

  // 下拉選單 options（
  const selectOptions = computed(() => list.value.map((c) => ({ label: c.name, value: c.id })));
  // console.log(selectOptions);

  // 快速查名稱
  const nameById = (id) => list.value.find((c) => c.id === String(id))?.name ?? '';

  return { list, loading, error, hasLoaded, loadCategories, selectOptions, nameById };
});
