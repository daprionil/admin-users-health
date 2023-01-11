import UI from './class/UI.js';
import * as sel from './selectors.js';
import Api from './class/Api.js';

let modeDateForm = false;
let modeUserForm = false;

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
        };
        if(val.type !== 'submit'){
            return {...init,[val.name]:val.value.trim()};
        };
        return init;
    },{});

    //Validate all date for the date
    const validate = Object.values(date).some(val => val === '');

    //If any value in the form is empty, print the input and see the message in the GUI
    UI.printInputsInvalids({form:$,classEl:'input-danger'});
    if(validate){
        //View message in appointment creation form
        UI.viewMessageForm({
            form:$,msgBase:'¡ Solicitud Inválida !',
            msgAux:'Completa todos los Campos',
        });
        return;
    };

    //If the userID in the form doesn't exist
    const userExiste = await Api.validateGetUser(date.idUser);

    if(!userExiste){
        //View message by invalid userId
        UI.viewMessageForm({
            form:$,msgBase:'¡ Usuario Inválido !',
            msgAux:'Ingresa un Usuario Existente'
        });
        return;
    };

    //If date [dateDate, timeDate] is less than current
    const dateLessCurrent = new Date(`${date.dateDate} ${date.timeDate}`) - new Date();
    if(!(dateLessCurrent > 0)){
        //View message by invalid userId
        UI.viewMessageForm({
            form:$,msgBase:'¡ Fecha Inválida !',
            msgAux:' Ingresa una Fecha superior a la Actual'
        });
        return;
    };

    
    //View Spinner in Form
    const loader = UI.printSpinnerForm({form:$});
    
    //Reset all form
    $.reset();
    
    // # Actions after Affected date in DB Json
    const cbAfterAffectedDate = msgBase => async ({dates,users}) => {
        //Print Dates
        UI.printAllDates(dates,users,sel.datesStack);
        //Remove Loader
        if(loader) UI.removeElement(loader);
        //Add Message in form
        UI.viewMessageForm({form:$,msgBase,type:'success'});
    };

    //If the form is in editing mode
    if(modeDateForm){
        //Set id Date to Edit
        const submitFormDate = $.querySelector('[type="submit"]');
        const val = submitFormDate.dataset.idedit;
        date.id = parseInt(val);

        //Editing Date in Data Base JSON with fetch
        Api.putDate({date,cb:cbAfterAffectedDate('¡ Editado Correctamente !')});

        //Set mode value to Editing Dates
        modeDateForm = false;
        changeSubmitForms({submit:submitFormDate,mode:modeDateForm});

        return;
    };
    
    //Add date after all validations
    Api.addDate({date,cb: cbAfterAffectedDate('¡ Agredado Correctamente !')});
};


//Execute with a event listener 'submit', form modal
function addUser(evt){
    //Detiene la acción por default
    evt.preventDefault();
    
    //Centralizar información Obtenida en el formulario
    const $ = evt.target;
    const userData = {
        id: generateId(),
        nameUser: $.nameUser.value,
        telephoneUser: $.telephoneUser.value,
        emailUser: $.emailUser.value,
        typeUser: $.typeUser.value
    };
    
    //Validation values in form
    const validate = Object.values(userData).some( val => val === '');
    
    //If not validate form for userData
    UI.printInputsInvalids({form:$,classEl:'input-danger'});
    
    if(validate){
        UI.viewMessageForm({form:$,msgBase:'¡Rellena los Campos!',msgAux:'completa la Información para Continuar'});
        return;
    };
    
    //View Spinner in Form
    const loader = UI.printSpinnerForm({form:$});
    
    //Actions after affected user in form
    const cbAfterAffectedUser = (msgText) => () => {
        //Remove Loader
        UI.removeElement(loader);
        
        //Add message after adding user
        UI.viewMessageForm({
            form:$,
            msgBase:msgText,
            msgAux:'Ya puedes crear citas.',
            type:'success'
        });
        
        //Collapse modal 2 second after being added
        setTimeout(() => {
            UI.toggleElement({el:sel.modal,text:'show-window'});
        }, 1000);
        
        //Copy userId in The Navigator ClipBoard
        navigator.clipboard.writeText(userData.id);
    };

    //Reset all form
    $.reset();
    //If mode is Edit Mode
    if(modeUserForm){
        //Set value previous in UserDate to id in userDate in form
        const submitForm = $.querySelector('input[type="submit"]');
        userData.id = submitForm.dataset.id;

        //After Actions to edit user
        Api.putUser({user:userData,cb:cbAfterAffectedUser('¡Usuario Modificado Correctamente!')});
        
        //Change mode user form
        modeUserForm = false;
        
        //Change value to text in submit form's
        changeSubmitForms({submit:submitForm, mode:modeUserForm});
        return;
    };
    

    //Add user in Data Base 
    Api.addUser({user:userData,cb:cbAfterAffectedUser('¡Usuario Registrado Correctamente!')});
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
};

