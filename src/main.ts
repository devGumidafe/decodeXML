import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import Tooltip from 'primevue/tooltip';

import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.component('InputText', InputText)
app.component('Button', Button)
app.component('Divider', Divider)
app.component('Message', Message)
app.component('Textarea', Textarea)
app.component('Card', Card)
app.directive('tooltip', Tooltip)

app.mount('#app')
