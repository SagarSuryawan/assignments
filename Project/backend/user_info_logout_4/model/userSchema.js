const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{

        type:String,
        required:[true,'name is required'],
        trim:true,

    },

    email:{

        type:String,
        trim:true,
        lowercase:true,
        unique:[true,'already registred']

    },

    password:{

        type:String,
        select:false
    },

    forgotpasswordtoken:{

        type:String
    },

    forgotpaaswordExpiryDate:{

        type:Date
    }

},
{
    timestamps:true
})

userSchema.pre("create",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10)
    return next();

})


// jwt token

userSchema.methods = {
    jwtToken(){
        
       return JWT.sign(
            {
                id:this.id,
                email:this.email
            },
            process.env.SERECT,
            {expiresIn:'24h'}
        )
    }
}

module.exports = mongoose.model("User",userSchema)
