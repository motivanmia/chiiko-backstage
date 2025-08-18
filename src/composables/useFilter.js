import { computed } from 'vue';

export const useFilter = (
  tableDataRef,
  searchOptionRef,
  searchTextRef,
  optionsGenerator,
  filterKey,
) => {
  // 生成下拉選單選項
  const dropOptions = computed(() => {
    const generatedOptions = optionsGenerator(tableDataRef.value);
    return [{ label: '全部', value: 'all' }, ...generatedOptions];
  });

  // 根據選擇和關鍵字篩選資料
  const filterData = computed(() => {
    let result = tableDataRef.value;
    const selected = searchOptionRef.value;
    const keyword = searchTextRef.value.trim().toLowerCase();

    // 篩選邏輯 判斷是否為多層篩選
    if (Array.isArray(selected) && selected.length > 0) {
      // 多層篩選邏輯
      if (selected.length === 2) {
        const statusValue = selected[0];
        const secValue = selected[1];
        if (statusValue !== 'all' && filterKey) {
          result = result.filter(
            (item) => item.status === statusValue && item[filterKey] === secValue,
          );
        }
      } else if (selected.length === 1) {
        // 單層篩選邏輯
        const selectedValue = selected[0];
        if (selectedValue !== 'all') {
          result = result.filter((item) => item.status === selectedValue);
        }
      }
    }

    //關鍵字篩選
    if (keyword) {
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(keyword)),
      );
    }
    return result;
  });
  return { dropOptions, filterData };
};

// -----定義邏輯(要寫在各自的頁面)

// -----多層選項
// // 定義選項生成邏輯  name都改成第二層篩選的欄位值
// const optionsGenerator = (data) => {
//   const uniqueStatuses = [...new Set(data.map((item) => item.status))];
//   const options = uniqueStatuses.map((status) => {
//     const itemsInStatus = data.filter((item) => item.status === status);
//     const uniqueSub = [...new Set(itemsInStatus.map((item) => item.name))];
//     const subChildren = uniqueSub.map((name) => ({
//       label: name,
//       value: name,
//     }));
//     return {
//       label: status === 'Active' ? '正常' : '停權',
//       value: status,
//       children: subChildren,
//     };
//   });
//   return options;
// };

// // 定義篩選邏輯
// const filterKey = 'name';

// -----單一選項
//  // 定義選項生成邏輯
//   const optionsGenerator = (data) => {
//     const uniqueStatuses = [...new Set(data.map((item) => item.status))];
//     return uniqueStatuses.map((status) => ({
//       label: status === 'Active' ? '正常' : '停權',
//       value: status,
//       childern: [],
//     }));
//   };

//   // 定義篩選邏輯
//  const filterKey = undefined;
