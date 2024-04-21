import express from 'express';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postCreateValidator } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect("mongodb+srv://mamadommaa:vsue4NSnDONV5HgA@cluster0.uxhl5cq.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
    console.log('DB работает супер')
    })
    .catch((err) => {
        console.log('DB ersror' , err)
    });

let app = express();
app.use(express.json());

app.post('/auth/register', registerValidator, UserController.register)
app.post('/auth/login',loginValidator,  UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)


app.post('/posts', checkAuth,  postCreateValidator, PostController.create)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Servser работает супер')
})


