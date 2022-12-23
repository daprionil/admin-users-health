import UI from './class/UI.js';
import * as sel from './selectors.js';

const ui = new UI();


//Execute with a event listener 'submit', form modal
function validateFormModal(evt){
    //Detiene la acción por defautl
    evt.preventDefault();

    //Centralizar información Obtenida en el formulario
    const $ = evt.target;
    const values = {
        nameUser: $.nameUser.value,
        telefoneUser: $.telefoneUser.value,
        emailUser: $.emailUser.value,
        typeUser: $.typeUser.value,
        idUser: generateIdUser()
    };
    
    //Validation values in form
    const validate = Object.values(values).some( val => val === '');
    
    //If not validate form for values
    if(validate){
        ui.viewMessageForm({form:$,msgBase:'¡Rellena los Campos!',msgAux:'completa la Información para Continuar'});
        return;
    };
    
    ui.viewMessageForm({form:$,msgBase:'¡Usuario Registrado!',msgAux:'Ya puedes crear citas.',type:'success'});
    //Close modal before
    setTimeout(() => {
        ui.toggleModal({el:sel.modal,text:'show-window'});
    }, 1000);

    //Add user to 
};


//Generate random id alphanumeric for id User create
function generateIdUser(){
    let codeId;

    const arrLetters = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S'];
    const nums = [1,2,3,4,5,6,7,8,9,0];
    //Cicle for - Generate dinamic code Id
    for(let i = 0; i < 10; i++){
        const rBase = Math.floor(Math.random() * 2);

        if(rBase === 1){
            const rN = Math.floor(Math.random() * (arrLetters.length - 1));
            codeId = `${codeId ?? ''}${arrLetters[rN]}`;
            continue;
        }
        const rN = Math.floor(Math.random() * (nums.length - 1));
        codeId = `${codeId ?? ''}${nums[rN]}`;
    };
    return codeId;
}

export {
    validateFormModal, ui
};