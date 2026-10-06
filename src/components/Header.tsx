import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-neutral-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Marca / Nome */}
        <Link to="/" className="text-lg font-bold text-neutral-dark font-main tracking-tight cursor-pointer">
          Dra. Thais Tardelli
        </Link>

        {/* Links Centrais de Navegação */}
        <nav className="hidden md:flex items-center gap-8 text-body-small text-neutral-dark font-medium">
          <a href="#inicio" className="hover:text-primary-main transition-colors">
            Início
          </a>
          <a href="#servicos" className="hover:text-primary-main transition-colors">
            Serviços
          </a>
          <a href="#sobre" className="hover:text-primary-main transition-colors">
            Sobre
          </a>
          <a href="#contato" className="hover:text-primary-main transition-colors">
            Contato
          </a>
        </nav>

        {/* 2 Botões à Direita com Navegação */}
        <div className="flex items-center gap-3">
          <Link to="/cadastro">
            <Button variant="primary">Agendar Consulta</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;