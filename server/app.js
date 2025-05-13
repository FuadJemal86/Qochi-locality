const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminRoute = require('./Router/adminRoute')
const userRoute = require('./Router/userRoute')




const app = express()


app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}))


app.use('/admin', adminRoute)
app.use('/user', userRoute)



app.listen(3032, () => {
    console.log('server is listn on port 3034')
})