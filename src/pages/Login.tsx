import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [lembrarDeMim, setLembrarDeMim] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !senha) {
            setErrorMessage("Preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            const data = await api.login({ email, senha });

            // Olhe no F12 do navegador o que o console vai mostrar aqui:
            console.log("Resposta do Login da API:", data);

            // Tenta pegar o tipo/role de diferentes formatos comuns de retorno
            const rawType =
                data.tipo ||
                data.role ||
                data.user?.tipo ||
                data.user?.role ||
                data.usuario?.tipo ||
                data.usuario?.role ||
                "";

            const userType = String(rawType).toUpperCase().trim();

            console.log("Tipo identificado:", userType);

            if (userType === "CLINICA" || userType === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/meus-agendamentos");
            }
        } catch (err: any) {
            setErrorMessage(err.message || "E-mail ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-main text-neutral-dark flex flex-col justify-between p-6 md:p-10">
            {/* Header */}
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
                <div className="flex items-center gap-1 text-xs text-neutral-gray">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Área segura do paciente</span>
                </div>
            </header>

            {/* Conteúdo Central */}
            <main className="max-w-6xl w-full mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Coluna Esquerda: Formulário de Login */}
                <div className="lg:col-span-6 max-w-md w-full mx-auto space-y-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-light text-primary-main">
                            🔒 ÁREA DO PACIENTE
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-dark">
                            Que bom ter você de volta
                        </h1>
                        <p className="text-xs text-neutral-gray">
                            Entre para consultar seus próximos atendimentos e informações de cuidado.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
                            {errorMessage}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">E-mail</label>
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
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite sua senha"
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
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={lembrarDeMim}
                                    onChange={(e) => setLembrarDeMim(e.target.checked)}
                                    className="w-4 h-4 rounded border-neutral-border text-primary-main focus:ring-primary-main accent-primary-main"
                                />
                                <span className="text-neutral-gray text-[11px]">Lembrar de mim</span>
                            </label>
                            <a href="#" className="font-semibold text-neutral-dark text-[11px] hover:underline">
                                Esqueci minha senha
                            </a>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-main hover:bg-primary-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-neutral-border/60"></div>
                            <span className="shrink mx-3 text-[11px] text-neutral-gray">ou continue com</span>
                            <div className="flex-grow border-t border-neutral-border/60"></div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3 border border-neutral-border rounded-xl text-xs font-semibold text-neutral-dark hover:bg-neutral-bg transition flex items-center justify-center gap-2"
                        >
                            <span className="font-bold text-blue-600">G</span> Entrar com Google
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-gray">
                        Ainda não tem uma conta?{" "}
                        <Link
                            to="/cadastro"
                            className="font-bold text-neutral-dark hover:underline cursor-pointer"
                        >
                            Criar conta
                        </Link>
                    </p>

                    <div className="pt-2 flex items-center justify-center gap-6 text-[11px] text-neutral-gray">
                        <span className="flex items-center gap-1.5">🛡️ Dados protegidos</span>
                        <span className="flex items-center gap-1.5">⏰ Acesso 24 horas</span>
                    </div>
                </div>

                {/* Coluna Direita: Card Promocional */}
                <div className="lg:col-span-6 hidden lg:block">
                    <div className="relative rounded-3xl overflow-hidden bg-neutral-dark min-h-[560px] flex flex-col justify-between p-8 text-white shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark via-neutral-dark/40 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                            alt="Sorriso saudável"
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                        />

                        <div className="relative z-20">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Atendimento online disponível
                            </span>
                        </div>

                        <div className="relative z-20 space-y-4">
                            <h2 className="text-2xl xl:text-3xl font-bold leading-tight">
                                Cuidado próximo, simples e feito para você.
                            </h2>
                            <p className="text-xs text-neutral-border/90 leading-relaxed max-w-sm">
                                Continue sua jornada com tranquilidade. Seus próximos passos estão organizados aqui.
                            </p>

                            <div className="pt-4 border-t border-white/10 space-y-1 text-xs">
                                <p className="italic text-neutral-border font-light">
                                    "Tudo claro desde o agendamento até o pós-consulta."
                                </p>
                                <p className="text-[10px] text-neutral-gray">Paciente verificada</p>
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

export default Login;