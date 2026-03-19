import { handleAdminLogout } from "../_adminAuth.js";

export async function POST(request) {
  return handleAdminLogout(request);
}
