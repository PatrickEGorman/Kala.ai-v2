import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {errorHandler, NotFoundError} from "@kala.ai/common";
import {createMachineRouter} from "./routes/catalog/create";
import {readMachineRouter} from "./routes/catalog/read";
import {updateMachineRouter} from "./routes/catalog/update";
import {deleteMachineRouter} from "./routes/catalog/delete";
import {listMachineRouter} from "./routes/catalog/list";
import {createInvMachineRouter} from "./routes/inventory/create";
import {listInvMachineRouter} from "./routes/inventory/list";
import {readInvMachineRouter} from "./routes/inventory/read";
import {updateInvMachineRouter} from "./routes/inventory/update";
import {deleteInvMachineRouter} from "./routes/inventory/delete";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createMachineRouter);
app.use(readMachineRouter);
app.use(updateMachineRouter);
app.use(deleteMachineRouter);
app.use(listMachineRouter);

app.use(createInvMachineRouter);
app.use(deleteInvMachineRouter);
app.use(listInvMachineRouter);
app.use(readInvMachineRouter);
app.use(updateInvMachineRouter);


app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};