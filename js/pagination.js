export default {  // 預設匯出
    props: ['pages'], // pages 為自定義名稱
   template: `<nav aria-label="Page navigation example">
   <ul class="pagination">
     <li class="page-item" :class="{ disabled: !pages.has_pre }">
       <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-product', pages.current_page - 1)">
         <span aria-hidden="true">&laquo;</span>
       </a>
     </li>                                                        
     <li class="page-item" :class="{ active: page === pages.current_page }"
     v-for="page in pages.total_pages" :key="page + 'page' ">
        <a class="page-link" href="#" @click.prevent="$emit('get-product', page)">{{ page }}</a></li>
     <li class="page-item" :class="{ disabled: !pages.has_next }">
       <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-product', pages.current_page + 1)">
         <span aria-hidden="true">&raquo;</span>
       </a>
     </li>
   </ul>
 </nav>`
}  // 此為元件樣板
// total_pages 是總頁數，可以在 vue 開發工具看到
// 分頁前後不能點擊時，會在 li 上加上 disabled ，使用 class 判斷式，如果沒有前一頁時，會加上 disabled
// 可以直接在 @click 加上 $emit 跟自定義的名稱，且不要用大寫