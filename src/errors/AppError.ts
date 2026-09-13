export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name; //this.constructor refers to the object constructor that calls, for eg: sub class calls and the subclasses constructor name will be assigned
    this.statusCode = statusCode;
  }
}
