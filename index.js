const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const posts = require('./routes/post.routes');
const users = require('./routes/user.routes');
const redis = require('redis')
const session = require('express-session')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
})

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, } = require('./congif/config');
const port = process.env.PORT || 8080;

const connectWithRetry = () => {
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log("mongoDb connected successfully");
    }).catch((err) => {
        console.log(err);
        setTimeout(connectWithRetry, 5000);
    })
}
connectWithRetry()
app.use(cors());
app.enable("trust proxy");

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'keyboard cat',
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 60000
        }
    })
)


app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get("/api", (req, res) => {
    console.log("Api hit11");
    res.send("Hi there1")
})
app.use('/api/v1/user', users)
app.use('/api/v1/posts', posts)

app.listen(port, () => {
    console.log(`server started at ${port}`);
})