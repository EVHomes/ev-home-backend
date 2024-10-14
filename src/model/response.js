import httpStatus from "http-status";

export function successRes(status, message, data, code) {
  return {
    status: status || 200,
    code: code || `response-code-${status}`,
    message,
    ...data,
  };
}

export function errorRes(status, message, code) {
  return {
    status: status,
    code: code || `response-code-${status}`,
    message: message || httpStatus[`${status}_MESSAGE`],
  };
}
