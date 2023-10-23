import  jwt  from "jsonwebtoken";

const generarJWT = (id) => {
    console.log("TOKEN generado");
    return jwt.sign( {id}, process.env.JWT_SECRET, {
        expiresIn: "30d", 
    });
}

export default generarJWT;