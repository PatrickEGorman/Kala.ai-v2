import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {errorHandler, NotFoundError} from "@kala.ai/common";

import {createStepRouter} from "./routes/steps/create";
import {readStepRouter} from "./routes/steps/read";
import {listStepRouter} from "./routes/steps/list";
import {updateStepRouter} from "./routes/steps/update";
import {deleteStepRouter} from "./routes/steps/delete";
import {createProductRouter} from "./routes/products/create";
import {deleteProductRouter} from "./routes/products/delete";
import {readProductRouter} from "./routes/products/read";
import {listProductRouter} from "./routes/products/list";
import {updateProductRouter} from "./routes/products/update";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createStepRouter);
app.use(readStepRouter);
app.use(listStepRouter);
app.use(updateStepRouter);
app.use(deleteStepRouter);

app.use(createProductRouter);
app.use(readProductRouter);
app.use(listProductRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};
