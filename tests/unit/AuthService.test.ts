import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { AuthService } from "../../src/core/AuthService";

describe("AuthService", () => {
  let authService: AuthService;
  const configPath = path.join(os.homedir(), ".kaven", "auth.json");

  beforeEach(async () => {
    authService = new AuthService();
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
    }
  });

  afterEach(async () => {
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
    }
  });

  it("deve salvar e recuperar o token", async () => {
    const token = "test-token-123";
    await authService.storeToken(token);

    const retrieved = await authService.getToken();
    expect(retrieved).toBe(token);
  });

  it("deve limpar o token no logout", async () => {
    await authService.storeToken("some-token");
    await authService.clearToken();

    const retrieved = await authService.getToken();
    expect(retrieved).toBeNull();
  });

  it("deve retornar false se não houver token salvo", async () => {
    const isAuth = await authService.isAuthenticated();
    expect(isAuth).toBe(false);
  });

  it("deve ter permissões restritas (0600) no arquivo de auth", async () => {
    if (process.platform === "win32") return; // Skip on Windows

    await authService.storeToken("secure-token");
    const stats = await fs.stat(configPath);
    
    // 0o600 em decimal é 384
    // Verificamos apenas os bits de permissão (stats.mode & 0o777)
    expect(stats.mode & 0o777).toBe(0o600);
  });
});
