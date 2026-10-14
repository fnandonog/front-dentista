import { useState, useEffect } from "react";
import { User, Phone, Mail, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { SidebarPaciente } from "../components/SidebarPaciente";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export function MeuPerfil() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const [aCarregar, setACarregar] = useState(true);
    const [aGuardar, setAGuardar] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        // Carrega dados iniciais a partir do utilizador autenticado em cache
        const utilizadorGuardado = localStorage.getItem("@clinica:user");
        if (utilizadorGuardado) {
            try {
                const u = JSON.parse(utilizadorGuardado);
                setNome(u.nome || "");
                setCpf(u.cpf || "");
                setEmail(u.email || "");
                setTelefone(u.telefone || "");
            } catch (e) {
                console.error("Erro ao ler dados locais do utilizador:", e);
            }
        }
        setACarregar(false);
    }, []);

    const handleGuardarAlteracoes = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagemSucesso("");
        setMensagemErro("");
        setAGuardar(true);

        try {
            // 1. Salvar no banco de dados via API
            await api.updatePerfil({ nome, telefone, email });

            // 2. Atualizar dados salvos no nav
            const utilizadorAtual = JSON.parse(localStorage.getItem("@clinica:user") || "{}");
            const dadosAtualizados = { ...utilizadorAtual, nome, telefone, email };
            localStorage.setItem("@clinica:user", JSON.stringify(dadosAtualizados));

            setMensagemSucesso("Perfil atualizado com sucesso!");
        } catch (err: any) {
            setMensagemErro(err.message || "Não foi possível atualizar o perfil.");
        } finally {
            setAGuardar(false);
        }
    };

    if (aCarregar) {
        return (
            <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFC] flex font-main text-neutral-dark">
            <SidebarPaciente />

            <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-dark">Meu Perfil</h1>
                    <p className="text-sm text-neutral-gray mt-1">
                        Edite as principais informações do seu perfil pessoal.
                    </p>
                </div>

                {mensagemSucesso && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {mensagemSucesso}
                    </div>
                )}

                {mensagemErro && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        {mensagemErro}
                    </div>
                )}

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-border shadow-xs">
                    <form onSubmit={handleGuardarAlteracoes} className="space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-neutral-border/60">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-neutral-dark">{nome || "Paciente"}</h3>
                                <p className="text-xs text-neutral-gray">Paciente registado na clínica</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-gray mb-1.5 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" /> Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-neutral-border rounded-xl text-sm font-medium text-neutral-dark outline-none focus:border-primary-main transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-gray mb-1.5 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" /> CPF (Não editável)
                                </label>
                                <input
                                    type="text"
                                    value={cpf}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-400 cursor-not-allowed outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-gray mb-1.5 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> E-mail
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-neutral-border rounded-xl text-sm font-medium text-neutral-dark outline-none focus:border-primary-main transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-gray mb-1.5 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-neutral-border rounded-xl text-sm font-medium text-neutral-dark outline-none focus:border-primary-main transition"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={aGuardar}
                                className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer flex items-center gap-2"
                            >
                                {aGuardar && <Loader2 className="w-4 h-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default MeuPerfil;