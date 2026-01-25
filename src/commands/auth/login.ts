import chalk from "chalk";
import ora from "ora";
import { AuthService } from "../../core/AuthService";

export async function authLogin(): Promise<void> {
  const authService = new AuthService();
  
  console.log(chalk.blue("🔐 Iniciando fluxo de autenticação...\n"));
  
  const spinner = ora("Gerando código de dispositivo...").start();

  try {
    // Simulando atraso da rede
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const deviceCode = "KAVEN-777-BINGO";
    const verificationUrl = "https://kaven.sh/device";

    spinner.stop();

    console.log(
      chalk.yellow("Para continuar o login, acesse a URL abaixo e insira o código:"),
    );
    console.log(chalk.bold(`\n   URL:    ${verificationUrl}`));
    console.log(chalk.bold(`   Código: ${deviceCode}\n`));

    const pollSpinner = ora("Aguardando autorização no navegador...").start();

    // Simular polling bem-sucedido após 3 segundos
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockToken = "jwt-mock-token-for-kaven-explorador";
    await authService.storeToken(mockToken);

    pollSpinner.succeed(chalk.green("Autenticação realizada com sucesso!"));
    console.log(chalk.gray("\nSeu token foi salvo com segurança em ~/.kaven/auth.json"));
  } catch (error) {
    spinner.fail(chalk.red("Erro ao realizar login."));
    console.error(error);
    process.exit(1);
  }
}
