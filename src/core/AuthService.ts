import fs from "fs-extra";
import path from "path";
import os from "os";

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
}

export class AuthService {
  private readonly configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), ".kaven", "auth.json");
  }

  async storeToken(token: string): Promise<void> {
    const configDir = path.dirname(this.configPath);
    await fs.ensureDir(configDir);

    // Salvar token em JSON
    await fs.writeJson(this.configPath, { token }, { spaces: 2 });

    // Definir permissões restritas (0600 - leitura/escrita apenas pelo dono) no Linux
    if (process.platform !== "win32") {
      await fs.chmod(this.configPath, 0o600);
    }
  }

  async getToken(): Promise<string | null> {
    if (!(await fs.pathExists(this.configPath))) {
      return null;
    }

    try {
      const data = await fs.readJson(this.configPath);
      return data.token || null;
    } catch {
      return null;
    }
  }

  async clearToken(): Promise<void> {
    if (await fs.pathExists(this.configPath)) {
      await fs.remove(this.configPath);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Mock decoding of JWT for now.
   * In a real implementation, we would use a library like 'jsonwebtoken'.
   */
  async getUserInfo(): Promise<UserInfo | null> {
    const token = await this.getToken();
    if (!token) return null;

    // Simulate decoding (mocked)
    return {
      id: "usr-mock-123",
      email: "user@example.com",
      name: "Kaven Explorador",
    };
  }
}
