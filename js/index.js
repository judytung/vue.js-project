import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
const path = 'judyhexschoolforvue'; // 加入個人 API Path

// 建立 Vue 元件
const app = createApp({
    data() {
        return {
            user:{
                username: '',
                password: ''
            },
        }
    },
    methods: {
        login() {  // 發送 api 至遠端，登入並儲存 token 
            axios.post(`${url}/admin/signin`, this.user)
            // 成功結果
            .then((res) => {
            const { token, expired } = res.data; // 解構寫法
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
            window.location = 'products.html';
            })
            // 失敗結果
            .catch((err) => {
            alert(err.data.message); // 登入錯誤提示
            })
        },
    },
});


app.mount('#app'); //  定義 Vue 元件，使用 mount 指定掛載到 app 這個 id 


