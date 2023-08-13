import VError from 'verror';

export class IMDBError extends VError {}
export class DriverNotSupported extends IMDBError {}
export class ResultIsNotACollection extends IMDBError {}
