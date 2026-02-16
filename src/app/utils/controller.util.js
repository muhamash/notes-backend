export const asyncHandler = ( fn ) =>
    ( req, res, next)=>
    {
        return Promise.resolve( fn( req, res, next ) ).catch( ( error ) =>
        {
            // console.error( error, "async handler function" );
            next( error );
        } );
};


export const responseFunction = ( res, data) =>
{
    res.status( data.statusCode ).json( {
        message: data.message,
        statusCode: data.statusCode,
        meta: data.meta,
        data: data.data
    } );
};

export const parsedDataFn = ( data ) =>
{
    return JSON.parse( JSON.stringify( data ) );
}