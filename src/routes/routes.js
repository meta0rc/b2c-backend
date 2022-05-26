const express = require('express')
const routes = express()
const route_delete = require('./route_delete')
const route_user_auth = require('./route_user_auth')
const route_user_all = require('./route_user_all')
const route_get = require('./route_get')

routes.use(route_user_auth)
routes.use(route_user_all)
routes.use(route_delete)
routes.use(route_get)


module.exports = routes





