import {
    generateScriptingDate,
    fillDatesByUsers,
    generateScriptingUser
} from '../functions.js';

import * as sel from '../selectors.js';

/**
 * Manage all interface changes in the spa
 */

class UI{
    //############# CONTROL ELEMENTS ##############
    //Remove Children Elements of Parent Element
    clearParentElement({el}){
        while(el.firstElementChild){
            el.firstElementChild.remove();
        };
    };
    //Remove any element
    removeElement(el){
        el.remove();
    };

    //Show modal Add users
    toggleElement({el,text}){
        el.classList.toggle(`${text}`);
    };

    //Show loader in form Element
    printSpinnerForm({form}){
        const loader = document.createElement('span');
        loader.classList.add('loader');

        //Get the last element of the Form Element
        const beforeElement = [...form.children].at(-1);
        form.insertBefore(loader,beforeElement);

        return loader;
    };
    
    //################ FORM #######################
    
    //show modal view
    viewMessageForm({form,msgBase,msgAux = '',type = 'danger'}){
        //If  the element exist in the document
        const el = form.querySelector('.message-box');
        if(el) this.removeElement(el);
        
        //Create element document, Body of message box
        const msgBox = document.createElement('div');
        msgBox.classList.add('message-box',`${type}`);
        msgBox.innerHTML = `<p><strong>${msgBase}</strong> ${msgAux}</p>`;
        
        //adding element msgBox
        const afterForm = form.querySelector('input[type="submit"]').parentElement;
        form.insertBefore(msgBox, afterForm);

        //Delete to the msgBox in the document
        setTimeout(() => {
            this.removeElement(msgBox);
        }, 4000);
    };

    //Print invalid inputs in Form
    printInputsInvalids({form,classEl}){
        //Iterates in input form's 
        Object.values(form).filter(el => el.type !== 'submit').forEach(el => {
            //Print invalids Inputs
            el.classList.remove(classEl);
            if(el.value.trim() === ''){
                el.classList.add(classEl);
            };
        });
    }

    //###################### DATES or USERS ############
    
    //print all dates in the Document
    printAllDates(dates,users, contentElements){
        //Clear Results in the HTML
        this.clearParentElement({el:contentElements});

        //Get Dates Filtered
        const filterDates = fillDatesByUsers(dates,users);
        
        //Create frag to adding datesHTML
        const frag = document.createDocumentFragment();
        
        //Iterate in all dates previous filter
        filterDates.forEach( date => {
            //Generate the HTML of Date Information
            frag.insertBefore(generateScriptingDate(date),frag.children[0]);
        });

        //Add fragment in the Document
        contentElements.appendChild(frag);
    };

    //fill in the form inputs with the appointment
    fillInputsInForm({value:valueObj,form}){
        //Iterated over inputs form's
        for(const input of form){
            //access the name property input's
            const name = input.name;

            //If the input is a Radio Element
            if(input.type === 'radio'){
                const inputRadio = form.querySelector(`input[type="radio"][value="${valueObj[name]}"]`);
                inputRadio.checked = true;
                return;
            };
            //Check if the property exists on the value Object
            if(name in valueObj){
                //Set value of object in the input
                input.value = valueObj[name];
            };
        };
    };
    //Print in the Element Document's all users in Data Base
    printAllUsers({users,ctn}){
        //Clear Elements in content HTML
        this.clearParentElement({el:ctn});

        //Create Documento Fragment
        const frag = document.createDocumentFragment();

        //Iterate all users filtered
        users.forEach(user =>{
            //Generate HTML and Adding in Fragment
            frag.appendChild(generateScriptingUser(user));
        });

        //Adding Fragment in Document
        ctn.appendChild(frag);
    };
};
export default new UI();