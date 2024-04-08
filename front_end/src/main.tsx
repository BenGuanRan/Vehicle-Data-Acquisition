import ReactDOM from 'react-dom/client'
import './index.css'
import '../src/mock/mockApi.ts'
import React from "react";
import App from "@/views/app";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <App/>
    </React.StrictMode>,
)
