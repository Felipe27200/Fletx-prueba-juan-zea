const authService = require('../service/AuthService');
const CreateUserDTO = require('../dto/CreateUserDTO')
const jwt = require('jsonwebtoken')

exports.register = async function (req, res) {
    try
    {
        let user = new CreateUserDTO(
            req.body.name,
            req.body.username,
            req.body.password,
        );

        if (!user.name || user.name.trim().length <= 0)
            throw new Error("The name is required");
        if (!user.username || user.username.trim().length <= 0)
            throw new Error("The username is required");
        if (!user.password || user.password.trim().length <= 0)
            throw new Error("The password is required");

        let newUser = await authService.register(user);

        res.json(responseObjet("User created", newUser));
    }
    catch(error)
    {
        res.status(400);
        res.json(responseObjet(error.message, error, 'unsuccessful'));
    }
}

exports.login = async function (req, res) {
    try
    {
        if (!req.body.username || req.body.username.trim().length <= 0)
            throw new Error("The username is required");
        if (!req.body.password || req.body.password.trim().length <= 0)
            throw new Error("The password is required");

        let tokens = await authService.login(req.body.username, req.body.password);

        res.cookie('jwt', tokens.refreshToken, { 
            httpOnly: true, 
            sameSite: 'Lax', 
            secure: false, 
            maxAge: 25 * 60 * 60 * 1000 
        });

        res.json(responseObjet("User login", tokens.accessToken));
    }
    catch(error)
    {
        res.status(400);
        res.json(responseObjet(error.message, error, 'unsuccessful'));
    }
}

exports.handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    console.log(cookies);

    if (!cookies?.jwt) 
        return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;

    const foundUser = await authService.findByRefreshToken(refreshToken);

    if (!foundUser) 
        return res.sendStatus(403); //Forbidden 

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) 
                return res.sendStatus(403);

            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken })
        }
    );
}

exports.logout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) 
        return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    authService.logout(refreshToken);

    res.clearCookie('jwt', { 
        httpOnly: true, 
        // sameSite: 'None', 
        // secure: true 
        sameSite: 'Lax', 
        secure: false, 
    });
    res.sendStatus(204);
}

function responseObjet(message, data, status = 'successful')
{
  return {
    status: status,
    message: message,
    data: data
  }
}