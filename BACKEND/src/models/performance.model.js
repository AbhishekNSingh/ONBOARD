
import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
    
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    givenBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    rating:{
        type:Number,
        min:[1,"Rating cannot be smaller than 1"],
        max:[5,"rating cannot be greater than 5"],
        required:true
    },
    remarks:{
        type:String,
        trim:true,
        required:true

    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    }

},{timestamps:true})


performanceSchema.index({ employee: 1, month: 1 }, { unique: true });

const performanceModel = mongoose.model("performance",performanceSchema);
export default performanceModel;