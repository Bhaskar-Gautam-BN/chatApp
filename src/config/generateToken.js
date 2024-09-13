import jwt from 'jsonwebtoken'

const generateToken =(user)=>{
    // console.log(user)
    return jwt.sign({id:user._id,name:user.name},process.env.SECRET_KEY,{
        expiresIn:'30d'
    })
}

export default generateToken