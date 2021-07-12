import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {errorHandler, NotFoundError} from "@kala.ai/common";

import {createMaterialRouter} from "./routes/catalog/create";
import {readMaterialRouter} from "./routes/catalog/read";
import {updateMaterialRouter} from "./routes/catalog/update";
import {deleteMaterialRouter} from "./routes/catalog/delete";
import {listMaterialRouter} from "./routes/catalog/list";

import {createInvMaterialRouter} from "./routes/inventory/create";
import {readInvMaterialRouter} from "./routes/inventory/read";
import {updateInvMaterialRouter} from "./routes/inventory/update";
import {deleteInvMaterialRouter} from "./routes/inventory/delete";
import {listInvMaterialRouter} from "./routes/inventory/list";

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createMaterialRouter);
app.use(readMaterialRouter);
app.use(listMaterialRouter);
app.use(updateMaterialRouter);
app.use(deleteMaterialRouter);

app.use(createInvMaterialRouter);
app.use(readInvMaterialRouter);
app.use(deleteInvMaterialRouter);
app.use(updateInvMaterialRouter);
app.use(listInvMaterialRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);


export {app};
