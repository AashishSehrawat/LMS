
class ApiError<T> extends Error {
  statusCode: number;
  message: string;
  errors: any[];
  success: boolean;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    // Restore prototype chain (important for custom Error classes)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}


export default ApiError;
