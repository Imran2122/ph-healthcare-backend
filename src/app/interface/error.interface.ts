export  interface TErrorSources {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  statusCode?:number;
  stack?:string,
  message: string;
  errorSourses: TErrorSources[];
  error?: unknown;
}