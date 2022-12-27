import * as sel from "./selectors.js";
import {
    addUser,
    addDate,
    ui
} from './functions.js';

//Script for Page principal
export default function(){
    //Test Code in the March


    //Form add Dates in main Page
    sel.formMainDates.addEventListener('submit',addDate)

    //Form modal- Add users
    sel.formModal.addEventListener('submit', addUser);

    //Btn show modal event - Add user
    sel.btnCloseModal.addEventListener('click',()=>{
        ui.toggleElement({el:sel.modal,text:'show-window'});
    });
    sel.btnAddUserModal.addEventListener('click',()=>{
        ui.toggleElement({el:sel.modal,text:'show-window'});
    });
}
