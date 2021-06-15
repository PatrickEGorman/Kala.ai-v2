import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {NotFoundError, errorHandler} from "@kala.ai/common";
import {createMaterialRouter} from "./routes/create";
import {readMaterialRouter} from "./routes/read";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createMaterialRouter);
app.use(readMaterialRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};