import { getUser } from "../handlers/index";

describe("getUser", () => {
  const res: any = { json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user info in JSON", async () => {
    const req: any = { user: { name: "Camilo" } };

    await getUser(req, res);

    expect(res.json).toHaveBeenCalledWith({ name: "Camilo" });
  });

  it("should handle missing user gracefully", async () => {
    const req: any = {}; // sin user
    await getUser(req, res);

    // Dependiendo de cómo se use la función, podría enviar undefined
    expect(res.json).toHaveBeenCalledWith(undefined);
  });
});