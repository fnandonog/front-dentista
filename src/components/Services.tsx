import { Sparkles, Smile, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "./ui/Button";

const tratamentos = [
  {
    icon: Sparkles,
    title: "Limpeza e Profilaxia",
    desc: "Remoção de placa, tártaro e polimento para manter seus dentes protegidos e saudáveis.",
  },
  {
    icon: Smile,
    title: "Clareamento Dental",
    desc: "Técnicas avançadas para clarear os dentes de forma segura, rápida e duradoura.",
  },
  {
    icon: ShieldCheck,
    title: "Ortodontia Moderna",
    desc: "Alinhadores invisíveis e aparelhos estéticos para corrigir o alinhamento do seu sorriso.",
  },
  {
    icon: HeartPulse,
    title: "Restaurações & Estética",
    desc: "Tratamentos estéticos com resinas e facetas para devolver a harmonia ao seu rosto.",
  },
];

export function Services() {
  return (
    <section
      id="servicos"
      className="w-full bg-neutral-bg py-20 border-t border-neutral-border"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark font-main mb-3">
            Nossos Tratamentos
          </h2>
          <p className="text-body-medium text-neutral-gray">
            Cuidados completos e personalizados para a sua saúde bucal.
          </p>
        </div>

        {/* Grid de Cards (4 Colunas no Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tratamentos.map((item, index) => {
            const Icone = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-neutral-border flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Ícone */}
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary-main mb-6">
                    <Icone className="w-6 h-6" />
                  </div>

                  {/* Título e Descrição */}
                  <h3 className="text-body-medium font-bold text-neutral-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-body-small text-neutral-gray leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Botão do Card */}
                <Button variant="secondary" className="w-full text-xs">
                  Saiba Mais
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
