const express = require('express');
const router = express.Router();

const { getUsers, getUser , createUser , deleteUser , updateUser } = require("../controllers/userController");

router.get('/',getUsers);
router.get('/:id',getUser);
router.post('/',createUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports = router;