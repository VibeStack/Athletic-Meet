class ApiResponse {
  constructor(data = null, message = "Success") {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
