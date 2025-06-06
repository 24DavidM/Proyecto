import { sendMailToRegister } from "../config/nodemailer";
import Estudiante from "../models/Estudiante";

const registro = async (req,res) => {
    
    const {email,password} = req.body

    //Verifica que no exista campo vacios
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todo los campos"})
    
    //Verifica si existe algun correo en el base de datos
    const verificarEmailBDD = await Estudiante.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos el email ya que se encuentra registrado"})
    
    //Encriptar la contraseña
    const nuevoEstudiante = new Estudiante(req.body)
    nuevoEstudiante.password = await nuevoEstudiante.encrypPassword(password)

    //Crer un token
    const token = nuevoEstudiante.createToken()

    //Enviar correo y guardar estudiante nuevo
    sendMailToRegister(email,token)
    await nuevoEstudiante.save()
    res.status(200).json({msg:"Revisa tu correo electronico para verificar tu cuenta"})

}

export {
    registro
}