import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
import ru_RU from 'antd/lib/locale/ru_RU';
import { Provider } from 'react-redux';
import {setupStore} from "./store"
import {BrowserRouter as Router} from "react-router-dom"

import "./main.css";

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <ConfigProvider 
        componentSize='large' 
        locale={ru_RU}
      >
          <Provider store={store}>
            <App />
          </Provider>
      </ConfigProvider>
    </Router>,
)
