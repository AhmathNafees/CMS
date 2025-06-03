import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import branchRouter from './routes/branch.js'

connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/branch',branchRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is runnig on port ${process.env.PORT}`)
})
