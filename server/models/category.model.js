import mongoose  from "mongoose";

const categorySchema = new mongoose.Schema({
      name:{
           type:String,
           required:true
      },
      description:{
        type:String,
        required:true
      },
      icon:{
        type:String,
        enum:["Palette","Globe","Code2","Smartphone","Video","PenTool","TrendingUp","MessageSquare"]
      }
},{timestamps:true})

const Category = mongoose.model("category",categorySchema)

export default Category