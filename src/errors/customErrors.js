class CustomError extends Error {
    constructor(message) {
      super(message);
     // Ensure the name of this error is the same as the class name
      this.name = this.constructor.name;
     // This clips the constructor invocation from the stack trace.
     // It's not absolutely essential, but it does make the stack trace a little nicer.
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends CustomError {
    constructor(message) {
        super(message);
    }
  }
  
  class InternalError extends CustomError {
    constructor(error) {
      super(error.message);
      this.data = { error };
    }
  }
  
  module.exports = {
    ValidationError,
    InternalError,  
  };