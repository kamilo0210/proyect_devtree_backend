// Unit test created by Juan Pablo

import { hashPassword } from "../utils/auths";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("fakeSalt"),
  hash: jest.fn().mockResolvedValue("hashedPass"),
}));

describe("hashPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate salt and hash password correctly", async () => {
    const result = await hashPassword("123456");

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", "fakeSalt");
    expect(result).toBe("hashedPass");
  });

  it("should propagate error if hashing fails", async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error("Hash failed"));

    await expect(hashPassword("abc")).rejects.toThrow("Hash failed");
  });
});