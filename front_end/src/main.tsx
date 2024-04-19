import ReactDOM from 'react-dom/client'
import './index.css'
import MyApp from "@/views/app";
import {App} from "antd";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App>
        <MyApp/>
    </App>
)