//filter appointments and add user value
function fillDatesByUsers(dates,users){
    const findDates =  dates.filter(date => {
        return users.find( ({id}) => id === date.idUser);
    }).map( date => {
        const user = users.find( ({id}) => id === date.idUser);
        return {...date,user};
    });

    //returns the ordered Citations
    return sortDatesFiltered(findDates);
};

//Sort appoinments by Date
function sortDatesFiltered(dates){
    return dates.sort((actualDate,afterDate) => {
        const aTimeDate = new Date(`${actualDate.dateDate} ${actualDate.timeDate}`);
        const bTimeDate = new Date(`${afterDate.dateDate} ${afterDate.timeDate}`);

        return aTimeDate - bTimeDate;
    });
};

//Generate Scripting HTML for each of the appointments
function generateScriptingDate(date){
    const {idUser, typeDate, reasonDate, dateDate, timeDate, user} = date;
    const {telephoneUser, nameUser, typeUser} = user;

    const validateCurrentDate = new Date(`${dateDate} ${timeDate}`) - new Date();
    const classToCardDateCurrent = validateCurrentDate > 0 ? 'current-date':'not-current-date';

    //Create main box for date
    const dateBox = document.createElement('DIV');
    dateBox.classList.add('ctn-card',classToCardDateCurrent);

    //Create Element Info User in Card

    const ctnInfoUser = document.createElement('DIV');
    ctnInfoUser.classList.add('ctn-card-info-user');

    //#-->
    const dateInfoUser = document.createElement('DIV');
    dateInfoUser.classList.add('ctn-card-info-user-text');
    //-->
    const p1Name = document.createElement('P');
    p1Name.classList.add('ctn-card-info-user-text-name');
    p1Name.textContent = nameUser;
    
    const p2Id = document.createElement('P');
    p2Id.innerHTML = `<span>Id:</span> ${idUser}`;
    
    const p3Tel = document.createElement('P');
    p3Tel.innerHTML = `<span>Tel:</span> ${telephoneUser}`;
    //##
    const elementTypeUser = document.createElement('DIV');
    const typeString = parseInt(typeUser) ? 'premium' : 'estandar';
    elementTypeUser.classList.add('ctn-card-info-user-type',typeString);
    //##

    //Create Element Info Date in Card
    const ctnInfoDate = document.createElement('DIV');
    ctnInfoDate.classList.add('ctn-card-info-date');
    //## -->
    const elementTypeDate = document.createElement('DIV');
    elementTypeDate.classList.add('ctn-card-info-date-type');
    const typeDateString = parseInt(typeDate) ? 'Medicina Interna' : 'Medicina General';
    elementTypeDate.innerHTML = `<p>${typeDateString}</p>`;

    const elementReasonDate = document.createElement('DIV');
    elementReasonDate.classList.add('ctn-card-info-date-descrip');
    elementReasonDate.innerHTML = `<p>${reasonDate}</p>`;

    const elementDateTime = document.createElement('DIV');
    elementDateTime.classList.add('ctn-card-info-date-time');
    elementDateTime.innerHTML = `<p><span>${dateDate}</span><span>${timeDate}</span></p>`;
    //##

    const ctnBtnsDate = document.createElement('DIV');
    ctnBtnsDate.classList.add('ctn-card-btns');
    
    const btnDelDate = document.createElement('BUTTON');
    btnDelDate.classList.add('btn','btn-del');
    btnDelDate.innerHTML = `<i class="large material-icons">delete_forever</i>`;
    //Adding Event Listener onClick
    btnDelDate.onclick = () => readyToDelDate(date);
    
    const btnEditDate = document.createElement('BUTTON');
    btnEditDate.classList.add('btn','btn-edit');
    btnEditDate.innerHTML = `<i class="large material-icons">create</i>`;
    //Adding Event Listener onClick to Edit a Appointment
    btnEditDate.onclick = () => readyToEditDate(date);

    //Adding Elements

    //Contains the User information in the Appointment
    dateInfoUser.appendChild(p1Name);
    dateInfoUser.appendChild(p2Id);
    dateInfoUser.appendChild(p3Tel);

    ctnInfoUser.appendChild(dateInfoUser);
    ctnInfoUser.appendChild(elementTypeUser);

    //It contains the information of the Appointment
    ctnInfoDate.appendChild(elementTypeDate);
    ctnInfoDate.appendChild(elementReasonDate);
    ctnInfoDate.appendChild(elementDateTime);

    //Contains the user interaction for the citation (BTNS)
    ctnBtnsDate.appendChild(btnDelDate);
    ctnBtnsDate.appendChild(btnEditDate);

    //Elements Main
    dateBox.appendChild(ctnInfoUser);
    dateBox.appendChild(ctnInfoDate);
    dateBox.appendChild(ctnBtnsDate);

    return dateBox;
}

