import * as sel from "./selectors.js";
import {
    validateFormModal,
    ui
} from './functions.js';

//Script for Page principal
export default function(){
    //Form modal- Add users
    sel.formModal.addEventListener('submit', validateFormModal);

    //Btn show modal event - Add user
    sel.btnCloseModal.addEventListener('click',()=>{
        ui.toggleModal({el:sel.modal,text:'show-window'})
    });
    sel.btnAddUserModal.addEventListener('click',()=>{
        ui.toggleModal({el:sel.modal,text:'show-window'})
    });
}
