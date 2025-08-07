import { computed } from 'vue';

export const useFilterTableData = (tableData, dropOptions, searchOption, searchText) => {
  const filterData = computed(() => {
    let result = tableData;

    const selected = Array.isArray(searchOption.value) ? searchOption.value[0] : searchOption.value;

    // 篩選訂單狀態
    if (selected !== 'all') {
      const selectedOption = dropOptions.find((option) => option.value === selected);
      if (selectedOption) {
        result = result.filter((item) => item.status === selectedOption.label);
      }
    }

    // 篩選文字搜尋
    if (searchText.value.trim() !== '') {
      const keyword = searchText.value.trim().toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(keyword)),
      );
    }

    return result;
  });

  return {
    filterData,
  };
};
