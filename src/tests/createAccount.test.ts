import { createAccount } from "../handlers/index";
import User from "../models/User";
import { hashPassword } from "../utils/auths";

jest.mock("../models/User");
jest.mock("../utils/auths", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword123"),
}));
jest.mock("slug", () => jest.fn(() => "user-handle"));

describe("createAccount", () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 409 if user already exists", async () => {
    const req: any = { body: { email: "test@example.com", password: "123456" } };
    (User.findOne as jest.Mock).mockResolvedValueOnce({ email: "test@example.com" });

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Un usuario con ese email ya esta registrado",
    });
  });

  it("should return 400 if handle already exists", async () => {
    const req: any = { body: { email: "new@example.com", password: "123456", handle: "user" } };
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // no hay usuario con el email
      .mockResolvedValueOnce({ handle: "user" }); // pero el handle ya existe

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Nombre de usuario no disponible",
    });
  });

  it("should create user successfully when no conflicts", async () => {
    const req: any = { body: { email: "new@example.com", password: "123456", handle: "newuser" } };

    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // no hay usuario con email
      .mockResolvedValueOnce(null); // no hay usuario con handle

    const saveMock = jest.fn().mockResolvedValue({});
    (User as any).mockImplementation(() => ({
      save: saveMock,
    }));

    await createAccount(req, res);

    expect(hashPassword).toHaveBeenCalledWith("123456");
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("Registro creado correctamente");
  });
});