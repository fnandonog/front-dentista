import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Smile,
  Layers,
  HeartPulse,
  X,
  CheckCircle2,
  Clock,
  CalendarCheck
} from "lucide-react";
import { Button } from "./ui/Button";

interface TratamentoDetalhado {
  icon: typeof Sparkles;
  title: string;
  desc: string;
  categoria: string;
  duracaoEstimada: string;
  detalhes: string;
  beneficios: string[];
  indicacao: string;
}

const tratamentos: TratamentoDetalhado[] = [
  {
    icon: Sparkles,
    title: "Limpeza e Profilaxia",
    desc: "Remoção de placa, tártaro e polimento para manter seus dentes protegidos e saudáveis.",
    categoria: "Saúde Preventiva",
    duracaoEstimada: "30 a 45 minutos",
    detalhes:
      "A profilaxia clínica realiza a remoção minuciosa da placa bacteriana e do tártaro endurecido que a escovação caseira não alcança. Finalizamos com jato de polimento e aplicação tópica de flúor para reforçar o esmalte dentário.",
    beneficios: [
      "Eliminação de bactérias que causam mau hálito e gengivite",
      "Remoção de manchas extrínsecas provocadas por café, chá ou tabaco",
      "Prevenção contra o desenvolvimento de cáries em áreas interdentais"
    ],
    indicacao: "Recomendado semestralmente para pacientes de todas as idades."
  },
  {
    icon: Smile,
    title: "Clareamento Dental",
    desc: "Técnicas avançadas para clarear os dentes de forma segura, rápida e duradoura.",
    categoria: "Estética do Sorriso",
    duracaoEstimada: "45 a 60 minutos por sessão",
    detalhes:
      "Procedimento clareador com géis atóxicos de última geração à base de peróxido com pH neutro, protegendo a integridade do esmalte e minimizando drasticamente a sensibilidade dentinária.",
    beneficios: [
      "Clareamento uniforme respeitando o tom natural do seu rosto",
      "Tecnologia com agentes dessensibilizantes de ação imediata",
      "Resultados visíveis e duradouros com orientação profissional"
    ],
    indicacao: "Indicado para manchas, amarelamento natural ou pigmentações adquiridas."
  },
  {
    icon: Layers, // Ícone que representa as camadas/laminados
    title: "Lentes de Contato Dental",
    desc: "Transforme a estética do seu sorriso com lâminas ultrafinas de porcelana ou resina.",
    categoria: "Transformação Estética",
    duracaoEstimada: "2 a 3 sessões (planejamento e aplicação)",
    detalhes:
      "As lentes de contato dentais são películas ultrafinas de cerâmica (ou resina composta de alta performance) cimentadas sobre os dentes[cite: 1.2.9]. O tratamento é personalizado por meio de planejamento digital prévio, o que permite corrigir cor, formato, tamanho e pequenos desalinhamentos de forma rápida e com mínimo desgaste[cite: 1.2.1, 1.2.9].",
    beneficios: [
      "Correção definitiva de dentes escurecidos, manchados ou desgastados",
      "Fechamento de espaços (diastemas) e ajuste de imperfeições de forma harmônica",
      "Material altamente resistente, com excelente durabilidade e que não perde a cor"
    ],
    indicacao: "Ideal para quem deseja harmonizar a estética, proporção e cor do sorriso de maneira definitiva[cite: 1.2.1]."
  },
  {
    icon: HeartPulse,
    title: "Restaurações & Estética",
    desc: "Tratamentos estéticos com resinas e facetas para devolver a harmonia ao seu rosto.",
    categoria: "Reconstrução & Harmonia",
    duracaoEstimada: "45 a 60 minutos por dente",
    detalhes:
      "Restaurações anatômicas diretas e facetas estéticas feitas em resina composta de nano-partículas ou cerâmica pura. Recria com fidelidade a textura, cor e translucidez original do dente natural.",
    beneficios: [
      "Recuperação imediata de dentes lascados, fraturados ou desgastados",
      "Substituição de restaurações escuras ou infiltradas antigas",
      "Harmonização do formato, proporção e comprimento do sorriso"
    ],
    indicacao: "Presença de cáries, fraturas estruturais ou insatisfação com a forma dos dentes."
  }
];

export function Services() {
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState<TratamentoDetalhado | null>(null);

  // Fecha o modal ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTratamentoSelecionado(null);
      }
    };

    if (tratamentoSelecionado) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [tratamentoSelecionado]);

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

                {/* Botão do Card com Abertura do Pop-up */}
                <Button
                  variant="secondary"
                  className="w-full text-xs cursor-pointer"
                  onClick={() => setTratamentoSelecionado(item)}
                >
                  Saiba Mais
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP / MODAL DE DETALHES DO PROCEDIMENTO */}
      {tratamentoSelecionado && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setTratamentoSelecionado(null)}
        >
          <div
            className="bg-white rounded-3xl border border-neutral-border w-full max-w-lg p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-neutral-dark"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo do Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-border/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-light flex items-center justify-center text-primary-main shrink-0">
                  <tratamentoSelecionado.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-main bg-primary-light/60 px-2.5 py-0.5 rounded-full mb-1">
                    {tratamentoSelecionado.categoria}
                  </span>
                  <h3 className="font-bold text-lg text-neutral-dark leading-tight">
                    {tratamentoSelecionado.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTratamentoSelecionado(null)}
                className="p-1.5 rounded-xl text-neutral-gray hover:text-neutral-dark hover:bg-neutral-bg cursor-pointer transition"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Explicativo */}
            <div className="py-5 space-y-4 text-xs">
              <p className="text-neutral-gray leading-relaxed text-[13px]">
                {tratamentoSelecionado.detalhes}
              </p>

              <div className="bg-[#FBFBFC] p-4 rounded-2xl border border-neutral-border/80 space-y-2.5">
                <h4 className="font-bold text-neutral-dark text-xs">
                  Vantagens do procedimento:
                </h4>
                <ul className="space-y-2">
                  {tratamentoSelecionado.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-neutral-gray">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-neutral-gray">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-main" />
                  <span>Duração: <strong className="text-neutral-dark">{tratamentoSelecionado.duracaoEstimada}</strong></span>
                </div>
                <div className="italic text-neutral-gray/80">
                  {tratamentoSelecionado.indicacao}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal com Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border/60">
              <button
                type="button"
                onClick={() => setTratamentoSelecionado(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-border text-xs font-semibold text-neutral-gray hover:bg-neutral-bg cursor-pointer transition"
              >
                Fechar
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-main hover:bg-primary-dark text-white text-xs font-semibold shadow-xs cursor-pointer transition"
              >
                <CalendarCheck className="w-4 h-4" />
                Agendar Horário
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}