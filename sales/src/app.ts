import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {errorHandler, NotFoundError} from "@kala.ai/common";


const app = express();
app.set('trust proxy', true);
app.use(json());


app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);


export {app};
