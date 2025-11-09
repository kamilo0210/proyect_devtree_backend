import { generateJWT } from "../utils/jwt";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("generateJWT", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "secret123" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should return a token string", () => {
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const payload = { id: "123" };
    const token = generateJWT(payload);

    expect(jwt.sign).toHaveBeenCalledWith(payload, "secret123", {
      expiresIn: "180d",
    });
    expect(token).toBe("fakeToken");
  });

  it("should throw an error if jwt.sign fails", () => {
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error("sign failed");
    });

    expect(() => generateJWT({ id: "123" })).toThrow("sign failed");
  });
});