import ui from './class/UI.js';
import * as sel from './selectors.js';
import api from './class/Api.js';


//Execute with submit form create dates
async function addDate(evt) {
    //prevenir la acción por default
    evt.preventDefault();

    //Short verbose for head form
    const $ = evt.target;

    //Extract values in form

    /** Object Template Generated
     * {
     *  idUser:'',
     *  typeDate:'',
     *  reasonDate:'',
     *  dateDate:'',
     *  timeDate:'00:00'
     * }
     */
    const date = [...$].reduce((init,val) => {
        if(val.name === 'idUser'){
            return {...init,[val.name]:val.value.trim().toUpperCase()};
        }
        if(val.type !== 'submit'){
            return {...init,[val.name]:val.value.trim()};
        }
        return init;
    },{});

    //Validate all date for the date
    const validate = Object.values(date).some(val => val === '');

    //If any value in the form is empty, print the input and see the message in the GUI
    ui.printInputsInvalids({form:$,classEl:'input-danger'});
    if(validate){
        //View message in appointment creation form
        ui.viewMessageForm({
            form:$,msgBase:'¡ Solicitud Inválida !',
            msgAux:'Completa todos los Campos',
            type:'danger'
        });
        return;
    };

    //If the userID in the form doesn't exist
    const validateUserId = await api.validateGetUser(date.idUser);
    if(!validateUserId){
        //View message by invalid userId
        ui.viewMessageForm({
            form:$,msgBase:'¡ Usuario Inválido !',
            msgAux:'Ingresa un Usuario Existente',
            type:'danger'
        });
        return;
    };

    //Add date after all validations
    api.addDate(date);
    //////////////////////////////////
    //Actions after add date in DB Json
    $.reset();
};


//Execute with a event listener 'submit', form modal
function addUser(evt){
    //Detiene la acción por default
    evt.preventDefault();

    //Centralizar información Obtenida en el formulario
    const $ = evt.target;
    const values = {
        id: generateId(),
        nameUser: $.nameUser.value,
        telephoneUser: $.telephoneUser.value,
        emailUser: $.emailUser.value,
        typeUser: $.typeUser.value
    };
    
    //Validation values in form
    const validate = Object.values(values).some( val => val === '');
    
    //If not validate form for values
    ui.printInputsInvalids({form:$,classEl:'input-danger'});

    if(validate){
        ui.viewMessageForm({form:$,msgBase:'¡Rellena los Campos!',msgAux:'completa la Información para Continuar'});
        return;
    };
    //View in form GUI
    ui.viewMessageForm({form:$,msgBase:'¡Usuario Registrado Correctamente!',msgAux:'Ya puedes crear citas.',type:'success'});
    
    //Close modal before
    $.reset();
    setTimeout(() => {
        ui.toggleElement({el:sel.modal,text:'show-window'});
        //Add user to data base
        api.addUser(values);
    }, 1000);
};


//Generate random id alphanumeric for id User create
function generateId(){
    let codeId = '';

    const arrLetters = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S'];
    const nums = [1,2,3,4,5,6,7,8,9,0];
    //Cicle for - Generate dinamic code Id
    for(let i = 0; i < 10; i++){
        const rBase = Math.floor(Math.random() * 2);

        if(rBase === 1){
            const rN = Math.floor(Math.random() * (arrLetters.length - 1));
            codeId = `${codeId}${arrLetters[rN]}`;
            continue;
        }
        const rN = Math.floor(Math.random() * (nums.length - 1));
        codeId = `${codeId}${nums[rN]}`;
    };
    return codeId;
}

export {
    addUser, ui,
    addDate
};