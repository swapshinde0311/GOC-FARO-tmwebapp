import "react-app-polyfill/ie11";
import "core-js/stable"
//import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//import * as serviceWorker from "./serviceWorker";
import ConfigureStore from "./Redux/ConfigureStore";
import { Provider } from "react-redux";
import { configureLocalization, TranslationConsumer } from "@scuf/localization";
import { LoadingPage } from "./Components/UIBase/Common/LoadingPage";

const store = ConfigureStore();
var userLang = navigator.language || navigator.userLanguage;
const lngCode = userLang.substring(0, 2);

// console.log(userLang);

configureLocalization({
  languageCode: lngCode,
  useXhr: true,
  fallbackLanguages: ["en"],
});

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingPage message=""></LoadingPage>}>
      <TranslationConsumer>
        {(t) => (
          <Provider store={store}>
            <App />
          </Provider>
        )}
      </TranslationConsumer>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
