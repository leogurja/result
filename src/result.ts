// oxlint-disable no-unused-vars

interface IResult<T, E = Error> {
  /**
   * Checks if the result is an Ok.
   *
   * @returns True if the result is an Ok, false otherwise.
   */
  isOk(): this is Ok<T>;
  // isOkAnd(fn: (value: T) => boolean): this is Ok<T>;

  /**
   * Checks if the result is an Err.
   *
   * @returns True if the result is an Err, false otherwise.
   */
  isErr(): this is Err<E>;
  // isErrAnd(fn: (error: E) => boolean): this is Err<E>;

  map<U>(fn: (value: T) => U): Result<U, E>;
  mapOr<U>(fn: (value: T) => U, defaultValue: U): U;

  inspect(fn: (value: T) => void): this;
  inspectErr(fn: (error: E) => void): this;

  and<U>(other: Result<U, E>): Result<U, E>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;

  or<F>(other: Result<T, F>): Result<T, F>;
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  unwrap(): T;
  unwrapErr(): E;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fn: (error: E) => T): T;

  match<U>(onOk: (value: T) => U, onErr: (error: E) => U): U;
}

export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T) {
  return new Ok(value);
}

export function err<E = Error>(error: E) {
  return new Err(error);
}

export class Ok<T> implements IResult<T, never> {
  readonly error = null;

  constructor(readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Err<never> {
    return false;
  }

  map<U>(fn: (value: T) => U) {
    return ok(fn(this.value));
  }

  mapOr<U>(fn: (value: T) => U, defaultValue: U) {
    return fn(this.value);
  }

  inspect(fn: (value: T) => void) {
    fn(this.value);
    return this;
  }

  inspectErr(fn: (error: never) => void) {
    return this;
  }

  and<U>(other: Result<U, never>) {
    return other;
  }

  andThen<U, F>(fn: (value: T) => Result<U, F>) {
    return fn(this.value);
  }

  or<F>(other: Result<T, F>) {
    return this;
  }

  orElse<F>(fn: (error: never) => Result<T, F>) {
    return this;
  }

  unwrap() {
    return this.value;
  }

  unwrapErr(): never {
    throw new Error("Called `unwrapErr` on an `Ok` value", { cause: this });
  }

  unwrapOr(defaultValue: T) {
    return this.value;
  }

  unwrapOrElse(fn: (error: never) => T) {
    return this.value;
  }

  match<U>(onOk: (value: T) => U, onErr: (error: never) => U) {
    return onOk(this.value);
  }
}

export class Err<E = Error> implements IResult<never, E> {
  readonly value = null;

  constructor(readonly error: E) {}

  isOk(): this is Ok<never> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  map(_fn: (value: never) => unknown) {
    return this;
  }

  mapOr<U>(fn: (value: never) => U, defaultValue: U) {
    return defaultValue;
  }

  inspect(fn: (value: never) => void) {
    return this;
  }

  inspectErr(fn: (error: E) => void) {
    fn(this.error);
    return this;
  }

  and<U>(other: Result<U, never>) {
    return this;
  }

  andThen<U, F>(fn: (value: never) => Result<U, F>): Result<U, E> {
    return this;
  }

  or<T, F>(other: Result<T, F>) {
    return other;
  }

  orElse<T, F>(fn: (error: E) => Result<T, F>) {
    return fn(this.error);
  }

  unwrap(): never {
    throw new Error("Called `unwrap` on an `Err` value", { cause: this });
  }

  unwrapErr() {
    return this.error;
  }

  unwrapOr<T>(defaultValue: T) {
    return defaultValue;
  }

  unwrapOrElse<T>(fn: (error: E) => T) {
    return fn(this.error);
  }

  match<U>(onOk: (value: never) => U, onErr: (error: E) => U) {
    return onErr(this.error);
  }
}
