const router = require('express').Router()
const Person = require('../models/Person')
const jwt = require('jsonwebtoken')
const secret = 'asjDKLJASKLDI!OP@#21kçk123.;'
const bcrypt = require('bcrypt')

const middlewareMulter = require('../middlewares/multer')

router.post('/validate',  (req, res) => {

    const { token } = req.body
    
    jwt.verify(token, secret, async (err, userInfo) => {
        if (err) {
            res.status(403).end();
            return;
        }

        const userFoundbyid = await Person.findOne({_id: userInfo.id}, '-password')

        if(!userFoundbyid){
           return res.status(404).json({msg: "Not Found"});
        }

        return res.status(200).json({user:userFoundbyid})
       
    })


})


router.post('/upload', middlewareMulter.single('file'), (req, res) => {


    const { token, option } = req.body
    const { file } = req
    
    const path = 'http://localhost:3000/src/assets/images/' + file.filename

    if(token){
        
        jwt.verify(token, secret, async (err, userFound) => {

            if(err){
               return res.status(400).json({msg: "Error token"})
            }
            if(option == 'perfil'){
                await Person.updateOne({_id: userFound.id}, {img: path})
                .then((user) => {
                    console.log(user)
                    res.status(200).json({msg: "Foto de Perfil Alterada"})
                })
                .catch((error) => {
                    res.status(500).json({msg: error})
                })
            }
            else if(option == 'capa'){

                await Person.updateOne({_id: userFound.id}, {capa: path})
                .then((user) => {
                    console.log(user)
                    res.status(200).json({msg: "Foto de Capa Alterada"})
                })
                .catch((error) => {
                    res.status(500).json({msg: error})
                })
            }
            

        })
    }
        //console.log(req.file);
       
})


router.post('/updatebio', (req,res) => {
    const { value, token } = req.body

    console.log(req.body)
    jwt.verify(token, secret, async (err, userFound)=>{

        if(err){
            return res.status(404).json({msg: 'Token invalido'})
        }

       await Person.updateOne({_id : userFound.id}, {bio : value})
       .then((okay) => {
           res.status(200).json({msg: "Bio atualizada"})
       })
       .catch(error => {
           res.status(500).json({err: error})
       })

       
    })
})




router.post('/updatePerfilData', (req, res) => {

    const {token, values} = req.body

    jwt.verify(token, secret, async (err, found) => {
        if(err){
            res.status(404).json({msg: 'Token Invalido'})
        }
        
        await Person.updateOne({_id: found.id}, {
            $set : {
                geo: values.geo,
                num : values.num,
                job: values.job
            }
        })
        .then(up => {
            res.status(200).json({msg: 'Dados atualizados'})
        })
        .catch(error=>{
            res.status(500).json({msg: error})
        })

        
    })

})



router.post('/addCertification', (req, res) => {

    const {token, values} = req.body

    if(!values.url){
        return res.status(422).json({msg: "É nescessário informar o link da certificação"})
    }
    
    jwt.verify(token, secret, async (err, found) => {
        if(err){
            res.status(404).json({msg: 'Token Invalido'})
        }

        const user = await Person.findOne({_id: found.id})

        const update = await user.certifications.push(values)
        
        if(!update){

            return res.status(500).json({msg: error}) 
            
        }

        await user.save()
        
        return res.status(200).json({msg: 'Dados atualizados'})
        
        
        
    })

})

router.post('/updatePersonalData', (req, res)=> {


    const { values, token } = req.body
    
    jwt.verify(token, secret, async (err, found) => {
        
        if(err) return res.status(422).json({msg: "Token não confere"})
        
        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash(values.password, salt); 

        await Person.updateOne({_id: found.id}, {
            $set: {

                name: values.name,
                email: values.mail,
                password: password
    
            }
        })
        .then(completed => [
            res.status(200).json({msg: "Dados Alterados", completed})
        ])
        .catch(error => {
            res.status(500).json({msg: "Erro interno", error})
        })

  
        
    })


})

router.post('/updateCertification', (req,res) => {

    const {id, token, values} = req.body
    
    jwt.verify(token, secret, async (err, found) => {

        if(err){
            return res.status(404).json({msg: err})
        }
        if(!values){
            return res.status(422).json({msg: "Os valores precisam ser preenchidos"})
        }
        const user = await Person.findOne({_id: found.id})

        if(!user){
            return res.status(404).json({msg: 'Usuário não encontrado'})
        }

        const update = await user.certifications.splice(id, 1, values)


        if(!update){
            res.status(500).json({msg: 'Erro do servidor'})
        }

        await user.save()

        res.status(200).json({msg: "Certificado Atualizado"})
    })
})

router.post('/whats', (req, res) => {


    const {token, num, option} = req.body
    
    const base = 'https://api.whatsapp.com/send?phone=55' + num

    

    jwt.verify(token, secret, async (err, found)=>{

        if(err) return res.status(422).json({msg: 'Token não confere'})

        if(option == 1){

            await Person.updateOne({_id: found.id}, { wwp: base})
            .then(completed => {
                res.status(200).json({msg: "WhatsApp Ativado", completed})
            })
            .catch(error => {
                res.status(500).json({msg: error})
            })
        }
        if(option == 0){
           
            await Person.updateOne({_id: found.id}, { wwp: ''})
            .then(completed => {
                res.status(200).json({msg: "WhatsApp Desativado", completed})
            })
            .catch(error => {
                res.status(500).json({msg: error})
            })
        }

    })


})

router.post('/addJobRelationShip', async (req, res) => {

    const { id, values, option } = req.body
    if(!id) { 
        return res.status(422).json({msg: 'Erro, envie um token válido e valores válidos'})
    }

    if(!option) {
        if(!values) return 422;

        const user = await Person.findOne({_id: id})

        if(!user){
            return res.status(500).json({msg: 'Erro interno'})
        }
        
        const arr = Object.values(values);
        const jobs = user.JobRelationsShip[0] ? Object.values(user.JobRelationsShip[0]) : ''

        if(jobs.length == 5) {

            return res.status(403).json({msg: 'Maximo de relações atingidas'});

        }

        if(jobs.length > 0 ){
            
            const aux = jobs.concat(arr)
            const add = Object.assign({}, aux);

            const update = await user.JobRelationsShip.pop()

            if(update){
                const updated = await user.JobRelationsShip.push(add)
                if(updated){

                    await user.save();

                    return res.status(200).json("Adicionado")
                }
                else {
                    return res.status(500)
                }
            }

        } 
        else {
            const add = await user.JobRelationsShip.push(values)

            if(!add){
                return res.status(500)
            }

            await user.save()
    
            res.status(200).json({msg: "Categorias adicionadas"})
        }

    }

    else {
        
            const user = await Person.findOne({_id: found.id})
    
            if(!user){
                return res.status(404).json({msg: 'Usuário não encontrado'})
            }
    
            const del = await user.JobRelationsShip.splice(id, 1)
    
            if(!del){
                res.status(500).json({msg: 'Erro do servidor'})
            }
    
            await user.save()
    
            res.status(200).json({msg: "Removido"})
        
        }


   
})

module.exports = router 