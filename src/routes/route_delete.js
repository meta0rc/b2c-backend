const router = require('express').Router()
const Person = require('../models/Person')
const jwt = require('jsonwebtoken')
const secret = 'asjDKLJASKLDI!OP@#21kçk123.;'


router.post('/removeCertification', (req,res) => {

    const {id, token} = req.body
    
    jwt.verify(token, secret, async (err, found) => {

        if(err){
            return res.status(404).json({msg: err})
        }

        const user = await Person.findOne({_id: found.id})

        if(!user){
            return res.status(404).json({msg: 'Usuário não encontrado'})
        }

        const del = await user.certifications.splice(id, 1)


        if(!del){
            res.status(500).json({msg: 'Erro do servidor'})
        }

        await user.save()

        res.status(200).json({msg: "Removido"})
    })
})

module.exports = router