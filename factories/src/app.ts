import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser'
import {errorHandler, NotFoundError} from "@kala.ai/common";
import {createFactoryRouter} from "./routes/create";
import {listFactoryRouter} from "./routes/list";
import {readFactoryRouter} from "./routes/read";
import {updateFactoryRouter} from "./routes/update";
import {deleteFactoryRouter} from "./routes/delete";


const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createFactoryRouter);
app.use(deleteFactoryRouter);
app.use(listFactoryRouter);
app.use(readFactoryRouter);
app.use(updateFactoryRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};
