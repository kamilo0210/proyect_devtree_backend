import { login } from "../handlers/index";
import User from "../models/User";
import { checkPassword } from "../utils/auths";
import { generateJWT } from "../utils/jwt";

jest.mock("../models/User");
jest.mock("../utils/auths");
jest.mock("../utils/jwt");

describe("login", () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user does not exist", async () => {
    const req: any = { body: { email: "no@exists.com", password: "123" } };
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "no@exists.com" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "El usuario ingresado no esta registrado",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    const req: any = { body: { email: "user@example.com", password: "wrong" } };
    (User.findOne as jest.Mock).mockResolvedValue({ email: "user@example.com", password: "hashed" });
    (checkPassword as jest.Mock).mockResolvedValue(false);

    await login(req, res);

    expect(checkPassword).toHaveBeenCalledWith("wrong", "hashed");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Contraseña incorrecta",
    });
  });

  it("should return token if credentials are correct", async () => {
    const req: any = { body: { email: "user@example.com", password: "123" } };
    (User.findOne as jest.Mock).mockResolvedValue({ _id: "1234", email: "user@example.com", password: "hashed" });
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue("fakeToken");

    await login(req, res);

    expect(checkPassword).toHaveBeenCalledWith("123", "hashed");
    expect(generateJWT).toHaveBeenCalledWith({ id: "1234" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("fakeToken");
  });
});