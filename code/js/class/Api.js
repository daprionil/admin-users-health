/**
 * Introduction to connect JSON DataBase
 * 
 * Extract dates for userId: http://localhost:4000/dates?userId=OU12312IA
 * Route to Dates: http://localhost:4000/dates/
 * Route to Users: http://localhost:4000/users/
 * 
 */

class Api{
    constructor(){
        this.route = 'http://localhost:4000';
        this.users = [];
        this.dates = [];
    }
    //################## USERS ###################
    
    //Get users for validate
    async validateGetUser(id){
        return this.users.some(user => user.id === id);
    };

    //Add users in the DB.json
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

    //Edit user in the DB.json 
    async putUser({user,cb}){
        //URL for Fetch
        const url = `${this.route}/users/${user.id}`;
        
        //Options to fetch in Method
        const options = {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
        };

        try {
            await fetch(url,options);
            //Set users in Class Value
            this.users = await this.getUsers();
            //Execute Function
            cb();
        } catch (err) {
            console.log(err);
        }
    }
    //Get all Users in DBJson
    async getUsers(){
        //Get all dates in Data Base
        const url = `${this.route}/users/`;
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            return data;
        } catch (error) {
            console.log(error);
        };
    };

    //Delete one user by Id
    async deleteUser({id,cb}){
        //Url to delete user
        const url = `${this.route}/users/${id}`;
        //Options by fetch to delete User
        const options = {method: 'DELETE'};

        try {
            await fetch(url,options);
            await this.deleteDatesByUser(id);

            this.users = await this.getUsers();

            cb({users:this.users});
        } catch (err) {
            console.log(err);
        };
    };
    
    //Delete all Dates by User
    async deleteDatesByUser(id){
        //Get dates by User
        try {
            //Filter Dates by Id user
            const data = this.dates.filter(date => date.idUser === id);

            //Iterated Data to Delete Dates one by one.
            data.forEach(({id}) => this.deleteDate({id}));
        } catch (err) {
            console.log(err);
        };
    };

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
            //Set values in API
            this.dates = await this.getDates();
            //Execute Function
            cb({dates:this.dates,users:this.users});
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
            //Set values in API
            this.dates = await this.getDates();
            //Execute Function
            cb({dates:this.dates,users:this.users});
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
    async deleteDate({id,cb = () => {}}){
        //Url to add Date in JSON Data Base
        const url = `${this.route}/dates/${id}`;

        //Options by Fetch
        const options = {method: 'delete'};
        
        //Adding Date in Data Base JSON
        try {
            await fetch(url,options);
            //Set values in API
            this.dates = await this.getDates();
            
            //Execute Function
            cb({dates:this.dates,users:this.users});
        } catch (error) {
            console.log(error);    
        }
    };
    
};

export default new Api();