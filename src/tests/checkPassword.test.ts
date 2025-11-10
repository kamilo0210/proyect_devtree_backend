// Unit test created by Belinyer

import { checkPassword } from "../utils/auths";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("checkPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if passwords match", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await checkPassword("plain", "hashed");

    expect(bcrypt.compare).toHaveBeenCalledWith("plain", "hashed");
    expect(result).toBe(true);
  });

  it("should return false if passwords do not match", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await checkPassword("plain", "wrongHash");

    expect(result).toBe(false);
  });

  it("should throw an error if bcrypt.compare fails", async () => {
    (bcrypt.compare as jest.Mock).mockRejectedValue(new Error("Compare failed"));

    await expect(checkPassword("x", "y")).rejects.toThrow("Compare failed");
  });
});