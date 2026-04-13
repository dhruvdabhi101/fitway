import { NextResponse } from "next/server";

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    { data, error: null },
    { status }
  );
}

export function errorResponse(
  message: string,
  code: string = "INTERNAL_ERROR",
  status = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      data: null,
      error: { code, message, details },
    },
    { status }
  );
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, "UNAUTHORIZED", 401);
}

export function notFoundResponse(message = "Not found") {
  return errorResponse(message, "NOT_FOUND", 404);
}

export function validationErrorResponse(details?: unknown) {
  return errorResponse("Validation failed", "VALIDATION_ERROR", 400, details);
}
