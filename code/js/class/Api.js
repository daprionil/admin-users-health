/**
 * Introduction to connect JSON DataBase
 * 
 * Extract dates for userId: http://localhost:4000/dates?userId=OU12312IA
 * Route to Dates: http://localhost:4000/dates/
 * Route to Users: http://localhost:4000/users/
 * 
 * 
 * ######################### ERROR
 * fetch(), Al USAR post, la página se recarga.
 * #$%AA
 */

class Api{
    //################## USERS ###################
    constructor(){
        this.route = 'http://localhost:4000';
        this.users = [];
        this.dates = [];
    }
    //Get users for validate
    async validateGetUser(id){
        return this.users.some(user => user.id === id);
    };

    //Add users in the DB.json #$%AA
    async addUser({user,cb}){
        //URL by Fetch
        const url = `${this.route}/users/`;

        //options from conection to json Database
        const options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user),
        };

        //Post User in the data Base
        try {
            await fetch(url,options);
            cb();
        } catch (error) {
            console.log(error);
        };
    };

    async getUsers(){
        //Get all dates in Data Base
        const url = `${this.route}/users/`;
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    //############ Dates ###############
    async addDate({date,cb}){
        //Url to add Date in JSON Data Base
        const url = `${this.route}/dates/`;
        
        const options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(date),
        };
        
        //Adding Date in Data Base JSON
        try {
            await fetch(url,options);
            cb();
        } catch (error) {
            console.log(error);    
        }
    }

    //Editing Dates
    async putDate({date,cb}){
        //Url to add Date in JSON Data Base
        const url = `${this.route}/dates/${date.id}`;
        
        const options = {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(date),
        };
        
        //Adding Date in Data Base JSON
        try {
            await fetch(url,options);
            cb();
        } catch (error) {
            console.log(error);    
        }
    };
    
    //Get All Dates
    async getDates(){
        //Get all dates in Data Base
        const url = `${this.route}/dates/`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            return data;
        } catch (error) {
            console.log(error);
        }
    };
    
    //Delete Date
    async deleteDate({id,cb}){
        //Url to add Date in JSON Data Base
        const url = `${this.route}/dates/${id}`;

        //Options by Fetch
        const options = {method: 'delete'};
        
        //Adding Date in Data Base JSON
        try {
            await fetch(url,options);
            cb();
        } catch (error) {
            console.log(error);    
        }
    };
    
};

export default new Api();