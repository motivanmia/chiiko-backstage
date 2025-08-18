import { computed } from 'vue';

export const useFilter = (
  tableDataRef,
  searchOptionRef,
  searchTextRef,
  optionsGenerator,
  firstLevelKey,
  secLevelKey,
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
    if (Array.isArray(selected)) {
      if (selected.length === 2) {
        // 多層篩選邏輯
        const mainValue = selected[0];
        const subValue = selected[1];
        if (mainValue !== 'all' && firstLevelKey && secLevelKey) {
          if (Array.isArray(mainValue) && mainValue.length === 2 && mainValue[0] === 'not') {
            // 不等於第一層的判斷項目
            const excludedValue = mainValue[1];
            result = result.filter(
              (item) => item[firstLevelKey] !== excludedValue && item[secLevelKey] === subValue,
            );
          } else {
            // 等於第一層的判斷項目
            result = result.filter(
              (item) => item[firstLevelKey] === mainValue && item[secLevelKey] === subValue,
            );
          }
        }
      } else if (selected.length === 1) {
        // 單層篩選邏輯
        const selectedValue = selected[0];
        if (selectedValue !== 'all' && firstLevelKey) {
          result = result.filter((item) => item[firstLevelKey] === selectedValue);
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
// // 定義選項生成邏輯
// const optionsGenerator = (data) => {
//   // 定義主選項
//   const mainOptions = [
//     { label: '管理員', value: '管理員' },
//     { label: '會員', value: ['not', '管理員'] },
//   ];

//   // 為每個主選項生成子選項
//   const secOptions = mainOptions.map((mainOpt) => {
//     let subChildren = [];

//     if (mainOpt.value === '管理員') {
//       // 主選項是admin時 篩選出author為管理員的資料
//       const adminData = data.filter((item) => item.author === '管理員');
//       // 依據資料項目生成子選項(狀態)
//       const uniqueName = [...new Set(adminData.map((item) => item.status))];
//       subChildren = uniqueName.map((status) => ({
//         label: status,
//         value: status,
//       }));
//     } else if (mainOpt.value !== '管理員') {
//       // 主選項是non-admin時 篩選出author不是管理員的資料
//       const nonAdminData = data.filter((item) => item.author !== '管理員');
//       // 依據資料項目生成子選項(狀態)
//       const uniqueName = [...new Set(nonAdminData.map((item) => item.status))];
//       subChildren = uniqueName.map((status) => ({
//         label: status,
//         value: status,
//       }));
//     }
//     return {
//       ...mainOpt,
//       children: subChildren,
//     };
//   });
//   return secOptions;
// };

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

// // 使用composable生成選項
// const { dropOptions, filterData } = useFilter(
//   tableData,
//   searchOption,
//   searchText,
//   optionsGenerator,
//   'status',    //第一層選單項目
//   undefined,   //第二層選單項目(單層就undefined)
// );
