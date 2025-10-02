const userModel = require('../model/User');
const bcrypt = require('bcrypt')

exports.register = async function (userDTO) {
    let checkDuplicateUser = await module.exports.findByUsername(userDTO.username);

    if (checkDuplicateUser != null)
        throw new Error("The username is already taken.");

    const salt = 10;
    const hashedPassword = await bcrypt.hash(userDTO.password, salt);

    let user = await userModel.create({
        name: userDTO.name,
        username: userDTO.username,
        password: hashedPassword
    });

    return userResponse(user);
};

exports.findByUsername = async function (username) {
    let user = await userModel.findAll({
        where: { username: username}
    });

    if (user.length <= 0)
        return null;

    return userResponse(user[0]);
}

function userResponse(user)
{
    return {
        username: user.username,
        name: user.name,
    }
}