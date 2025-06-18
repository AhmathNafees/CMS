import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import branchRouter from './routes/branch.js'
import branchAdmin from './routes/branchAdmin.js'
import settingRouter from './routes/setting.js'
import customerRouter from './routes/customer.js'
import customerCareRouter from './routes/customercare.js'

connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))
app.use(express.static('public/customers'))
app.use(express.static('public/passports'))
app.use('/api/auth', authRouter)
app.use('/api/branch',branchRouter)
app.use('/api/branchAdmin',branchAdmin)
app.use('/api/customerCare',customerCareRouter)
app.use('/api/setting',settingRouter)
app.use('/api/customer',customerRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is runnig on port ${process.env.PORT}`)
})

app.use((err, req, res, next) => {
    console.error("Global error:", err.stack)
    res.status(500).json({ success: false, error: "Server error" })
})
