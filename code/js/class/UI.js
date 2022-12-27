/**
 * Manage all interface changes in the spa
 */

class UI{
    //Show modal Add users
    toggleElement({el,text}){
        el.classList.toggle(`${text}`);
    };

    //show modal view
    viewMessageForm({form,msgBase,msgAux,type = 'danger'}){
        //Create element document, Body of message box
        const el = form.querySelector('.message-box');
        if(el) el.remove();
        
        //If not exist the element in the document
        const msgBox = document.createElement('div');
        msgBox.classList.add('message-box',`${type}`);
        msgBox.innerHTML = `<p><strong>${msgBase}</strong> ${msgAux}</p>`;
        
        //adding element msgBox
        const afterForm = form.querySelector('input[type="submit"]').parentElement;
        form.insertBefore(msgBox, afterForm);

        //Delete to the msgBox in the document
        setTimeout(() => {
            msgBox.remove();
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
};
export default new UI();