//Getting ready to delete an Appointment
function readyToDelDate({id,user:{nameUser}}){
    const validate = confirm(`¿Estás Seguro que deseas eliminar la Cita de ${nameUser}?`);
    
    if(!validate) return;
    
    //Delete appoinment after validating With the user
    const cb = async ({dates,users}) => {
        //Showing browser alert that the citation has been removed
        alert('La cita ha sido removida...');
        //Print all remaining citations again
        UI.printAllDates(dates,users,sel.datesStack);
    };
    Api.deleteDate({id,cb})
};

//Getting Started to Edit an Appointment
function readyToEditDate(date){
    //main form for creating appointments
    const form = sel.formMainDates;

    //Changing mode Date form
    modeDateForm = true;

    //Set attribute in the form to Edit Date
    const submitFormDates = form.querySelector('[type="submit"]');
    submitFormDates.dataset.idedit = date.id;
    changeSubmitForms({submit:submitFormDates,mode:modeDateForm});

    //Fill values over inputs
    UI.fillInputsInForm({value:date,form});

};

//Options to form Date in Changing Modes
function changeSubmitForms({submit,mode}){
    submit.value = mode ? 'Guardar Cambios' : 'Crear';
    if(mode){
        submit.classList.add('editing-mode');
        return;
    };
    submit.classList.remove('editing-mode');
};

//Ready to Edit user in Page Main from Page Users
function readyToEditUser(paramsValue){
    if(paramsValue){
        //Get User
        const userIdParam = Api.users.find(user => user.id === paramsValue);
        if(!userIdParam) return;
        //Set values User in Form Add users
        UI.fillInputsInForm({value:userIdParam,form:sel.formModal});

        //Toggle Modal In Page Main
        UI.toggleElement({el:sel.modal,text:'show-window'});

        //Set mode form
        modeUserForm = true;

        //Mode Submit in form
        const submit = sel.formModal.querySelector('input[type="submit"]');
        submit.dataset.id = userIdParam.id;

        //Change value to text in submit Form
        changeSubmitForms({submit,mode:modeUserForm});
    };
};

