const { request } = require('express');
// const { getUser, getUsers } = require('../controllers/userController');
const User = require('../models/user');

const getUsersServ = async () => {
    let allUsers = await User.find();
    // const allUsers = await users.filter(usr => usr.id);
    console.log(allUsers);
    return allUsers;
};
const getUserServ = async (id) => {
    let filteredUser = await User.findById(id);
    console.log(filteredUser);
    // let filteredUser = users.filter(t => t.id === id);
    return filteredUser;
};

const createUserServ = async (data) => {
    const userData = JSON.parse(JSON.stringify(data));
    //userData.id = users.length > 0 ? Math.max(...users.map(userId => userId.id)) + 1 : 1;

    //sorting new user object
    // let desiredKey = "id";
    // const desiredValue = newuserData[desiredKey];

    // const sortedUserObject = {
    //     [desiredKey]: desiredValue, // Place the desired key first
    //     ...Object.fromEntries(
    //         Object.entries(newuserData).filter(([key]) => key !== desiredKey)
    //     )
    // };
    //push the new json object record 
    // users.push(userData);
    try {
       await new User({ name: userData.name, email: userData.email }).save();
        
            // .catch((err) => {
            //     console.log(err.errmsg);
            //     throw new Error(err)
            // });
    } catch (err) {
        throw new Error(err.errmsg)

    }


};

const updateUserServ = async (data) => {
    try {
        let updatedUser = await User.updateOne({_id : data.id},{$set:{name : data.name, email : data.email}});
         return updatedUser;
        
    } catch (error) {
        throw new Error(error.errmsg)
    }
};

const deleteUserServ = async (id) => {
    try {
        await User.deleteOne({_id:id});
        
    } catch (err) {
        throw new Error(err.errmsg);
    }

    // let deleteUser = await users.findIndex(us => us.id === id);
    // console.log(deleteUser);
    // if (deleteUser === -1) {
    //     return null;
    // }
    // return deleteUser;

};
module.exports = { getUsersServ, getUserServ, createUserServ, updateUserServ,deleteUserServ };

