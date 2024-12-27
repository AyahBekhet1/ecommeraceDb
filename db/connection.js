import mongoose from "mongoose";


const connectionDB = async () => {
    return await mongoose.connect(process.env.DB_URL_ONLINE )
        .then(() => {
            console.log(`connected to database on ${process.env.DB_URL_ONLINE}`)
        }).catch((err) => {
            console.log({ msg: "fail to connect", err })
        })
}

export default connectionDB