import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import userRoutes from './Routes/user.routes.js';
import courseRoutes from './Routes/course.routes.js';
import errorMiddleware from './Middlewares/errorMiddleware.js';
import { updateUser } from './Controllers/user.controller.js';
// import { errorMonitor } from 'nodemailer/lib/xoauth2/index.js';
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping', function(req, res){
    res.send('/pong');
})

//  routes of 3 modules
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);

app.all('*', (req, res) => {
    res.status(404).send('OOPS!! 404 page not found');
})

// Example Express.js route setup
app.post('/users/:userId', updateUser);

app.use(errorMiddleware);

export default app;