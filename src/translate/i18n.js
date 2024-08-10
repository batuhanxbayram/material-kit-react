import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'


// const resources = {
//   tr: {
//     translation: {
//       welcome : "Hosgeldin",
//       overview: "Genel Bakış",

//     }

//   }
//   ,
//   en: {
//     translation: {
//       welcome : "Welcome",
//       overview: "Overview",

//     }
//   }
// }

i18n
.use(initReactI18next)
.use(Backend)
.init({
  lng:'tr',
});
