import mongoose from "mongoose";
import { ZodError } from "zod";

export const isZodError = ( error ) =>
{
    return error && typeof error === "object" && "issues" in error && Array.isArray(error.issues);
};

export function parseZodError(error){
    if (!(error instanceof ZodError)) return [];

    const formatted = error.format();
    const issues = [];

    for (const key in formatted) {
        if (key === "_errors") continue;

        const fieldErrors = formatted[key]?._errors;
        if (fieldErrors && fieldErrors.length > 0) {
            fieldErrors.forEach((msg) => {
                issues.push({
                    field: key,
                    message: msg,
                });
            });
        }
    }

    return issues;
};


export const isValidObjectId = ( id ) =>
{
    return mongoose.Types.ObjectId.isValid( id );
};