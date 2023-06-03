const mongoose = require('mongoose')
const crypto = require('crypto')
const { ObjectId } = mongoose.Schema.Types;


const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{ 
        type:String,
        unique:true,
    },
    mobile:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{ 
        type:String,
    },
    bio:{
        type:String,
        maxLength:100
    },
    userImg:{
        type:String
    },
    password:{
        type:String
    },
    email_permissions:{
        type:Boolean
    },
    startAs:{
        type:String,
    },
    investors:[
        {
            status:{
                type:String,
                enum:['Interested','Shortlisted','Nudged'],
                default:'Interested'
            },
            profileId:{
                type:ObjectId,
                ref:'investors'
            }
        }
    ],
    incubators:[
        {
            status:{
                type:String,
                enum:['Interested','Shortlisted','Nudged'],
                default:'Interested'
            },
            profileId:{
                type:ObjectId,
                ref:'incubators'
            }
        }
    ],
    startups:[
        { 
            status:{
                type:String,
                enum:['Interested','Shortlisted','Nudged'],
                default:'Interested'
            },
            profileId:{
                type:ObjectId,
                ref:'startups'
            }
        }
    ],
    // job_applications:[
    //     { 
    //         status:{
    //             type:String,
    //             enum:['Selected','Shortlisted','Pending'],
    //             default:'Pending'
    //         },
    //         profileId:{
    //             type:ObjectId,
    //             ref:'startups'
    //         }
    //     }
    // ],
    // jobs:[],
    friends:[
        { 
            type: ObjectId, 
            ref: "users" 
        }
    ],
    friend_requests:[
        { 
            type: ObjectId, 
            ref: "users" 
        }
    ],
    passwordResetOTP:String,
    passwordExpareAt:Date
})


userSchema.methods.createResetOTP = async function(){
    const otp = Math.floor(100000 + Math.random() * 900000) + ""
    console.log(otp)
    this.passwordResetOTP = await crypto.createHash('sha256').update(otp).digest('hex')
    this.passwordExpareAt = Date.now() + 10*60*1000
    return otp
}


const User = mongoose.model('users',userSchema)

module.exports = User