package metodosnumericos.calculadora;

import org.springframework.boot.SpringApplication;

public class TestCalculadoraApplication {

	public static void main(String[] args) {
		SpringApplication.from(CalculadoraApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
