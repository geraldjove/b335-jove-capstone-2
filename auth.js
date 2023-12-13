const jwt = require('jsonwebtoken');
const secret = 'B335BonafeJoveCapstone2'

// create access token

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }
    return jwt.sign(data, secret, {})
}

// verifyToken

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    if (typeof token === 'undefined'){
        return res.status(401).send('Error Token ')
    } else {
        // remove bearer string
        token = token.slice(7, token.length)
        return jwt.verify(token, secret, (err,decodedToken) =>{
            if (err){
                return res.status(400).send('Error decoding token');
            } else {
                req.user = decodedToken;
                next();
            }
        })
    }
}

// verify admin
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin === true){
        next()
    } else {
        return res.status(403).send({forbidden: 'Unauthorized or user is not an admin'});
    }
}

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) =>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}
