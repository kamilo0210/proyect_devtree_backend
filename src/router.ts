import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, getUserByHandle, login, searchByHandle, upadteUser, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authtenticate } from "./middleware/auth";

const router = Router();

/**Autenticacion y registro */
router.post(
  "/auth/register",
  body("handle")
    .notEmpty()
    .withMessage("El handle no puede ir vacio"),
  body("name")
    .notEmpty().
    withMessage("El nombre no puede ir vacio"),
  body("email")
    .isEmail()
    .withMessage("El email no es valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener minimo 8 caracteres"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email")
    .isEmail().
    withMessage("El email no es valido"),
  body("password")
    .notEmpty().
    withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  login
);

router.get("/user", authtenticate, getUser);

router.patch(
  "/user",
  body("handle")
    .notEmpty()
    .withMessage("El handle no puede ir vacio"),
    handleInputErrors,
  authtenticate,
  upadteUser
);


router.post('/user/image', authtenticate, uploadImage)

router.get('/:handle', getUserByHandle)

router.post('/search',
  body("handle")
    .notEmpty()
    .withMessage("El handle no puede ir vacio"),
    handleInputErrors,
    searchByHandle
 )

export default router;
