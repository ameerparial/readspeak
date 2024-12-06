import jsonWebToken from "jsonwebtoken";
const { sign, verify } = jsonWebToken;

export function createToken(userObject) {
  return sign(userObject, process.env.SECRET_KEY);
}

export function verifyToken(token) {
  return verify(token, process.env.SECRET_KEY);
}
