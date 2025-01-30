import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";

import './index.css'

window.tips = {};
window.maps = [];
window.miniMaps = [];

createRoot(document.getElementById('root-form')!).render(
    <StrictMode>
        <Form/>
    </StrictMode>,
)