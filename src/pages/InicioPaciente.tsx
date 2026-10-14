import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    CalendarPlus,
    MessageSquare,
    Clock,
    ShieldAlert,
    Sparkles,
    HeartPulse,
    CheckCircle2
} from "lucide-react";
import { SidebarPaciente } from "../components/SidebarPaciente";

export function InicioPaciente() {
    const [nomePaciente, setNomePaciente] = useState("Paciente");

    useEffect(() => {
        const utilizadorGuardado = localStorage.getItem("@clinica:user");
        if (utilizadorGuardado) {
            try {
                const u = JSON.parse(utilizadorGuardado);
                // Testa as formas mais comuns que o banco/login costuma devolver
                const nomeCompleto = u.nome || u.paciente_nome || u.name;
                if (nomeCompleto) {
                    setNomePaciente(nomeCompleto.trim().split(" ")[0]);
                }
            } catch (e) {
                console.error("Erro ao ler dados do paciente:", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex font-main text-neutral-dark">
            <SidebarPaciente />

            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                {/* Banner de Boas-vindas */}
                <div className="bg-gradient-to-r from-primary-main/10 via-primary-light/20 to-white p-6 md:p-8 rounded-3xl border border-primary-main/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-main/10 text-primary-main">
                            <Sparkles className="w-3.5 h-3.5" /> Portal do Paciente
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark">
                            Olá, {nomePaciente}! 👋
                        </h1>
                        <p className="text-sm text-neutral-gray max-w-xl">
                            Seja bem-vindo ao consultório da <strong>Dra. Thaís Tardelli</strong>. Aceda aos seus agendamentos, marque novas consultas ou consulte as orientações clínicas de saúde oral.
                        </p>
                    </div>

                    <Link
                        to="/agendar"
                        className="inline-flex items-center justify-center gap-2 bg-primary-main hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-sm whitespace-nowrap"
                    >
                        <CalendarPlus className="w-4 h-4" /> Marcar Consulta
                    </Link>
                </div>

                {/* Tutorial Visual de Utilização */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2">
                        Como funciona o portal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-neutral-border space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-main flex items-center justify-center font-bold">
                                1
                            </div>
                            <h3 className="font-bold text-sm text-neutral-dark">Escolha o Procedimento</h3>
                            <p className="text-xs text-neutral-gray leading-relaxed">
                                Selecione o serviço pretendido. O sistema calcula a duração exata para reservar a sua vaga no consultório.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-neutral-border space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-main flex items-center justify-center font-bold">
                                2
                            </div>
                            <h3 className="font-bold text-sm text-neutral-dark">Selecione Data e Hora</h3>
                            <p className="text-xs text-neutral-gray leading-relaxed">
                                Navegue pelos meses futuros e selecione os horários disponíveis em intervalos de 30 minutos.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-neutral-border space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-main flex items-center justify-center font-bold">
                                3
                            </div>
                            <h3 className="font-bold text-sm text-neutral-dark">Acompanhe a Agenda</h3>
                            <p className="text-xs text-neutral-gray leading-relaxed">
                                No menu <em>Agendamentos</em> pode consultar o estado da sua consulta, remarcar ou desmarcar com antecedência.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Regras da Aplicação & Dicas Clínicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Regras e Pontualidade */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-4">
                        <h2 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-500" /> Regras do Consultório
                        </h2>

                        <ul className="space-y-3 text-xs text-neutral-gray">
                            <li className="flex items-start gap-2.5">
                                <Clock className="w-4 h-4 text-primary-main shrink-0 mt-0.5" />
                                <span><strong>Tolerância e Chegada:</strong> Recomendamos chegar 10 minutos antes do horário agendado.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary-main shrink-0 mt-0.5" />
                                <span><strong>Cancelamentos e Remarcações:</strong> Devem ser efetuados com um mínimo de 24 horas de antecedência.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MessageSquare className="w-4 h-4 text-primary-main shrink-0 mt-0.5" />
                                <span><strong>Urgências Odontológicas:</strong> Dores agudas ou fraturas dentárias devem ser comunicadas pelo WhatsApp da clínica.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Dicas da Dra. Thaís */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-4">
                        <h2 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-rose-500" /> Dicas da Dra. Thaís Tardelli
                        </h2>

                        <div className="space-y-3 text-xs text-neutral-gray">
                            <div className="p-3 bg-neutral-bg/60 rounded-xl space-y-1">
                                <p className="font-semibold text-neutral-dark">Uso Diário do Fio Dentário</p>
                                <p>A escovagem higieniza apenas 60% da superfície dentária. O fio dentário é indispensável para prevenir cáries interdentárias.</p>
                            </div>
                            <div className="p-3 bg-neutral-bg/60 rounded-xl space-y-1">
                                <p className="font-semibold text-neutral-dark">Periodicidade da Profilaxia</p>
                                <p>A limpeza profissional deve ser feita a cada 6 meses para remoção de tártaro e prevenção de doenças gengivais.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InicioPaciente;