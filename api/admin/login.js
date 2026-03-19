import { handleAdminLogin } from "../_adminAuth.js";

export async function POST(request) {
  return handleAdminLogin(request);
}
