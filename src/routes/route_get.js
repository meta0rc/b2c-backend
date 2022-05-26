const router = require('express').Router()
const Person = require('../models/Person')

router.get('/user/:id', async (req,res)=> {

    const id = req.params.id
    
    console.log(id)

    const userFound = await Person.findOne({_id: id}, '-password')

    if(!userFound){
        return res.status(404).json({msg: "Usuário não encontrado"})
    }

    console.log(userFound)
    return res.status(200).json({user: userFound})

})

router.get('/feed', async (req, res) => {

    
    const premiumFound = await Person.find({premium: true}, '-password')

    if(!premiumFound){
        return res.status(500).json({error: 'Problem system'})
    }
    
    const premiuMString = JSON.stringify(premiumFound)
    const premiums = JSON.parse(premiuMString)

    console.log((premiums))
    return res.status(200).json({premiums:premiums })

   
})


module.exports = router