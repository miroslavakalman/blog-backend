import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { loginValidation, postCreateValidation, registerValidation } from './validations.js';

import { handleValidationErrors,checkAuth }from './utils/index.js';

import  {UserController, PostController} from './controllers/index.js';
import User from './models/User.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.qw46vkw.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>console.log('DB is OK!'))
    .catch((err)=> console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json ({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/posts/search', PostController.getPostsByTag);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors,  PostController.update);

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err);
    }
    console.log('Server OK')
});