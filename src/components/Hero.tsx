import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

// Foto clínica profissional de sorriso em alta resolução
const FOTO_SORRISO =
  "https://clinicavittagoiania.com.br/upload/blog/V6uA3LuwS5QxL0wHJ3WIkCIci28BGEfv897fROPH.jpeg";

export function Hero() {
  return (
    <section id="inicio" className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Coluna Esquerda: Textos */}
        <div className="flex flex-col items-start gap-6">
          <span className="text-body-small font-semibold text-primary-main tracking-wider uppercase font-main">
            ODONTOLOGIA ESPECIALIZADA
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-neutral-dark font-main leading-tight">
            Seu sorriso saudável e radiante começa aqui.
          </h1>

          <p className="text-body-medium text-neutral-gray font-main max-w-lg leading-relaxed">
            Agende sua consulta de forma 100% online ou tire suas dúvidas em
            tempo real com nossa assistente virtual.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/cadastro">
              <Button variant="primary">Agendar Consulta</Button>
            </Link>
            <a href="#servicos">
              <Button variant="outline">Conhecer Serviços</Button>
            </a>
          </div>
        </div>

        {/* Coluna Direita: Foto do Sorriso */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <img
              src={FOTO_SORRISO}
              alt="Sorriso saudável e radiante no consultório odontológico"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;