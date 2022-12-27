/**
 * Introduction to connect JSON DataBase
 * 
 * Extract dates for userId: http://localhost:4000/dates?userId=OU12312IA
 * Route to Dates: http://localhost:4000/dates/
 * Route to Users: http://localhost:4000/users/
 */

class Api{
    //################## USERS ###################

    //Get users for validate
    async validateGetUser(id){
        //Create URL with id user
        const url = `http://localhost:4000/users/${id}`;

        //Get user
        try {
            const response = await fetch(url);
            return `${response.status}`[0] === '2';
        } catch (err) {
            console.log(err);
        };
    };
    //Get All Dates
    getDates(){
        //Get all dates in Data Base
        const url = `http://localhost:4000/dates/`;

        fetch(url)
            .then(response => response.json())
            .then(data => console.log(data));
    };
    //Add users in the DB.json
    addUser(user){
        const url = `http://localhost:4000/users/`;
        //options from conection to json Database
        const options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(user),
        };

        //Post User in the data Base
        try {
            fetch(url,options)
                .then();
        } catch (error) {
            console.log(error);
        }
    }

    //############ Dates ###############
    addDate(date){
        //Url to add Date in JSON Data Base
        const url = `http://localhost:4000/dates/`;

        const options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(date),
        };

        fetch(url,options)
            .then(response => console.log(response));
    }
};

export default new Api();