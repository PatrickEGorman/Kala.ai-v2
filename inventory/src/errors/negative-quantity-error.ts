import {CustomError} from "@kala.ai/common";

export class NegativeQuantityError extends CustomError{
    statusCode = 400

    constructor() {
        super('Cumulative quantity cannot be negative');
        Object.setPrototypeOf(this, NegativeQuantityError.prototype)
    }

    serializeErrors() {
        return [{message: 'Cumulative quantity cannot be negative'}];
    }
}