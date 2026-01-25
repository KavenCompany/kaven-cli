import chalk from "chalk";
import ora from "ora";
import { AuthService } from "../../core/AuthService";

export async function authLogout(): Promise<void> {
  const authService = new AuthService();
  const spinner = ora("Encerrando sessão...").start();

  try {
    if (!(await authService.isAuthenticated())) {
      spinner.info(chalk.yellow("Você não está autenticado."));
      return;
    }

    await authService.clearToken();
    spinner.succeed(chalk.green("Sessão encerrada com sucesso!"));
  } catch {
    spinner.fail(chalk.red("Erro ao realizar logout."));
    process.exit(1);
  }
}
