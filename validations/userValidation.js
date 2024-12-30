const User= require('../models/User')
const userRegisterSchema={
    username:{
        notEmpty:{
            errorMessage: 'username is required'
        },
        trim:true
    },
    email:{
        notEmpty:{
            errorMessage: 'email is required'
        },
        isEmail:{
            errorMessage: 'email should be in a valid format'
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email:value})
                if(!user){
                    return true
                }else{
                    throw new Error('Email is alraedy exists')
                }
            }
        },
        trim:true,
        normalizeEmail:true
    },
    password:{
        notEmpty:{
            erroeMessage: 'password is required'
        },
        isLength:{
            options: {min:8,max:128},
            errorMessage: 'password must be in 8-128 charaters long'
        },
        trim:true
    },
    role:{
        notEmpty:{
            errorMessage:'role is required'
        },
        isIn:{
            options:[['admin','manager', 'customer']],
            errorMessage:'role should be either admin or manager or user'
        }
    }

}
const userLoginSchema={
    email:{
        notEmpty:{
            erroeMessage: 'email is required'
        },
        isEmail:{
            errorMessage: 'email should be in a valid format'
        },
        trim:true,
        normalizeEmail:true
    },
    password:{
        notEmpty:{
            erroeMessage: 'password is required'
        },
        isLength:{
            options: {min:8,max:128},
            errorMessage: 'password must be in 8-128 charaters long'
        },
        trim:true
    }
}    
module.exports={
    userRegisterSchema,
    userLoginSchema

}