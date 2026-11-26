export class WishlistRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "WishlistRequestError";
    this.status = status;
  }
}
