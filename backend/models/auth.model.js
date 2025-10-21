import mongoose,{Schema} from "mongoose";

const authSchema=new  Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    token:{
        type:String,
      default:''

    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    updatedAt:{
        type:Date,
        default:Date.now()

    }

})


export default mongoose.model("Auth",authSchema)