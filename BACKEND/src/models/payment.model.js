import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    paidBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:[1,"amount cannot be less than 1"]
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
    status:{
        type:String,
        enum:["pending","failed","paid"],
        default:"paid"
    },
    razorpayOrderId:{
        type:String,
        unique: true,
         sparse: true 
    },
    razorpayPaymentId:{
        type:String,
        unique:true,
        sparse:true
    },
    note:{
        type:String,
        trim:true
    }

},{timestamps : true})

const paymentModel = mongoose.model("payment",paymentSchema);

export default paymentModel;