import { useNavigate } from "react-router-dom";
import { Bot, Cog, MessageSquareHeart, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { SidebarPaciente } from "../components/SidebarPaciente";

export function ChatbotPaciente() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-[#FDFCFB]">
            {/* Sidebar mantendo a navegação ativa */}
            <SidebarPaciente activeItem="chatbot" />

            {/* Conteúdo Principal */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">

                    {/* Badge Em Breve */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light/40 border border-primary-main/20 text-primary-main text-xs font-semibold mb-6 shadow-sm">
                        <Cog className="w-3.5 h-3.5 animate-spin [animation-duration:6s]" />
                        <span>Recurso em Desenvolvimento</span>
                    </div>

                    {/* Ícone com Efeito Visual Moderno */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-main to-[#D88D83] flex items-center justify-center text-white shadow-xl shadow-primary-main/25 ring-8 ring-primary-light/30">
                            <Bot className="w-12 h-12" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-neutral-border">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                        </div>
                    </div>

                    {/* Título e Descrição */}
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark font-main tracking-tight mb-3">
                        Sua Assistente Virtual Odontológica
                    </h1>

                    <p className="text-neutral-gray max-w-xl text-sm md:text-base leading-relaxed mb-10">
                        Estamos preparando uma inteligência artificial dedicada para tirar dúvidas clínicas, acompanhar suas recomendações pós-consulta e facilitar sua rotina com a <strong>Dra. Thaís Tardelli</strong>.
                    </p>

                    {/* Cards de Prévia dos Recursos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left mb-10">
                        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-primary-light/50 text-primary-main flex items-center justify-center mb-3">
                                <MessageSquareHeart className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-neutral-dark text-sm mb-1 font-main">
                                Dúvidas em Tempo Real
                            </h3>
                            <p className="text-xs text-neutral-gray leading-normal">
                                Pergunte sobre cuidados bucais, sensibilidade e preparo para procedimentos a qualquer hora.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-primary-light/50 text-primary-main flex items-center justify-center mb-3">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-neutral-dark text-sm mb-1 font-main">
                                Orientações Pós-Consulta
                            </h3>
                            <p className="text-xs text-neutral-gray leading-normal">
                                Lembretes personalizados do seu tratamento e instruções diretas sobre higiene e medicação.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-primary-light/50 text-primary-main flex items-center justify-center mb-3">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-neutral-dark text-sm mb-1 font-main">
                                Atendimento Confiável
                            </h3>
                            <p className="text-xs text-neutral-gray leading-normal">
                                Respostas estruturadas baseadas nos protocolos clínicos oficiais adotados no consultório.
                            </p>
                        </div>
                    </div>

                    {/* Botões de Ação para não prender o usuário */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/agendar")}
                            className="px-6 py-3 bg-primary-main text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md shadow-primary-main/20 transition flex items-center gap-2 cursor-pointer"
                        >
                            <span>Agendar Consulta</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/inicio")}
                            className="px-6 py-3 bg-white border border-neutral-border text-neutral-dark text-sm font-semibold rounded-xl hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Voltar ao Início
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default ChatbotPaciente;