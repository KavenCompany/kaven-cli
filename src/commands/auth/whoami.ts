import chalk from "chalk";
import { AuthService } from "../../core/AuthService";

export async function authWhoami(): Promise<void> {
  const authService = new AuthService();

  try {
    const userInfo = await authService.getUserInfo();

    if (!userInfo) {
      console.log(chalk.yellow("Você não está autenticado."));
      console.log(chalk.gray("Use 'kaven auth login' para entrar."));
      return;
    }

    console.log(chalk.blue("👤 Usuário logado:"));
    console.log(`${chalk.bold("ID:")}    ${userInfo.id}`);
    console.log(`${chalk.bold("E-mail:")} ${userInfo.email}`);
    if (userInfo.name) {
      console.log(`${chalk.bold("Nome:")}   ${userInfo.name}`);
    }
  } catch {
    console.error(chalk.red("Erro ao verificar status de autenticação."));
    process.exit(1);
  }
}