//############ PAGE USERS ################
function setTextToFilterUsers(evt){
    evt.preventDefault();

    //Get value to input in Page
    const textFiltered = evt.target.value.toLowerCase().trim();
    UI.printAllUsers({users:filterUser(textFiltered),ctn:sel.usersStack});
};

//Filter users for string value
function filterUser(str = ''){
    return Api.users.filter(user => user.nameUser.toLowerCase().includes(str));
};

//Generate HTML to user Element
function generateScriptingUser({nameUser,telephoneUser, emailUser, typeUser, id}){
    //Main Values
    const typeStrUser = parseInt(typeUser) ? 'premium' : 'estandar';

    //Scripting to Card User
    const cardUser = document.createElement('DIV');
    cardUser.classList.add('card-user');

    //######## TOP CARD USER ###############
    const topCardUser = document.createElement('DIV');
    topCardUser.classList.add('ctn-top-card-user');
    topCardUser.innerHTML = `
    <p><strong>Id: </strong><span>${id}</span></p>
    <div class="ctn-icon-type-user">
        <p title="${typeStrUser}" class="type-user ${typeStrUser}"></p>
    </div>`;

    //######## MID CARD USER ###############
    const midCardUser = document.createElement('DIV');
    midCardUser.classList.add('ctn-mid-card-user');
    midCardUser.innerHTML = `
    <div class="ctn-mid-top-card-user">
        <p class="fullname-user">${nameUser}</p>
        <p class="telephone-user">${telephoneUser}</p>
    </div>`;

    //######## BOTTOM CARD USER ###############
    const bottomCardUser = document.createElement('DIV');
    bottomCardUser.classList.add('ctn-bottom-card-user');
    
    const bottomCardInfoEmail = document.createElement('P');
    bottomCardInfoEmail.classList.add('email-user');
    bottomCardInfoEmail.textContent = emailUser;

    const bottomCardCtnBtns = document.createElement('DIV');
    bottomCardCtnBtns.classList.add('btns-card-user');

    const btnDelUser = document.createElement('BUTTON');
    btnDelUser.classList.add('btn','del-user');
    btnDelUser.innerHTML = `<i class="large material-icons">delete_forever</i>`;
    btnDelUser.onclick = () => {
        readyToDelUser(id);
    };
    
    const btnEditUser = document.createElement('A');
    btnEditUser.classList.add('btn','edit-user');
    btnEditUser.href = `/code/index.html?id_user=${id}`;
    btnEditUser.innerHTML = `<i class="large material-icons">create</i>`;

    //Adding Btns in BottomCardCtnBts
    bottomCardCtnBtns.appendChild(btnDelUser);
    bottomCardCtnBtns.appendChild(btnEditUser);

    //Adding Elements in BottomCardUser
    bottomCardUser.appendChild(bottomCardInfoEmail);
    bottomCardUser.appendChild(bottomCardCtnBtns);
    
    //Adding Elements in Main Element cardUser;
    cardUser.appendChild(topCardUser);
    cardUser.appendChild(midCardUser);
    cardUser.appendChild(bottomCardUser);

    return cardUser;
};

//Ready to del User in Page Users
function readyToDelUser(id){
    //Confirm Delete User
    const validate = confirm(`¿Estás seguro que deseas Eliminar [${id}], Se eliminarán todas sus citas?`);
    
    if(!validate) return;

    //Deleted User and All Dates form User
    const cb = ({users}) => {
        //Print All Users in Page Users
        UI.printAllUsers({users,ctn:sel.usersStack});
    };
    Api.deleteUser({id,cb});
};


export {
    addUser,
    addDate,
    generateScriptingDate,
    fillDatesByUsers,
    setTextToFilterUsers,
    generateScriptingUser,
    readyToEditUser
};