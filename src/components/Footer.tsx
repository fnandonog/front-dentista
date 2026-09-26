import { MapPin, Phone, Clock, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contato"
      className="w-full bg-neutral-dark text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-neutral-gray/20">
        {/* Marca */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Dra. Thais Tardelli</h3>
          <p className="text-body-small text-neutral-gray leading-relaxed">
            Odontologia preventiva e estética. Cuidando da saúde do seu sorriso
            com dedicação e tecnologia.
          </p>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-4">
          <h4 className="text-body-medium font-semibold text-white">
            Contato & Localização
          </h4>
          <ul className="space-y-3 text-body-small text-neutral-gray">
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary-main shrink-0" />
              Av. Fernão Dias Paes Leme, 713 - Jardim Cruz Alta, Várzea Paulista - SP, 13220-001
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-secondary-main shrink-0" />
              (19) 98137-6210
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary-main shrink-0" />
              Seg a Sex: 08:00h - 20:00h
            </li>
          </ul>
        </div>

        {/* Atendimento Rápido */}
        <div className="space-y-4">
          <h4 className="text-body-medium font-semibold text-white">
            Dúvidas Frequentes?
          </h4>
          <p className="text-body-small text-neutral-gray">
            Fale diretamente com nossa assistente virtual pelo chat online.
          </p>
          <button className="flex items-center gap-2 bg-primary-main hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-body-small font-semibold transition-colors">
            <MessageSquare className="w-4 h-4" />
            Iniciar Conversa
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 text-center text-xs text-neutral-gray">
        © {new Date().getFullYear()} Dra. Thais Tardelli - Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
