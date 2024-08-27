import bcrypt from "bcrypt"

export const hashpassword = ({password = '' , saltRound = 8}) => {
    return bcrypt.hashSync(password , saltRound)
}


export const comparePassword = ({password = '' , hashPassword = ''}) => {
    return bcrypt.compareSync(password , hashPassword)
}