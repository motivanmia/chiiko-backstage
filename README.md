
# 好想吃一口　料理分享平台

- 一個集結食譜靈感、料理分享與食材挑選教學的溫暖平台。  
- 前台支援發布食譜/留言、食譜瀏覽/收藏功能、食材教學瀏覽與購物等功能。
- 後台提供會員、食譜與商品管理等功能。
- [專案上線連結](https://tibamef2e.com/cjd101/g4/)
## 📄專案簡介

在現今快節奏的生活中,許多人渴望享受烹飪的樂趣,卻常因忙碌或對下廚的生疏而感到卻步。  
我們希望打造一個溫馨的食譜交流平台,讓烹飪不再是壓力,而是人人都能享受的樂趣。  
不是專業廚師也沒關係,讓人「好想吃一口」就夠了!


## 🛠️使用技術

- **前端框架：** Vue 3 + Vite
- **狀態管理：** Pinia
- **樣式語言：** Sass（SCSS） 
- **後端技術：** PHP、MySQL
- **套件：**  
  Element Plus（UI框架）  
  Swiper（輪播圖）  
  VueQuil（內容編輯器）  
  SweetAlert2（彈出視窗）  
  img-comparison-slider（圖片比較滑桿）

## 🔗專案架構
#### GitHub 連結
- [前台](https://github.com/motivanmia/chiiko-frontend)
- [後台](https://github.com/motivanmia/chiiko-backstage)
- [API](https://github.com/motivanmia/chiiko-backend)

#### 前台架構
|      頁面   | 功能                                   |
| ---------- | ----------------------------------------------|
| 首頁        |主要視覺頁面，呈現網站主要功能|
| 靈感 X 食譜 |可利用關鍵字快速搜尋，也可以依分類類別瀏覽各分類內容|
| 食材學堂 |點選以打開燈箱式介面，說明各項食材挑選訣竅|
| 分享料理 |登入會員後可以撰寫及發布食譜，也可於他人分享的食譜留言分享料理成果|
| 好物精選 |可依分類瀏覽商品，並進行購物|
| 會員中心 |展示個人資料、食譜收藏、發表紀錄、留言管理、訂單紀錄|
| 購物車 |加入或刪除商品，輸入運送及付款資訊結帳|

#### 後台架構
|      頁面   | 功能                                   |
| ---------- | ----------------------------------------------|
| 權限管理 |管理人員資訊、權限修改|
| 會員管理 |會員資料、權限修改|
| 食譜管理 |平台方發布食譜、會員發布食譜管理（審核後發布）|
| 食材學堂管理 |挑選指南項目新增、修改|
| 商品管理 |新增商品、商品資訊修改|
| 訂單管理 |訂單查詢、狀態修改|
| 留言檢舉管理 |食譜留言檢舉審核|


## 📑相關文件

- [專案簡報](https://drive.google.com/file/d/1aM_nexsMuLItVcnybBZh5xoVy9yUt7Cj/view?usp=sharing)
- [專案介紹影片](https://youtu.be/RKiEfWw2duM?si=zg5EGKB7mHHPyQAQ)
- [系統分析文件](https://drive.google.com/file/d/1HhSt8A-ZGQnGf0vCH760K4eplhgflAbz/view)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
