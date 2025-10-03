const userModel = require('../model/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async function (userDTO) {
    let checkDuplicateUser = await module.exports.findByUsername(userDTO.username);

    if (checkDuplicateUser != null)
        throw new Error("The username is already taken.");

    const hashedPassword = await encryptPassword(userDTO.password);

    let user = await userModel.create({
        name: userDTO.name,
        username: userDTO.username,
        password: hashedPassword
    });

    return userResponse(user);
};

exports.login = async function (username, password) {
    // Find user by username
    const user = await userModel.findOne({ where: { username } });

    if (!user) {
        throw new Error("Username or password incorrect!");
    }

    // Compare plain password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Username or password incorrect!");
    }

    // CREATE JWT
    const accessToken = jwt.sign(
        { "username": user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    // Saving refresh token
    await userModel.update(
        { refresh_token: refreshToken }, 
        { where: { id: user.id } });

    return { accessToken, refreshToken };
};

async function encryptPassword(password) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

exports.findByUsername = async function (username) {
    let user = await userModel.findAll({
        where: { username: username }
    });

    if (user.length <= 0)
        return null;

    return userResponse(user[0]);
}

exports.findByRefreshToken = async function (refreshToken) {
    let user = await userModel.findOne({
        where: { refresh_token: refreshToken }
    });

    if (!user)
        return null;

    return userResponse(user);
}

function userResponse(user) {
    return {
        username: user.username,
        name: user.name,
    }
}