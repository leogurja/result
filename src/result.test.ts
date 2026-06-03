// oxlint-disable vitest/no-disabled-tests no-unused-vars

import { describe, expect, it } from "vitest";
import { vi } from "vitest";

import { Err, Ok, ok, err, type Result } from "./result";

describe("Result", () => {
  describe("ok", () => {
    it("creates Ok with a primitive value", () => {
      const result = ok(42);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toBe(42);
    });

    it.skip("unwraps Result passed as value", () => {
      const inner = ok("valor");
      const outer = ok(inner);

      expect(outer).toBe(inner);
      expect(outer.isOk()).toBe(true);
      expect(outer.value).toBe("valor");
    });

    it.skip("unwraps Err passed as value", () => {
      const inner = err("erro");
      const outer = ok(inner);

      expect(outer).toBe(inner);
      expect(outer.isErr()).toBe(true);
    });
  });

  describe("err", () => {
    it("creates Err with an error", () => {
      const result = err("falhou");

      expect(result).toBeInstanceOf(Err);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("falhou");
    });

    it.skip("unwraps Result passed as error", () => {
      const inner = ok(1);
      const outer = err(inner);

      expect(outer).toBe(inner);
      expect(outer.isOk()).toBe(true);
    });

    it.skip("unwraps Err passed as error", () => {
      const inner = err("original");
      const outer = err(inner);

      expect(outer).toBe(inner);
      expect(outer.isErr()).toBe(true);
      expect(outer.error).toBe("original");
    });
  });

  describe("isOk", () => {
    it("should be true if the result is an Ok", () => {
      const result = ok(2);
      expect(result.isOk()).toBe(true);
    });

    it("should be false if the result is an Err", () => {
      const result = err(2);
      expect(result.isOk()).toBe(false);
    });
  });

  describe("isErr", () => {
    it("should be true if the result is an Err", () => {
      const result = err(2);
      expect(result.isErr()).toBe(true);
    });

    it("should be false if the result is an Ok", () => {
      const result = ok(2);
      expect(result.isErr()).toBe(false);
    });
  });

  describe("map", () => {
    it("maps value if Ok", () => {
      const result = ok(2).map((n) => n * 3);

      expect(result).toBeInstanceOf(Ok);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(6);
    });

    it.skip("propagates Result returned by callback", () => {
      const nested = err("failed");
      const result = ok(10).map(() => nested);

      expect(result).toBe(nested);
      expect(result.isErr()).toBe(true);
    });

    it("chains transformations in the correct order", () => {
      const result = ok(1)
        .map((n) => n + 1)
        .map((n) => n * 2);

      const other = ok(1)
        .map((n) => n * 2)
        .map((n) => n + 1);

      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(4);
      expect(other.value).toBe(3);
    });

    it("returns itself if Err", () => {
      const original = err("error");
      const result = original.map(() => "some return value");
      expect(result).toBe(original);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("error");
    });
  });

  describe("mapOr", () => {
    it("returns the value if Ok", () => {
      const result = ok(2).mapOr((n) => n * 3, 10);
      expect(result).toBe(6);
    });

    it("returns the default value if Err", () => {
      const result = err("error").mapOr((n) => n * 3, 10);
      expect(result).toBe(10);
    });
  });

  describe("inspect", () => {
    it("calls the callback with the value if Ok", () => {
      const result = ok(2);
      const callback = vi.fn<() => void>();
      result.inspect(callback);
      expect(callback).toHaveBeenCalledWith(2);
    });

    it("does not call the callback if Err", () => {
      const result = err("error");
      const callback = vi.fn<() => void>();
      result.inspect(callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("inspectErr", () => {
    it("does not call the callback if Ok", () => {
      const result = ok(2);
      const callback = vi.fn<() => void>();
      result.inspectErr(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("calls the callback with the error if Err", () => {
      const result = err("error");
      const callback = vi.fn<() => void>();
      result.inspectErr(callback);
      expect(callback).toHaveBeenCalledWith("error");
    });
  });

  describe("and", () => {
    it("returns the other if Ok", () => {
      const result = ok(2);
      const other = ok(3);

      expect(result.and(other)).toBe(other);
    });

    it("returns itself if Err", () => {
      const result = err("error");
      const other = ok(3);
      expect(result.and(other)).toBe(result);
    });
  });

  describe("andThen", () => {
    it("returns the result of the Ok callback if Ok", () => {
      const result = ok(2);
      const callback = vi.fn<(val: number) => Result<number, never>>(() => ok(3));
      const result2 = result.andThen(callback);
      expect(callback).toHaveBeenCalledWith(2);
      expect(result2.unwrap()).toBe(3);
    });

    it("returns the result of the Err callback if Ok", () => {
      const result: Result<number, string> = ok(2);
      const callback = vi.fn<(v: number) => Result<number, string>>(() => err("error"));
      const result2 = result.andThen(callback);

      expect(callback).toHaveBeenCalledWith(2);
      expect(result2.isErr()).toBe(true);
      expect(result2.error).toBe("error");
    });

    it("returns itself if Ok", () => {
      const result = err("error");
      const callback = vi.fn<(val: number) => Result<number, never>>(() => ok(3));
      const result2 = result.andThen(callback);
      expect(callback).not.toHaveBeenCalled();
      expect(result2).toBe(result);
    });
  });

  describe("or", () => {
    it("returns itself if Ok", () => {
      const result = ok(2);
      const other = ok(3);
      expect(result.or(other)).toBe(result);
    });

    it("returns the other if Err", () => {
      const result = err("error");
      const other = ok(3);
      expect(result.or(other)).toBe(other);
    });
  });

  describe("orElse", () => {
    it("returns itself if Ok", () => {
      const result = ok(2);
      const callback = vi.fn<(val: number) => Result<number, string>>(() => ok(3));
      const result2 = result.orElse(callback);
      expect(callback).not.toHaveBeenCalled();
      expect(result2.unwrap()).toBe(2);
    });

    it("returns the result of the callback if Err", () => {
      const result: Result<number, string> = err("error");
      const callback = vi.fn<(v: string) => Result<number, number>>(() => err(3));
      const result2 = result.orElse(callback);
      expect(callback).toHaveBeenCalledWith("error");
      expect(result2.unwrapErr()).toBe(3);
    });
  });

  describe("unwrap", () => {
    it("returns the value if Ok", () => {
      const result = ok(2);
      expect(result.unwrap()).toBe(2);
    });

    it("throws an error if Err", () => {
      const result = err("error");
      expect(() => result.unwrap()).toThrow("Called `unwrap` on an `Err` value");
    });
  });

  describe("unwrapErr", () => {
    it("throws an error if Ok", () => {
      const result = ok(2);
      expect(() => result.unwrapErr()).toThrow("Called `unwrapErr` on an `Ok` value");
    });

    it("returns the error if Err", () => {
      const result = err("error");
      expect(result.unwrapErr()).toBe("error");
    });
  });

  describe("unwrapOr", () => {
    it("returns the value if Ok", () => {
      const result = ok(2);
      expect(result.unwrapOr(3)).toBe(2);
    });

    it("returns the default value if Err", () => {
      const result = err("error");
      expect(result.unwrapOr(3)).toBe(3);
    });
  });

  describe("unwrapOrElse", () => {
    it("returns the value if Ok", () => {
      const result = ok(2);
      const callback = vi.fn<(val: number) => number>(() => 3);
      expect(result.unwrapOrElse(callback)).toBe(2);
      expect(callback).not.toHaveBeenCalled();
    });

    it("returns the result of the callback if Err", () => {
      const result = err("error");
      const callback = vi.fn<(val: string) => number>(() => 3);
      expect(result.unwrapOrElse(callback)).toBe(3);
      expect(callback).toHaveBeenCalledWith("error");
    });
  });

  describe("match", () => {
    it("returns the value if Ok", () => {
      const result = ok("value");
      const onOk = vi.fn<(val: string) => number>(() => 3);
      const onErr = vi.fn<(val: string) => number>(() => 0);
      expect(result.match(onOk, onErr)).toBe(3);
      expect(onOk).toHaveBeenCalledWith("value");
      expect(onErr).not.toHaveBeenCalled();
    });

    it("returns the value if Err", () => {
      const result = err("value");
      const onOk = vi.fn<(val: string) => number>(() => 3);
      const onErr = vi.fn<(val: string) => number>(() => 0);
      expect(result.match(onOk, onErr)).toBe(0);
      expect(onOk).not.toHaveBeenCalled();
      expect(onErr).toHaveBeenCalledWith("value");
    });
  });
});
