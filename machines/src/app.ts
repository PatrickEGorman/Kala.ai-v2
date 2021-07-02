import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {NotFoundError, errorHandler} from "@kala.ai/common";
import {createMachineRouter} from "./routes/create";
import {readMachineRouter} from "./routes/read";
import {updateMachineRouter} from "./routes/update";
import {deleteMachineRouter} from "./routes/delete";
import {listMachineRouter} from "./routes/list";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createMachineRouter);
app.use(readMachineRouter);
app.use(updateMachineRouter);
app.use(deleteMachineRouter);
app.use(listMachineRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};