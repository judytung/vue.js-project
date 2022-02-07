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
const app = {
    data () {
        return {
            products:[],
            tempProducts:{
                imagesUrl:[]   // 新增多圖使用，使用陣列
            },
            new: false,
            pagination: {}  // 先定義一個分頁物件
        }
    },
    methods : {
        getProducts () {
            axios.get(`${apiUrl}/api/${path}/admin/products`)
            .then((res) => {
            // console.log(res.data);
            this.products = res.data.products;
            this.pagination = res.data.pagination;  // 先取出分頁功能
            })
            .catch((err) => {
            console.dir(err);
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
        removeProduct () {
            axios.delete(`${apiUrl}/api/${path}/admin/product/${this.tempProducts.id}`)
            .then((res) => {
            removeProductModal.hide();
            this.getProducts();
            })
            .catch((err) => {
            console.dir(err);
            alert(err.data.message)
            })
        },
        checkLogin(params) {
            axios.post(`${apiUrl}/api/user/check`)
            .then(() => {
              // console.log(res.data);
              this.getProducts();
            })
            .catch((err) => {
              console.dir(err);
              alert(err.data.message);
              window.location = 'index.html';
            })
        },
        openModal(status, productItem) {
            if (status === 'new' ) {
                this.tempProducts = {
                    imagesUrl:[]   // 若為新增產品，將欄位清空
                }
                productModal.show(); 
                this.new = true;
            } else if (status === 'edit') {
                this.tempProducts = {...productItem}; // 因物件傳參考的特性，需做拷貝
                productModal.show(); 
                this.new = false;
            } else if (status === 'remove') {
                removeProductModal.show();
                this.tempProducts = {...productItem}; // 因物件傳參考的特性，需做拷貝
            }
            // console.log(status, productItem);
        },
        // 新增編輯都能使用的話，改成  updateProduct
        updateProduct() {
            let http = 'post';
            let url = `${apiUrl}/api/${path}/admin/product`;
            // 判斷是不是新的產品，當 this.new 為 false 時會跑這段
            if (!this.new) {
                http = 'put';
                url = `${apiUrl}/api/${path}/admin/product/${this.tempProducts.id}`;
            }
            axios[http](url, {data:this.tempProducts}) // 這邊要特別注意，因為 api 格式規定資料是放在 data 裡的，所以需將 temproduct 放在 data 裡傳送
            .then((res) => {
                alert(res.data.message)
                // console.log(res.data);
                this.getProducts();  // 需重新發送取得產品請求，本地端才會更新
                productModal.hide(); 
            })
        }
    },
   mounted () {
    this.checkLogin();
    // bootstrap modal 方法
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    removeProductModal = new bootstrap.Modal(document.getElementById('removeProductModal'));
   }
}
Vue.createApp(app).mount('#app')