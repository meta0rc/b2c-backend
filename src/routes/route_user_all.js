const router = require('express').Router()
const Person = require('../models/Person')
const jwt = require('jsonwebtoken')
const secret = 'asjDKLJASKLDI!OP@#21kçk123.;'
const bcrypt = require('bcrypt')


router.post('/login', async (req, res) => {

    const { email, password } = req.body

    if(!email) { 
        return res.status(422).json({msg: "Email is obrigatory"})
    }
    if(!password) { 
        return res.status(422).json({msg: "password is obrigatory"})
    }

    const user = await Person.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "User not found "})
    } 
    
    await bcrypt.compare(password, user.password)
    .then((compared)=>{
        if(compared){
            const token = jwt.sign( {id: user._id}, secret )
            console.log(user)
            return res.status(200).json({
                user: { 
                    name: user.name, 
                    email: user.email, 
                    token: token,
                    img: user.img,
                    job: user.job,
                    geo: user.geo,
                    bio: user.description,
                    avaliabe: user.avaliabe,
                    contact: user.contact,
                    certifications: user.certifications,
                    capa: user.capa,
                    whats: user.wwp
                }})
        }
        else{
            return res.status(422).json({msg: "Pass invalid"})
        }
    })
    .catch((err)=>{

        return res.json({msg: "catch", err})

    })


})



router.post('/register', async(req, res) =>{

    const {name, email, password, confirmPassword, job, geo } = req.body

    if(!name){
        return res.status(422).json({msg: "O nome é Obrigátorio"})
    }

    if(!email){
        return res.status(422).json({msg: "Email é obrigatório"})
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória"})
    }
    if(!job) {
        return res.status(422).json({msg: "Informe o serviço prestado"})
    }
    if(!geo) {
        return res.status(422).json({msg: "A Localizão de trabalho é obrigatória"})
    }
    if(password != confirmPassword) { 
          return res.status(422).json({msg: "The pass not coincide"})
        
    }

    const userExists = await Person.findOne({email: email})

    if(userExists) {
        return res.status(422).json({msg: "User exists, please try other mail"})
    }
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new Person({
        name, 
        email,
        password: passwordHash, 
        job, 
        geo,
        premium : false
    })

    try{
        await user.save();
        
        res.status(201).json({msg: "user Created"})
    }
    catch(error){
        res.status(500).json({msg: error})
    }

    
    res.status(200).json({msg: 'tdo certo'})
})




router.post('/addEvaluetion', async (req, res)=>{
    

    const {values, id} = req.body

    console.log(values)

    const user = await Person.findOne({_id: id}) 


    if(!user){
        return res.status(422).json({msg: 'Erro, identificador inválido'})
    }

    const updated = await user.avaliables.push(values)

    if(!updated){
        return res.status(500).json({msg: 'Erro interno'})
    }

    await user.save()

 

    return res.status(200).json({msg: 'Avaliação adicionada'})

})

router.post('/search', async(req, res) => {
    
    const { job } = req.body

    const users = await Person.find({$text: {$search: job}}, '-password')

    if(users.length > 0){
        return res.status(200).json({users})
    }
    const two = await Person.find({}, '-password')

    const arr = Object.values(two);

    function fil(value){

        const vall = Object.values(value.JobRelationsShip);

        if(vall.length > 0){
          
            if(Object.values(vall[0]).includes(job)){
                return value;
            }

        }
    }

    const filtered = arr.filter(fil)

    if(filtered.length > 0) {

        return res.status(200).json({filtered})
    }
    else {
        return res.status(404).json({err: "Nenhum usuário encontrado"});
    }

})


module.exports = router





