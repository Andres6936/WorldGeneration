import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";

window.tips = {};
window.maps = [];
window.miniMaps = [];
window.settings = {};

createRoot(document.getElementById('root-form')!).render(
    <StrictMode>
        <Form/>
    </StrictMode>,
)