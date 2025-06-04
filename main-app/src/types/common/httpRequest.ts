export enum HttpRequestMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}
export interface HttpRequest {
  service: RequestService;
  url: string;
  method: HttpRequestMethod;
  authorization?: Auth;
  body?: unknown;
  contentType?: string;
}

export interface HttpError {
  status: number;
  statusText: string;
}

export enum RequestService {
  VCash = "VCash",
}

export enum Auth {
  Sales = "sales",
  Agent = "agent",
  Cashier = "cashier",
  POS = "pos",
}
