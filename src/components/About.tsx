import { Award, Users, Stethoscope } from "lucide-react";

export function About() {
  return (
    <section
      id="sobre"
      className="w-full bg-white py-20 border-t border-neutral-border"
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-body-small font-semibold text-primary-main tracking-wide uppercase">
            Sobre a Clínica
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-dark">
            Excelência e cuidado humanizado em cada atendimento.
          </h2>
          <p className="text-body-medium text-neutral-gray leading-relaxed">
            A Dra. Thais Tardelli busca oferecer uma experiência odontológica
            sem traumas, utilizando materiais de alta qualidade e tecnologia de
            ponta para garantir a melhor saúde e estética bucal.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-neutral-bg rounded-2xl text-center border border-neutral-border">
              <Award className="w-6 h-6 text-primary-main mx-auto mb-2" />
              <span className="block text-xl font-bold text-neutral-dark">
                8+
              </span>
              <span className="text-xs text-neutral-gray">Anos Exp.</span>
            </div>
            <div className="p-4 bg-neutral-bg rounded-2xl text-center border border-neutral-border">
              <Users className="w-6 h-6 text-primary-main mx-auto mb-2" />
              <span className="block text-xl font-bold text-neutral-dark">
                +1.200
              </span>
              <span className="text-xs text-neutral-gray">Pacientes</span>
            </div>
            <div className="p-4 bg-neutral-bg rounded-2xl text-center border border-neutral-border">
              <Stethoscope className="w-6 h-6 text-primary-main mx-auto mb-2" />
              <span className="block text-xl font-bold text-neutral-dark">
                100%
              </span>
              <span className="text-xs text-neutral-gray">Dedicação</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-light p-8 rounded-3xl border border-primary-main/20 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-neutral-dark">
            Por que nos escolher?
          </h3>
          <ul className="space-y-3 text-body-small text-neutral-dark font-medium">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-main" />
              Ambiente moderno e aconchegante
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-main" />
              Agendamento e acompanhamento 100% digital
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-main" />
              Planos de tratamento personalizados
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
