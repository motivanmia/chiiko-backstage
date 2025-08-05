/**
 * iconMap：定義專案中使用的 icon 名稱對應到實際 iconify 的字串
 * key：統一的 icon 名稱（用來傳給 <Icon /> 元件）
 * value：實際 iconify 所需的圖示 ID
 * @type {Record<string, string>}
 */
export const iconMap = {
  cart: 'streamline-flex:shopping-bag-hand-bag-2-remix',
  member: 'qlementine-icons:user-16',
  search: 'ic:baseline-search',
  rightA: 'weui:arrow-filled',
  leftA: 'weui:arrow-filled',
  upA: 'weui:arrow-filled',
  downA: 'weui:arrow-filled',
  btnArrow: 'iconoir:maps-arrow',
  time: 'mingcute:time-line',
  markL: 'material-symbols:bookmark-outline',
  share: 'fa-solid:share',
  copy: 'akar-icons:copy',
  portion: 'mingcute:bowl-line',
  option: 'weui:more-outlined',
  plus: 'ic:baseline-plus',
  close: 'ic:baseline-plus',
  minus: 'ic:baseline-minus',
  remove: 'icon-park-solid:error',
  drag: 'carbon:draggable',
  hint: 'ep:warning-filled',
  check: 'mingcute:check-fill',
  ng: 'fa7-solid:exclamation',
  heartL: 'fa6-regular:heart',
  comment: 'tabler:message-dots',
  user: 'tdesign:user',
  revise: 'mingcute:pencil-line',
  recipe: 'bx:file',
  bell: 'mdi:bell-outline',
  order: 'mdi:cart-outline',
  del: 'mdi:trash-outline',
  mark: 'material-symbols:bookmark',
  heart: 'fa6-solid:heart',
  upload: 'material-symbols:upload',
  card: 'ion:card',
  edit: 'lucide:edit',
  detail: 'bx:detail',
  line: 'lineicons:line',
  fb: 'ic:baseline-facebook',
  google: 'devicon:google',
  login: 'hugeicons:login-02',
  logout: 'hugeicons:logout-02',
  eyes: 'gravity-ui:eyes-look-left',
  close_eyes: 'humbleicons:eye-close',
};

/**
 * rotationMap：針對部分 icon 進行角度旋轉的設定
 * key：icon 名稱，必須與 iconMap 的 key 對應
 * value：CSS transform 的旋轉角度
 * @type {Record<string, string>}
 */
export const rotationMap = {
  leftA: '180deg',
  upA: '-90deg',
  downA: '90deg',
  close: '45deg',
};

/**
 * flipMap：針對部分 icon 做左右翻轉
 * key：icon 名稱，value 為 true 表示需要翻轉
 * @type {Record<string, boolean>}
 */
export const flipMap = {
  comment: true,
};
