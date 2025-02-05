/* import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')
 */

import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar'; // Импортируйте Quasar
import quasarUserOptions from './quasar-user-options'; // Импортируйте пользовательские настройки



const app = createApp(App);

// Инициализируйте Quasar
app.use(Quasar, quasarUserOptions);

app.mount('#app');