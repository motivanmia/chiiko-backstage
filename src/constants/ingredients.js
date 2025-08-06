export const ingredients = [
  {
    id: '001',
    name: '空心菜',
    category: 'vegetables',
    img: [
      new URL('@/assets/image/School/Ingredients/carrot.png', import.meta.url).href,
      new URL('@/assets/image/School/Ingredients/carrot-ng.png', import.meta.url).href,
    ],
    status: '顯示',
    lightbox: [
      {
        goodtitle: '葉片鮮綠完整',
        badtitle: '葉色暗沉捲曲',
        goodcontent: '色澤翠綠、葉面無損傷代表新鮮。',
        badcontent: '葉片枯黃或捲曲顯示水分流失與老化。',
      },
      {
        goodtitle: '莖部挺直水潤',
        badtitle: '莖部軟化乾癟',
        goodcontent: '莖部粗壯、挺拔且斷面濕潤者最佳。',
        badcontent: '中空或扁塌表示已失水不新鮮。',
      },
      {
        goodtitle: '無異味或斑點',
        badtitle: '葉面黑斑異味',
        goodcontent: '氣味清新自然，無腐敗異味或黑斑。',
        badcontent: '有腐爛味或葉面黑點為腐敗前兆。',
      },
    ],
    preservation: `- 整株空心菜可放置於 5～10°C 的冷藏環境，建議使用報紙或廚房紙巾包裹後裝袋，避免水氣積聚導致腐敗。
- 若暫時不使用，可將根部朝下立放冷藏，減緩水分流失。
- 最佳賞味期為 2 日內，超過 3 日口感與風味將明顯下降。`,
  },
  {
    id: '002',
    name: '胡蘿蔔',
    category: 'vegetables',
    img: [
      new URL('@/assets/image/School/Ingredients/carrot.png', import.meta.url).href,
      new URL('@/assets/image/School/Ingredients/carrot-ng.png', import.meta.url).href,
    ],
    status: '顯示',
    lightbox: [
      {
        goodtitle: '表皮光滑亮澤',
        badtitle: '表皮乾裂皺縮',
        goodcontent: '外觀光滑、顏色均勻代表新鮮。',
        badcontent: '有裂痕或皺紋表示水分流失。',
      },
      {
        goodtitle: '質地堅實',
        badtitle: '觸感鬆軟',
        goodcontent: '手感扎實代表內部水分飽滿。',
        badcontent: '軟化代表存放過久或腐敗。',
      },
      {
        goodtitle: '無黑斑或異味',
        badtitle: '黑斑或異味',
        goodcontent: '沒有黑斑且氣味清新自然。',
        badcontent: '黑斑或異味為腐壞的徵兆。',
      },
    ],
    preservation: `- 胡蘿蔔建議去除葉部後裝入塑膠袋密封，置於冷藏室 0～5°C 保存。
- 避免與蘋果、香蕉等釋放乙烯的水果放在一起，以防加速老化。
- 冷藏可保存約 1～2 週，最佳口感在 5 日內。`,
  },
];
