import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {NotFoundError, errorHandler} from "../../common/src";
import {createStepRouter} from "./routes/steps/create";
import {readStepRouter} from "./routes/steps/read";
import {listStepRouter} from "./routes/steps/list";
import {updateStepRouter} from "./routes/steps/update";
import {deleteStepRouter} from "./routes/steps/delete";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(errorHandler);
app.use(createStepRouter);
app.use(readStepRouter);
app.use(listStepRouter);
app.use(updateStepRouter);
app.use(deleteStepRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

export {app};