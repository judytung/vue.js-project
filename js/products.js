import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
const path = 'judyhexschoolforvue'; // 加入個人 API Path
const  token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token);
    // headers 夾帶 token
    // axios 的 toeken 只要發送一次
    axios.defaults.headers.common['Authorization'] = token;

let productModal = {};
let removeProductModal = {};
// 建立 Vue 元件
const app = createApp({
    components: {
        pagination
    },
    data () {
        return {
            products:[],
            tempProducts:{
                imagesUrl:[]   // 新增多圖使用，使用陣列
            },
            isNew: false,
            pagination: {}  // 先定義一個分頁物件
        }
    },
    methods : {
        getProducts (page = 1) { // 參數預設值 query，預設 page 是第一頁，沒有預設的話會變 undefined
            axios.get(`${apiUrl}/api/${path}/admin/products/?page=${page}`)
            .then((res) => {
            // console.log(res.data);
            this.products = res.data.products;
            this.pagination = res.data.pagination;  // 先取出分頁功能
            })
            .catch((err) => {
            })
            // all 物件寫法
            // axios.get(`${url}/api/${path}/admin/products/all`)
            // .then((res) => {
            // this.products = res.data.products;
            // Object.values(this.products).forEach((item) => {
            //     console.log(item);
            // })
            // })
            // .catch((err) => {
            // console.dir(err);
            // })

        },
        checkLogin(params) {
            axios.post(`${apiUrl}/api/user/check`)
            .then(() => {
              // console.log(res.data);
              this.getProducts();
            })
            .catch((err) => {
              alert(err.data.message);
              window.location = 'index.html';
            })
        },
        openModal(status, productItem) {
            if (status === 'isNew' ) {
                this.tempProducts = {
                    imagesUrl:[]   // 若為新增產品，將欄位清空
                }
                productModal.show(); 
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProducts = JSON.parse(JSON.stringify(productItem)); //深拷貝
                if(! this.tempProducts.imagesUrl){ // 如果  imagesUrl 陣列不存在
                    this.tempProducts.imagesUrl=[]
                  }
                productModal.show(); 
                this.isNew = false;
            } else if (status === 'remove') {
                removeProductModal.show();
                this.tempProducts = {...productItem}; // 因物件傳參考的特性，需做拷貝
            }
            // console.log(status, productItem);
        },
        createImages () {
            this.tempProducts.imagesUrl = [];
            this.tempProducts.imagesUrl.push('')
        }
        
    },
   mounted () {
    this.checkLogin();
    // bootstrap modal 方法
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    removeProductModal = new bootstrap.Modal(document.getElementById('removeProductModal'));
   }
});

// 全域註冊
// 產品元件
app.component('productModal', {
    // 需接受外層資料來運作，使用 props 
    props: ['tempProducts','isNew','pagination'],
    template: '#templateForProductModal', 
    // 內層少了 updateProduct 的方法，所以將方法移進來
    // 因為更新產品是在 modal 裏面做的，而我們將這個 modal 做成元件，所以更新的方法要放在元件裡面，每個元件的資料都是獨立的，所以進入元件時，方法也都是獨立的
    methods: {
        // 新增編輯都能使用的話，改成  updateProduct
        updateProduct() {
            let http = 'post';
            let url = `${apiUrl}/api/${path}/admin/product`;
            // 判斷是不是新的產品，當 this.new 為 false 時會跑這段
            if (!this.isNew) {
                http = 'put';
                url = `${apiUrl}/api/${path}/admin/product/${this.tempProducts.id}`;
            }
            axios[http](url, {data:this.tempProducts}) // 這邊要特別注意，因為 api 格式規定資料是放在 data 裡的，所以需將 temproduct 放在 data 裡傳送
            .then((res) => {
                alert(res.data.message)
                // console.log(res.data);
                // this.getProducts();  // 需重新發送取得產品請求，本地端才會更新 // 將 updateProduct 移進內層後就沒有 getProducts 
                // 所以這裡無法使用外層方法 getProducts ，要使用 emit 來觸發外層事件
                this.$emit('get-products',http === 'put' ?this.pagination : 1);
                productModal.hide();  
            })
            .catch((err) => {
                alert(err.data.message)
            })
        }
    }
});
// 產品刪除元件
app.component('removeProductModal', {
    props: ['tempProducts','pagination'],
    template: '#templateForRemoveModal',
    methods: {
        removeProduct () {
            axios.delete(`${apiUrl}/api/${path}/admin/product/${this.tempProducts.id}`)
            .then((res) => {
            removeProductModal.hide();
            // this.getProducts();
            this.$emit('get-products',this.pagination);
            })
            .catch((err) => {
            alert(err.data.message)
            })
        },
    }
})
app.mount('#app');