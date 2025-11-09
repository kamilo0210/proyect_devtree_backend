import { createAccount } from "../handlers/index";
import User from "../models/User";

jest.mock('slug');
jest.mock("../models/User");

describe("createAccount", () => {
  it("should return 409 if user already exists", async () => {
    const req: any = { body: { email: "test@example.com", password: "123456" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    (User.findOne as jest.Mock).mockResolvedValue({ email: "test@example.com" });

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Un usuario con ese email ya esta registrado",
    });
  });
});
