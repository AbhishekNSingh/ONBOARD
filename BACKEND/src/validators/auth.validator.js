import {body,validationResult} from "express-validator";

function validateRequest(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:  errors.array()});
    }
    next();
}

export const validateUserInput = [
    body("email")
        .isEmail().withMessage("Email should be in proper format"),
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({min : 3}).withMessage("Name should be at least 3 characters long"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("conatct must be a 10 digit number"),
    body("password")
        .isLength({min : 6}).withMessage("Password should be at least 6 characters long"),
    

    validateRequest
]

export const validateLoginUser = [
    body("email")
        .isEmail().withMessage("Email should be in proper format"),
    body("password")
        .isLength({min : 6}).withMessage("Password should be at least 6 characters long"),
    validateRequest
]