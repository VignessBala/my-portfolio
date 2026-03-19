import { handleAdminSession } from "../_adminAuth.js";

export async function GET(request) {
  return handleAdminSession(request);
}
