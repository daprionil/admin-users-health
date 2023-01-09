import main from "../main.js";
import mainUser from "../mainUsers.js";

//Class for initialize App
export default class {
    constructor(){
        //If pathname in href is equal to Users Page
        if(location.pathname === "/code/usuarios.html"){
            mainUser();
            return;
        };
        //If pathname in href is equal to Main Page
        if(location.pathname === "/code/index.html"){
            this.initAppMain();
            return;
        };
    };

    //Metodos Iniciales
    initAppMain(){
        //Inicializa el Script base
        main();
    }
};