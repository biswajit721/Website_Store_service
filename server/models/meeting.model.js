import mongoose, { model } from "mongoose";

const meetingSchema = new mongoose.Schema({
     clientName:{
        type:String,
        required:true
     },
     phone:{
        type:String,
        required:true
     },
     email:{
          type:String,
          required:true
     },
      subject:{
          type:String,
          required:true
     },
     DOM:{
        type:String,
        required:true,
     },
     meetingUrl:{
       type:String,
       default:"https://meet.google.com/kah-xvke-byd"
     },
     location:{
        type:String,
     },
     meetingType:{
       type:String,
       enum:["Offline","online"],
       default:"online"
     },
     message:{
        type:String,
        default:""
     }
})

const meeting = model("Meeting",meetingSchema)

export default meeting
