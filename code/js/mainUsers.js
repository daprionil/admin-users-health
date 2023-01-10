import * as sel from './selectors.js';
import {
    setTextToFilterUsers
} from './functions.js';
import Api from './class/Api.js';
import UI from './class/UI.js';

export default async function(){
    //Experimental Funtions in Code Performance
    Api.users = await Api.getUsers();
    UI.printAllUsers({users:Api.users,ctn:sel.usersStack});
    
    //Function for searching Users in DB Json
    sel.inputTextSearchUsers.addEventListener('input', setTextToFilterUsers);
};