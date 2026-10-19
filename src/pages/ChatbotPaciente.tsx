import { useState, useRef, useEffect } from "react";
import { Send, Dog, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { SidebarPaciente } from "../components/SidebarPaciente";
import { api } from "../services/api";

interface Mensagem {
    id: string;
    remetente: "bot" | "user";
    texto: string;
    horario: string;
}

export function ChatbotPaciente() {
    const [mensagens, setMensagens] = useState<Mensagem[]>([
        {
            id: "1",
            remetente: "bot",
            texto: "Olá! Sou a Luna, assistente virtual da Dra. Thaís Tardelli Odontologia Especializada.\n\nComo posso ajudar você hoje com seus cuidados bucais ou dúvidas sobre nossos tratamentos?",
            horario: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
    ]);
    const [inputTexto, setInputTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll automático até a mensagem mais recente
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens, enviando]);

    const handleEnviar = async (e?: React.FormEvent, textoDireto?: string) => {
        if (e) e.preventDefault();
        const textoFinal = (textoDireto || inputTexto).trim();
        if (!textoFinal || enviando) return;

        setErro("");

        const mensagemUsuario: Mensagem = {
            id: String(Date.now()),
            remetente: "user",
            texto: textoFinal,
            horario: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setMensagens((prev) => [...prev, mensagemUsuario]);
        setInputTexto("");
        setEnviando(true);

        try {
            const data = await api.enviarMensagemChat(textoFinal);

            const mensagemBot: Mensagem = {
                id: String(Date.now() + 1),
                remetente: "bot",
                texto: data.resposta,
                horario: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };

            setMensagens((prev) => [...prev, mensagemBot]);
        } catch (err: any) {
            setErro(err.message || "Não foi possível obter resposta no momento.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#FBFBFC] font-main text-neutral-dark overflow-hidden">
            <SidebarPaciente activeItem="chatbot" />

            <main className="flex-1 flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8">
                {/* Cabeçalho */}
                <div className="bg-white rounded-2xl border border-neutral-border p-4 mb-4 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="relative">
                            {/* Ícone Cachorrinho no Cabeçalho */}
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-main to-[#D88D83] flex items-center justify-center text-white shadow-md shadow-primary-main/20">
                                <Dog className="w-6 h-6" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-neutral-dark flex items-center gap-1.5">
                                    Luna <span className="font-normal text-xs text-neutral-gray">(Assistente Virtual)</span>
                                </h1>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-main bg-primary-light px-2 py-0.5 rounded-full">
                                    <Sparkles className="w-2.5 h-2.5" /> IA Ativa
                                </span>
                            </div>
                            <p className="text-xs text-neutral-gray">Dra. Thaís Tardelli Odontologia Especializada</p>
                        </div>
                    </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 bg-white rounded-2xl border border-neutral-border p-4 md:p-6 overflow-y-auto space-y-4 shadow-xs">
                    {mensagens.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.remetente === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                }`}
                        >
                            {/* Avatar do Balão */}
                            <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${msg.remetente === "user" ? "bg-neutral-dark" : "bg-primary-main"
                                    }`}
                            >
                                {msg.remetente === "user" ? <User className="w-4 h-4" /> : <Dog className="w-4 h-4" />}
                            </div>

                            <div>
                                <div
                                    className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-xs ${msg.remetente === "user"
                                            ? "bg-primary-main text-white rounded-tr-none"
                                            : "bg-[#FAFAFB] text-neutral-dark border border-neutral-border rounded-tl-none"
                                        }`}
                                >
                                    {msg.texto}
                                </div>
                                <span className="block text-[10px] text-neutral-gray mt-1 px-1">
                                    {msg.horario}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Indicador de Digitando com ícone canino */}
                    {enviando && (
                        <div className="flex gap-3 max-w-[75%] mr-auto">
                            <div className="w-8 h-8 rounded-xl bg-primary-main text-white flex items-center justify-center shrink-0">
                                <Dog className="w-4 h-4" />
                            </div>
                            <div className="p-3.5 bg-[#FAFAFB] border border-neutral-border rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary-main" />
                                <span className="text-xs text-neutral-gray italic">Luna está digitando...</span>
                            </div>
                        </div>
                    )}

                    {erro && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{erro}</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Atalhos Rápidos */}
                <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
                    <span className="text-neutral-gray text-[11px] shrink-0 font-medium">Sugestões:</span>
                    <button
                        type="button"
                        onClick={() => handleEnviar(undefined, "Como funciona o clareamento dental?")}
                        className="px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-border rounded-full text-neutral-dark shrink-0 transition"
                    >
                        Como funciona o clareamento?
                    </button>
                    <button
                        type="button"
                        onClick={() => handleEnviar(undefined, "Quais são as vantagens das lentes de contato dental?")}
                        className="px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-border rounded-full text-neutral-dark shrink-0 transition"
                    >
                        Lentes de contato dental
                    </button>
                    <button
                        type="button"
                        onClick={() => handleEnviar(undefined, "De quanto em quanto tempo devo fazer limpeza?")}
                        className="px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-border rounded-full text-neutral-dark shrink-0 transition"
                    >
                        Frequência da limpeza
                    </button>
                </div>

                {/* Barra de Envio */}
                <form onSubmit={handleEnviar} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Pergunte à Luna sobre procedimentos ou orientações..."
                        value={inputTexto}
                        onChange={(e) => setInputTexto(e.target.value)}
                        disabled={enviando}
                        className="flex-1 px-4 py-3 bg-white border border-neutral-border rounded-xl text-sm outline-none focus:border-primary-main transition shadow-xs disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={enviando || !inputTexto.trim()}
                        className="px-5 py-3 bg-primary-main hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition shadow-xs"
                    >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Enviar</span>
                    </button>
                </form>
            </main>
        </div>
    );
}

export default ChatbotPaciente;