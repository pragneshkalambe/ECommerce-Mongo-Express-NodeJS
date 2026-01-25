const { Error } = require('mongoose');
const UserService = require('../services/userServices');
// const userSchema = require("../middleware/validation");

const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsersServ();

        res.status(200).json({
            message: "Users Found",
            users: users
        });

    } catch (error) {
        res.status(404).json({
            message: "No Users",
            error: error.message
        });
    }
};
const getUser = async (req, res) => {
    try {
        let userId = await req.params.id;
        const foundUser = await UserService.getUserServ(userId)

        res.status(200).json(
            {
                message: "User Found",
                data: foundUser
            }

        );

    } catch (error) {
        res.status(404).json({
            message: "No User With This ID",
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {

        let newUser = await UserService.createUserServ(req.body);
        res.status(200).json(
            {
                message: "New User Created Successfully",
                newuser: newUser
            }
        );
    } catch (error) {
        res.status(404).json({
            message: "Error occured in creating user",
            error: new Error("Email Already Exists")
        });
    }
}


const updateUser = async (req, res) => {
    try {

        let userId = req.params.id;
        let userUpdateData = JSON.parse(JSON.stringify(req.body));
        userUpdateData.id = userId;

        let updatedUser = await UserService.updateUserServ(userUpdateData);
        
            res.status(200).json({
                message: "User Info Updated",
                data: updatedUser
            });
        


    } catch (error) {
        res.status(404).json(
            {
                message: "Value in Wrong Format,Retry",
                users: error
            }

        );
    }
}
const deleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        let userId = await UserService.deleteUserServ(id);
         res.status(200).json({
            catch: " Deleted User",
            error: id
        });
        
    } catch (error) {
        res.status(400).json({
            catch: "Error Deleting User",
            error: error
        });
    }
}


module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};