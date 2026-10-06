import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Calendar, HeartHandshake, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export function Cadastro() {
    const navigate = useNavigate();

    // Controle de visualização de senha
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [aceitouTermos, setAceitouTermos] = useState(false);

    // Estados do Formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Estados de Endereço (ViaCEP)
    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");

    // Estados de Requisição
    const [loadingCep, setLoadingCep] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Máscara e Consulta automática do CEP
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        setCep(value);

        // Se completou os 8 dígitos, faz o fetch na API
        if (value.length === 8) {
            try {
                setLoadingCep(true);
                setErrorMessage("");
                const address = await api.getAddressByCep(value);
                setLogradouro(address.logradouro || "");
                setBairro(address.bairro || "");
                setCidade(address.cidade || "");
                setUf(address.uf || "");
            } catch (err: any) {
                setErrorMessage(err.message || "CEP não encontrado.");
            } finally {
                setLoadingCep(false);
            }
        }
    };

    // Submissão do Formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!nome || !email || !telefone || !senha) {
            setErrorMessage("Preencha todos os campos obrigatórios.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErrorMessage("As senhas informadas não coincidem.");
            return;
        }

        if (!aceitouTermos) {
            setErrorMessage("Você precisa aceitar os Termos e Privacidade.");
            return;
        }

        try {
            setSubmitting(true);
            await api.register({
                nome,
                email,
                telefone,
                senha,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                tipo: "PACIENTE"
            });

            // Redireciona para o login ou painel inicial
            navigate("/login");
        } catch (err: any) {
            setErrorMessage(err.message || "Erro ao realizar cadastro.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-main text-neutral-dark flex flex-col justify-between p-6 md:p-10">
            {/* Header Superior */}
            <header className="flex items-center justify-between max-w-6xl w-full mx-auto pb-6 border-b border-neutral-border/40">
                <Link to="/" className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-primary-main flex items-center justify-center text-white font-bold">
                        ✦
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-neutral-dark tracking-tight">Dra. Thais Tardelli</h2>
                        <p className="text-[10px] text-neutral-gray tracking-widest uppercase">Odontologia Especializada</p>
                    </div>
                </Link>
                <p className="text-xs text-neutral-gray">
                    Precisa de ajuda?{" "}
                    <a href="#" className="font-bold text-neutral-dark hover:underline">
                        Fale conosco
                    </a>
                </p>
            </header>

            {/* Conteúdo Central */}
            <main className="max-w-6xl w-full mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Coluna Esquerda: Formulário */}
                <div className="lg:col-span-6 max-w-md w-full mx-auto space-y-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-light text-primary-main">
                            👤 PRIMEIRO ACESSO
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-dark">Crie sua conta</h1>
                        <p className="text-xs text-neutral-gray">
                            Acompanhe seus agendamentos e cuide do seu sorriso em um só lugar.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
                            {errorMessage}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Nome completo *</label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Como podemos chamar você?"
                                className="w-full px-4 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-dark mb-1.5">E-mail *</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="voce@exemplo.com"
                                    className="w-full px-4 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Telefone / WhatsApp *</label>
                                <input
                                    type="tel"
                                    required
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    className="w-full px-4 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                />
                            </div>
                        </div>

                        {/* Bloco de Endereço (ViaCEP) */}
                        <div className="pt-2 border-t border-neutral-border/40 space-y-3">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray">
                                Endereço Residencial
                            </span>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                                        CEP {loadingCep && <Loader2 className="w-3 h-3 inline animate-spin text-primary-main ml-1" />}
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={8}
                                        value={cep}
                                        onChange={handleCepChange}
                                        placeholder="00000000"
                                        className="w-full px-3 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Logradouro / Rua</label>
                                    <input
                                        type="text"
                                        value={logradouro}
                                        onChange={(e) => setLogradouro(e.target.value)}
                                        placeholder="Preenchido via CEP"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Número</label>
                                    <input
                                        type="text"
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                        placeholder="Ex: 120"
                                        className="w-full px-3 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Complemento</label>
                                    <input
                                        type="text"
                                        value={complemento}
                                        onChange={(e) => setComplemento(e.target.value)}
                                        placeholder="Apto/Bloco"
                                        className="w-full px-3 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Bairro</label>
                                    <input
                                        type="text"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        placeholder="Bairro"
                                        className="w-full px-3 py-3 bg-neutral-50 border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Cidade/UF</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={cidade ? `${cidade}/${uf}` : ""}
                                        placeholder="Cidade/UF"
                                        className="w-full px-3 py-3 bg-neutral-50 border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Senhas */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Senha *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Crie uma senha segura"
                                    className="w-full px-4 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-dark"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-gray mt-1">ⓘ Use 8+ caracteres, com uma letra e um número.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Confirmar senha *</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    className="w-full px-4 py-3 bg-white border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-gray outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-dark"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={aceitouTermos}
                                    onChange={(e) => setAceitouTermos(e.target.checked)}
                                    className="w-4 h-4 rounded border-neutral-border text-primary-main focus:ring-primary-main accent-primary-main"
                                />
                                <span className="text-neutral-gray text-[11px]">Li e concordo com os</span>
                            </label>
                            <a href="#" className="font-semibold text-neutral-dark text-[11px] hover:underline">
                                Termos e Privacidade
                            </a>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 bg-primary-main hover:bg-primary-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Criando conta...
                                </>
                            ) : (
                                "Criar minha conta"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-neutral-gray">
                        Já tem uma conta?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-neutral-dark hover:underline cursor-pointer"
                        >
                            Entrar
                        </Link>
                    </p>
                </div>

                {/* Coluna Direita: Card Promocional com Imagem */}
                <div className="lg:col-span-6 hidden lg:block">
                    <div className="relative rounded-3xl overflow-hidden bg-neutral-dark min-h-[560px] flex flex-col justify-between p-8 text-white shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark via-neutral-dark/40 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                            alt="Atendimento Odontológico"
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                        />

                        <div className="relative z-20">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Seus dados estão protegidos
                            </span>
                        </div>

                        <div className="relative z-20 space-y-4">
                            <h2 className="text-2xl xl:text-3xl font-bold leading-tight">
                                Seu cuidado começa antes mesmo da consulta.
                            </h2>
                            <p className="text-xs text-neutral-border/90 leading-relaxed max-w-sm">
                                Tenha acesso rápido aos seus horários, orientações e histórico de atendimento em uma interface moderna.
                            </p>

                            <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-neutral-border">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-primary-light" /> Agendamento fácil
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <HeartHandshake className="w-4 h-4 text-primary-light" /> Suporte humanizado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="text-center text-[11px] text-neutral-gray/60 py-2">
                © 2026 Dra. Thais Tardelli Odontologia. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default Cadastro;