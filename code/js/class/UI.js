/**
 * Manage all interface changes in the spa
 */

export default class{
    //Show modal Add users
    toggleModal({el,text}){
        el.classList.toggle(`${text}`);
    };

    //show modal view
    viewMessageForm({form,msgBase,msgAux,type = 'danger'}){
        //Create element document, Body of message box
        if(form.querySelector('.message-box')) return;
        
        //If not exist the element in the document
        const msgBox = document.createElement('div');
        msgBox.classList.add('message-box',`${type}`);
        msgBox.innerHTML = `<p><strong>${msgBase}</strong>${msgAux}</p>`;
        
        //adding element msgBox
        const afterForm = form.querySelector('input[type="submit"]').parentElement;
        form.insertBefore(msgBox, afterForm);

        //Delete to the msgBox in the document
        setTimeout(() => {
            msgBox.remove();
        }, 4000);
    };
};