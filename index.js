import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidator } from './validations/auth.js'
import { validationResult } from 'express-validator';
import UserModel from './models/User.js'
import bcrypt from 'bcrypt';


// подкчлючаемся к базе данных и проверяем статус подключения в терминале

mongoose
    .connect("mongodb+srv://mamadommaa:vsue4NSnDONV5HgA@cluster0.uxhl5cq.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
    console.log('DB работает супер')
    })
    .catch((err) => {
        console.log('DB ersror' , err)
    });


//  создаём express прилоежние для создания веб приложений на node.js
let app = express();
// разрашем прилоежнию express пользоваться json
app.use(express.json());


// обрабатываем регистрационные данные пользователя + сохраняем их в базе данных
app.post('/auth/register', registerValidator, async (req, res) => {
    try {
         const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    })

        const user = await doc.save();
        
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            },
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удаллось зарегистрироваться"
        })    
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            })
        }

         const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            },
        );
         const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
    });

    } catch (err) {
         console.log(err);
        res.status(500).json({
            message: "Не удаллось авторизоваться"
        })    
    }
})



// слушаем как работает сам сервер
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Servser работает супер')
})