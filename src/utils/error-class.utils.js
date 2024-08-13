export class ErrorHandleClass{
    constructor(message , status , stack){
        this.message = message;
        this.status = status;
        this.stack = stack ? stack:null ;
    }
}