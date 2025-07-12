import {Router} from 'express'
import userRouter from './user.js'
import adminRouter from './admin.js'

const routes = Router()

routes.get('/', (req, res)=>{
    res.json({
        message: "hello"
    })
})
routes.use('/user', userRouter)
routes.use('/admin', adminRouter)

export default routes
