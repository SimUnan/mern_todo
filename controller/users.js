import User from '../model/User.js'

export const getUserInfo = async(req, res, next) => {
    try {
        const userInfo = await User.findById(req.user.id).select('name email');
    
        return res.status(200).json(userInfo);
    }catch(err){
        console.log(err)
        return next(err);
    };
};

export const updateUser = async(req, res,next) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            email: req.body.email
        },{
            new: true
        }).select('name email');
        
        return res.status(200).json(updatedUser);
    }catch(err){
        console.log(err);
        return next(err);
    }
}
