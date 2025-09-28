export function isAuthed(): boolean {
  try {
    return localStorage.getItem("auth") === "true";
  } catch {
    return false;
  }
}

export function signIn(): void {
  try {
    localStorage.setItem("auth", "true");
  } catch {}
}

export function signOut(): void {
  try {
    localStorage.removeItem("auth");
  } catch {}
}




