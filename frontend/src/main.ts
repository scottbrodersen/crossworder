import { createApp } from 'vue';
import './style.module.css';
import App from './App.vue';
import { Quasar, Dialog } from 'quasar';
import quasarIconSet from 'quasar/icon-set/svg-material-icons';
import 'quasar/src/css/index.sass';

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

const crossworderApp = createApp(App);
crossworderApp.use(Quasar, {
  plugins: { Dialog }, // import Quasar plugins and add here
  iconSet: quasarIconSet,
});

crossworderApp.mount('#app');
