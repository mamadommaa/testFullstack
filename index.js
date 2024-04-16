import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
    .connect("mongodb+srv://mamadommaa:vsue4NSnDONV5HgA@cluster0.uxhl5cq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
    console.log('DBВВ ок')
    })
    .catch((err) => {
        console.log('DB ersror' , err)
    });

let app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello hello hello!')
// });

app.post('/auth/register', (req, res) => {
    // console.log(req.body)

    // const token = jwt.sign({
    //     email: req.body.email,
    //     fullName: 'Вася Пупкин',
    // }, 'secret123')

    // res.json({
    //     success: true,
    //     token
    // })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Servser OK!')
})