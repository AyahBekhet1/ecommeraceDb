import connectionDB from "../db/connection.js";
import { AppError } from "../src/utils/classError.js";
import { GlobalErrorHandler } from "../src/utils/asyncHandler.js";
import * as routers from "./modules/index.routes.js";
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js";
import { deleteFromDb } from "./utils/deleteFromDb.js";
import cors from 'cors'



export const initApp = (express, app) => {


    app.use(cors())
    app.use((req,res,next)=>{
        if(req.originalUrl == '/order/webhook'){
            next()
        }else{
            express.json()(req,res,next)
        }
    });

    app.get('/',(req,res)=>{
        res.status(200).json({msg:"hello on my project"})
    })


    app.use('/user' , routers.userRouter)
    app.use('/category' , routers.categoryRouter)
    app.use('/subCategory' , routers.subCategoryRouter)
    app.use('/brand' , routers.brandRouter)
    app.use('/product' , routers.productRouter)
    app.use('/coupon' , routers.couponRouter)
    app.use('/cart' , routers.cartRouter)
    app.use('/order' , routers.orderRouter)
    app.use('/review' , routers.reviewRouter)
    app.use('/wishlist' , routers.wishlistRouter)

    //connect to db
    connectionDB()

    //handle invalid URLs.
    app.use("*", (req, res, next) => {
        next(new AppError(`inValid url ${req.originalUrl}`))
    })

    //GlobalErrorHandler
    app.use(GlobalErrorHandler , deleteFromCloudinary , deleteFromDb)


  

}


