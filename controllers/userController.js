const User = require('../models/User');
const auth = require('../auth');
const bcrypt = require('bcrypt');

module.exports.registerUser = (req, res) => {
    const { firstName, lastName, email, password, isAdmin, mobileNo } = req.body;
    return User.findOne({email: email})
    .then((result)=>{
        if(result){
            res.status(404).send({message: 'User already exists'})
        } else {
            let newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: bcrypt.hashSync(password, 10),
                isAdmin: isAdmin,
                mobileNo: mobileNo
            })
            return newUser.save()
            .then((savedUser, err)=>{
                if(err){
                    return res.status(500).send({error: err});
                } else {
                    return res.status(200).send({message: savedUser});
                }
            })
        }
    })
    .catch((err)=>{
        res.status(500).send({internal_error: err})
    });
};

module.exports.loginUser = (req, res) => {
    return User.findOne({email: req.body.email})
    .then((result)=>{
        if(!result){
            return res.status(404).send({message: 'No user found.'})
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
            if(isPasswordCorrect){
                return res.status(200).send({access_token: auth.createAccessToken(result)})
            } else {
                return res.status(403).send({message: 'Wrong Password'})
            }
           
        }
    })
    .catch((error)=>{
        return res.status(500).send({internal_error: error})
    })
}

module.exports.userDetails = (req, res) => {
    // console.log(req.user.id)
    return User.findById(req.user.id)
    .then((result) => {
        if (!result){
            return res.status(404).send({message: 'No user found'});
        } else {
            return res.status(200).send({result: result})
        }
    })
    .catch((err)=>{
        return res.status(500).send({internal_error: err})
    })
}

module.exports.updateAdmin = (req, res) => {
    const requestingAdmin = req.user.id;
    const targetUserId = req.params.userId;
     User.findById(requestingAdmin)
    .then((result)=>{
        console.log(result)
        if (!result || !result.isAdmin){
            res.status(401).send({ message: 'Unauthorized. Only admin users can update other users to admin.' });
        } else {
            User.findByIdAndUpdate(req.params.userId, {isAdmin: true, new: true})
            .then((user)=>{
                if(!user){
                    res.status(404).send({message: 'User not found'})
                } else {
                    res.status(200).send({message: 'User updated as an admin successfully'})
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({ message: 'Internal server error.' });
              });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
      });
}

module.exports.updatePassword = (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
    .then((result)=>{
        if(!result){
            return res.status(404).send({message: 'No user found'});
        } else {
            User.findByIdAndUpdate(req.user.id, {password: req.body.password, new: true})
            .then((updated)=>{
                if(!updated){
                    return res.status(500).send({message: 'User password is not updated'});
                } else{
                    return res.status(200).send({message: 'User password is updated'})
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({ message: 'Internal server error.' });
              });
        }
    })
    .catch((error) => {
		console.error(error);
		res.status(500).send({ message: 'Internal server error.' });
	  });
}