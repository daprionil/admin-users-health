import * as sel from "./selectors.js";
import {
    addUser,
    addDate,
    readyToEditUser,
} from './functions.js';

import api from "./class/Api.js";
import ui from "./class/UI.js";

//Script for Page principal
export default async function(){
    //Set values to App
    api.users = await api.getUsers();
    api.dates = await api.getDates();
    
    //view all Dates
    ui.printAllDates(api.dates,api.users,sel.datesStack);
    
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
    
    //Test Code in the March
    const paramsValue = new URLSearchParams(location.search).get('id_user');
    readyToEditUser(paramsValue);
};
