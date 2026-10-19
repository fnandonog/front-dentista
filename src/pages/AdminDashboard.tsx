import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutGrid,
    Calendar,
    Users,
    Activity,
    Settings,
    Search,
    Bell,
    Plus,
    Clock,
    ChevronLeft,
    ChevronRight,
    FileSpreadsheet,
    LogOut,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    X,
    UserCheck,
    Trash2,
    NotebookPen,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export type AdminTab = "visao-geral" | "agenda" | "pacientes" | "tratamentos" | "configuracoes";

export interface AgendamentoDB {
    id: number;
    paciente_id: number;
    paciente_nome: string;
    paciente_telefone?: string;
    procedimento_id: number;
    procedimento_nome: string;
    duracao_minutos: number;
    data_hora_inicio: string;
    data_hora_fim: string;
    estado: "AGENDADO" | "CONCLUIDO" | "CANCELADO";
    is_emergencia: number;
    observacao?: string;
    criado_em?: string;
}

export interface PacienteDB {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    criado_em?: string;
}

export interface ProcedimentoDB {
    id: number;
    nome: string;
    descricao?: string;
    duracao_minutos: number;
}

// Extrai estritamente 'AAAA-MM-DD' sem desvio de Timezone UTC
const extrairDataLocal = (dataValor: string | Date): string => {
    if (!dataValor) return "";
    if (typeof dataValor === "string") {
        if (dataValor.includes("T")) return dataValor.split("T")[0];
        if (dataValor.includes(" ")) return dataValor.split(" ")[0];
    }
    const d = new Date(dataValor);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

// Formata o horário local HH:mm a partir de string 'AAAA-MM-DD HH:mm:ss' ou ISO
const extrairHoraLocal = (dataValor: string): string => {
    if (!dataValor) return "--:--";
    if (dataValor.includes("T")) {
        const partes = dataValor.split("T")[1];
        return partes.substring(0, 5);
    }
    if (dataValor.includes(" ")) {
        const partes = dataValor.split(" ")[1];
        return partes.substring(0, 5);
    }
    const d = new Date(dataValor);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

export function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>("visao-geral");
    const [baixandoExcel, setBaixandoExcel] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados dos dados da API
    const [agendamentos, setAgendamentos] = useState<AgendamentoDB[]>([]);
    const [pacientes, setPacientes] = useState<PacienteDB[]>([]);
    const [procedimentos, setProcedimentos] = useState<ProcedimentoDB[]>([]);
    const [busca, setBusca] = useState("");
    const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());

    // Estados do Modal "Novo Agendamento"
    const [modalAberto, setModalAberto] = useState(false);
    const [salvandoAgendamento, setSalvandoAgendamento] = useState(false);
    const [formPacienteId, setFormPacienteId] = useState<number | "">("");
    const [formProcedimentoId, setFormProcedimentoId] = useState<number | "">("");
    const [formData, setFormData] = useState("");
    const [formHora, setFormHora] = useState("");
    const [formObservacao, setFormObservacao] = useState("Agendado pela Dra. Thaís");

    // Estados do Formulário de "Novo Tratamento" (Aba Tratamentos)
    const [cadastrandoTratamento, setCadastrandoTratamento] = useState(false);
    const [novoTratamentoNome, setNovoTratamentoNome] = useState("");
    const [novoTratamentoDesc, setNovoTratamentoDesc] = useState("");
    const [novoTratamentoDuracao, setNovoTratamentoDuracao] = useState<number>(45);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [listaAgendamentos, listaPacientes, listaProcedimentos] = await Promise.all([
                api.getAgendamentos().catch(() => []),
                api.getPacientes().catch(() => []),
                api.getProcedimentos().catch(() => [])
            ]);

            setAgendamentos(listaAgendamentos);
            setPacientes(listaPacientes);
            setProcedimentos(listaProcedimentos);

            if (listaProcedimentos.length > 0 && !formProcedimentoId) {
                setFormProcedimentoId(listaProcedimentos[0].id);
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erro ao carregar dados do painel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleDownloadExcel = async () => {
        try {
            setBaixandoExcel(true);
            await api.exportAgendamentosExcel();
        } catch (err: any) {
            alert(err.message || "Erro ao baixar planilha.");
        } finally {
            setBaixandoExcel(false);
        }
    };

    const handleAlterarStatus = async (id: number, novoEstado: "CONCLUIDO" | "CANCELADO") => {
        try {
            await api.updateStatusAgendamento(id, novoEstado);
            setAgendamentos((prev) =>
                prev.map((app) => (app.id === id ? { ...app, estado: novoEstado } : app))
            );
        } catch (err: any) {
            alert(err.message || "Erro ao atualizar status");
        }
    };

    const handleCriarAgendamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formPacienteId || !formProcedimentoId || !formData || !formHora) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            setSalvandoAgendamento(true);
            const dataHoraInicio = `${formData} ${formHora}:00`;

            await api.createAgendamento({
                paciente_id: Number(formPacienteId),
                procedimento_id: Number(formProcedimentoId),
                data_hora_inicio: dataHoraInicio,
                observacao: formObservacao.trim() || "Agendado pela Dra. Thaís"
            });

            alert("Consulta agendada com sucesso!");
            setModalAberto(false);
            setFormPacienteId("");
            setFormData("");
            setFormHora("");
            setFormObservacao("Agendado pela Dra. Thaís");

            await carregarDados();
        } catch (err: any) {
            alert(err.message || "Erro ao criar agendamento.");
        } finally {
            setSalvandoAgendamento(false);
        }
    };

    const handleCriarTratamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoTratamentoNome.trim()) {
            alert("Informe o nome do procedimento.");
            return;
        }

        try {
            setCadastrandoTratamento(true);
            await api.createProcedimento({
                nome: novoTratamentoNome.trim(),
                descricao: novoTratamentoDesc.trim(),
                duracao_minutos: Number(novoTratamentoDuracao)
            });

            alert("Tratamento cadastrado com sucesso!");
            setNovoTratamentoNome("");
            setNovoTratamentoDesc("");
            setNovoTratamentoDuracao(45);

            const atualizados = await api.getProcedimentos();
            setProcedimentos(atualizados);
        } catch (err: any) {
            alert(err.message || "Erro ao cadastrar tratamento");
        } finally {
            setCadastrandoTratamento(false);
        }
    };

    const handleExcluirTratamento = async (id: number) => {
        if (!confirm("Deseja realmente excluir este tratamento?")) return;

        try {
            await api.deleteProcedimento(id);
            setProcedimentos((prev) => prev.filter((p) => p.id !== id));
            alert("Tratamento removido com sucesso!");
        } catch (err: any) {
            alert(err.message || "Erro ao excluir tratamento");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("@clinica:token");
        navigate("/login");
    };

    const metricas = useMemo(() => {
        const hojeStr = extrairDataLocal(new Date());
        const agora = new Date().getTime();
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();

        const hoje = agendamentos.filter((a) => {
            const dt = extrairDataLocal(a.data_hora_inicio);
            return dt === hojeStr && a.estado !== "CANCELADO";
        });

        const mes = agendamentos.filter((a) => {
            const dtStr = extrairDataLocal(a.data_hora_inicio);
            if (!dtStr) return false;
            const [ano, mes] = dtStr.split("-").map(Number);
            return mes - 1 === mesAtual && ano === anoAtual && a.estado !== "CANCELADO";
        });

        const proximasHoje = hoje
            .filter((a) => new Date(a.data_hora_inicio.replace(" ", "T")).getTime() >= agora && a.estado === "AGENDADO")
            .sort((a, b) => new Date(a.data_hora_inicio.replace(" ", "T")).getTime() - new Date(b.data_hora_inicio.replace(" ", "T")).getTime());

        const proximaHora =
            proximasHoje.length > 0
                ? extrairHoraLocal(proximasHoje[0].data_hora_inicio) + "h"
                : "--:--";

        return {
            consultasHoje: hoje,
            totalHoje: hoje.length,
            totalMes: mes.length,
            proximaHora
        };
    }, [agendamentos]);

    const consultasAgendaDia = useMemo(() => {
        const dataStr = extrairDataLocal(dataSelecionada);
        return agendamentos.filter((a) => {
            const dt = extrairDataLocal(a.data_hora_inicio);
            return dt === dataStr;
        });
    }, [agendamentos, dataSelecionada]);

    const listaPacientesFormatada = useMemo(() => {
        const lista = pacientes.map((p) => {
            const consultasDoPaciente = agendamentos
                .filter((a) => a.paciente_id === p.id)
                .sort((a, b) => new Date(b.data_hora_inicio.replace(" ", "T")).getTime() - new Date(a.data_hora_inicio.replace(" ", "T")).getTime());

            const ultimaConsulta = consultasDoPaciente[0];

            return {
                id: p.id,
                nome: p.nome,
                telefone: p.telefone || "Não informado",
                ultimaConsulta: ultimaConsulta
                    ? new Date(ultimaConsulta.data_hora_inicio.replace(" ", "T")).toLocaleDateString("pt-BR")
                    : "Sem consultas",
                tratamento: ultimaConsulta ? ultimaConsulta.procedimento_nome : "Consulta Inicial",
                status: ultimaConsulta?.estado === "CONCLUIDO" ? "Concluído" : "Em Tratamento"
            };
        });

        if (!busca) return lista;
        return lista.filter(
            (p) =>
                p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                p.telefone.includes(busca)
        );
    }, [pacientes, agendamentos, busca]);

    const mudarDia = (dias: number) => {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + dias);
        setDataSelecionada(novaData);
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-main text-neutral-dark">
            {/* Sidebar do Administrador */}
            <aside className="w-[260px] bg-white border-r border-neutral-border p-6 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
                <div className="space-y-8">
                    <div className="pt-2 text-center border-b border-neutral-border/60 pb-4">
                        <h2 className="text-body-medium font-bold text-neutral-dark tracking-tight">
                            Dra. Thais Tardelli
                        </h2>
                        <p className="text-[11px] text-neutral-gray mt-0.5">Painel Administrativo</p>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        <button
                            type="button"
                            onClick={() => setActiveTab("visao-geral")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "visao-geral"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Visão Geral
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("agenda")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "agenda"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Calendar className="w-4 h-4" /> Agenda & Consultas
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("pacientes")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "pacientes"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Users className="w-4 h-4" /> Meus Pacientes
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("tratamentos")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "tratamentos"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Activity className="w-4 h-4" /> Tratamentos & Valores
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("configuracoes")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "configuracoes"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Settings className="w-4 h-4" /> Configurações
                        </button>
                    </nav>
                </div>

                <div className="pt-4 border-t border-neutral-border/60">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-neutral-gray hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sair do painel</span>
                    </button>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-18 px-8 bg-white border-b border-neutral-border flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-dark capitalize">
                            {activeTab === "visao-geral" && "Visão Geral"}
                            {activeTab === "agenda" && "Agendas e Consultas"}
                            {activeTab === "pacientes" && "Meus Pacientes"}
                            {activeTab === "tratamentos" && "Tratamentos e Serviços"}
                            {activeTab === "configuracoes" && "Configurações"}
                        </h1>
                        <p className="text-xs text-neutral-gray">Bem-vinda de volta, Dra. Thais 👋</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-neutral-gray absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar paciente ou consulta..."
                                className="pl-9 pr-4 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs outline-none focus:border-primary-main w-64"
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleDownloadExcel}
                            disabled={baixandoExcel}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                            {baixandoExcel ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="w-4 h-4" />
                            )}
                            <span>Exportar Excel</span>
                        </Button>

                        <button
                            type="button"
                            onClick={carregarDados}
                            title="Recarregar dados"
                            className="p-2 border border-neutral-border rounded-xl text-neutral-gray hover:text-neutral-dark cursor-pointer"
                        >
                            <Bell className="w-4 h-4" />
                        </button>

                        <div className="w-9 h-9 rounded-xl bg-primary-main text-white flex items-center justify-center font-bold text-xs">
                            TT
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-gray gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
                            <p className="text-xs">Carregando informações da clínica...</p>
                        </div>
                    ) : (
                        <>
                            {/* ABA 1: VISÃO GERAL */}
                            {activeTab === "visao-geral" && (
                                <div className="space-y-6 max-w-6xl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4 shadow-xs">
                                            <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-neutral-gray font-semibold">Consultas Hoje</span>
                                                <h3 className="text-2xl font-bold text-neutral-dark">
                                                    {metricas.totalHoje} {metricas.totalHoje === 1 ? "Atendimento" : "Atendimentos"}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4 shadow-xs">
                                            <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-neutral-gray font-semibold">Pacientes no Mês</span>
                                                <h3 className="text-2xl font-bold text-neutral-dark">
                                                    {metricas.totalMes} {metricas.totalMes === 1 ? "Paciente" : "Pacientes"}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4 shadow-xs">
                                            <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-neutral-gray font-semibold">Próxima Consulta</span>
                                                <h3 className="text-2xl font-bold text-neutral-dark">{metricas.proximaHora}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consultas de Hoje */}
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base font-bold text-neutral-dark">Consultas de Hoje</h2>
                                            <Button
                                                onClick={() => setModalAberto(true)}
                                                className="bg-primary-main hover:bg-primary-dark text-white rounded-xl py-2 px-4 text-xs cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Novo Agendamento
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {metricas.consultasHoje.length === 0 ? (
                                                <p className="text-xs text-neutral-gray py-6 text-center">
                                                    Nenhum agendamento marcado para o dia de hoje.
                                                </p>
                                            ) : (
                                                metricas.consultasHoje.map((c) => {
                                                    const horaInicio = extrairHoraLocal(c.data_hora_inicio);

                                                    return (
                                                        <div
                                                            key={c.id}
                                                            className="flex items-center justify-between p-4 bg-neutral-bg/60 border border-neutral-border/60 rounded-xl text-xs hover:bg-white transition"
                                                        >
                                                            <span className="font-bold text-neutral-dark px-3 py-1 bg-white border border-neutral-border rounded-lg">
                                                                {horaInicio}
                                                            </span>
                                                            <div className="flex-1 px-6">
                                                                <span className="font-semibold text-neutral-dark block">{c.paciente_nome}</span>
                                                                <span className="text-[11px] text-neutral-gray">{c.procedimento_nome}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <Badge
                                                                    status={
                                                                        c.estado === "CONCLUIDO"
                                                                            ? "concluida"
                                                                            : c.estado === "CANCELADO"
                                                                                ? "cancelada"
                                                                                : "confirmada"
                                                                    }
                                                                />
                                                                {c.estado === "AGENDADO" && (
                                                                    <div className="flex items-center gap-1 border-l pl-3 border-neutral-border">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAlterarStatus(c.id, "CONCLUIDO")}
                                                                            title="Marcar como Concluída"
                                                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer transition"
                                                                        >
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAlterarStatus(c.id, "CANCELADO")}
                                                                            title="Cancelar Consulta"
                                                                            className="p-1 text-red-500 hover:bg-red-50 rounded-md cursor-pointer transition"
                                                                        >
                                                                            <XCircle className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ABA 2: AGENDAS E CONSULTAS */}
                            {activeTab === "agenda" && (
                                <div className="space-y-6 max-w-6xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-neutral-border shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => mudarDia(-1)}
                                                className="p-1 hover:bg-neutral-bg rounded-lg cursor-pointer transition"
                                            >
                                                <ChevronLeft className="w-4 h-4 text-neutral-gray" />
                                            </button>
                                            <span className="font-bold text-sm text-neutral-dark capitalize">
                                                {dataSelecionada.toLocaleDateString("pt-BR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long"
                                                })}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => mudarDia(1)}
                                                className="p-1 hover:bg-neutral-bg rounded-lg cursor-pointer transition"
                                            >
                                                <ChevronRight className="w-4 h-4 text-neutral-gray" />
                                            </button>
                                        </div>

                                        <Button
                                            onClick={() => setModalAberto(true)}
                                            className="bg-primary-main hover:bg-primary-dark text-white rounded-xl py-2 px-4 text-xs cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Novo Agendamento
                                        </Button>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-4 min-h-[450px] shadow-xs">
                                        {consultasAgendaDia.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-neutral-gray gap-2">
                                                <AlertCircle className="w-8 h-8 stroke-1" />
                                                <p className="text-xs">Não há consultas agendadas para esta data.</p>
                                            </div>
                                        ) : (
                                            consultasAgendaDia.map((item) => {
                                                const inicio = extrairHoraLocal(item.data_hora_inicio);
                                                const fim = extrairHoraLocal(item.data_hora_fim);

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-start gap-6 border-b border-neutral-border/40 pb-4 last:border-0"
                                                    >
                                                        <span className="text-xs font-bold text-neutral-gray w-12 pt-1">{inicio}</span>
                                                        <div className="flex-1 bg-primary-light/40 border-l-4 border-primary-main p-4 rounded-xl flex items-center justify-between">
                                                            <div>
                                                                <span className="text-[11px] font-bold text-primary-main bg-white px-2 py-0.5 rounded-md">
                                                                    {item.procedimento_nome}
                                                                </span>
                                                                <h4 className="text-xs font-semibold text-neutral-dark mt-2">
                                                                    {item.paciente_nome}
                                                                </h4>
                                                                {item.observacao && (
                                                                    <p className="text-[11px] text-neutral-gray mt-1 italic">
                                                                        Obs: {item.observacao}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs text-neutral-gray">
                                                                    {inicio} - {fim}
                                                                </span>
                                                                <div className="mt-1 flex items-center justify-end gap-2">
                                                                    <Badge
                                                                        status={
                                                                            item.estado === "CONCLUIDO"
                                                                                ? "concluida"
                                                                                : item.estado === "CANCELADO"
                                                                                    ? "cancelada"
                                                                                    : "confirmada"
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ABA 3: MEUS PACIENTES */}
                            {activeTab === "pacientes" && (
                                <div className="space-y-6 max-w-6xl">
                                    <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden shadow-xs">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#FAFAFB] border-b border-neutral-border text-neutral-gray font-semibold uppercase text-[10px] tracking-wider">
                                                <tr>
                                                    <th className="py-4 px-6">Paciente</th>
                                                    <th className="py-4 px-6">Contato</th>
                                                    <th className="py-4 px-6">Última Consulta</th>
                                                    <th className="py-4 px-6">Tratamento</th>
                                                    <th className="py-4 px-6">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-border/60">
                                                {listaPacientesFormatada.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-8 text-center text-neutral-gray">
                                                            Nenhum paciente cadastrado encontrado.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    listaPacientesFormatada.map((p) => (
                                                        <tr key={p.id} className="hover:bg-neutral-bg/40 transition">
                                                            <td className="py-4 px-6">
                                                                <p className="font-bold text-neutral-dark">{p.nome}</p>
                                                            </td>
                                                            <td className="py-4 px-6 text-neutral-gray">{p.telefone}</td>
                                                            <td className="py-4 px-6 text-neutral-gray">{p.ultimaConsulta}</td>
                                                            <td className="py-4 px-6 font-medium text-neutral-dark">{p.tratamento}</td>
                                                            <td className="py-4 px-6">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full font-semibold text-[10px] ${p.status === "Concluído"
                                                                        ? "bg-neutral-100 text-neutral-600"
                                                                        : "bg-emerald-50 text-emerald-700"
                                                                        }`}
                                                                >
                                                                    {p.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ABA 4: TRATAMENTOS & VALORES */}
                            {activeTab === "tratamentos" && (
                                <div className="space-y-6 max-w-6xl">
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-xs">
                                        <div className="flex items-center gap-2 mb-4">
                                            <NotebookPen className="w-5 h-5 text-primary-main" />
                                            <h2 className="text-base font-bold text-neutral-dark">Cadastrar Novo Tratamento</h2>
                                        </div>
                                        <form onSubmit={handleCriarTratamento} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-end">
                                            <div className="md:col-span-2">
                                                <label className="block text-neutral-gray font-semibold mb-1">Nome do Procedimento *</label>
                                                <input
                                                    type="text"
                                                    value={novoTratamentoNome}
                                                    onChange={(e) => setNovoTratamentoNome(e.target.value)}
                                                    placeholder="Ex: Lentes de Contato Dental"
                                                    required
                                                    className="w-full p-3 bg-neutral-bg border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-neutral-gray font-semibold mb-1">Duração (Minutos) *</label>
                                                <input
                                                    type="number"
                                                    step={5}
                                                    min={15}
                                                    value={novoTratamentoDuracao}
                                                    onChange={(e) => setNovoTratamentoDuracao(Number(e.target.value))}
                                                    required
                                                    className="w-full p-3 bg-neutral-bg border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                                />
                                            </div>
                                            <div>
                                                <Button
                                                    type="submit"
                                                    disabled={cadastrandoTratamento}
                                                    className="w-full bg-primary-main hover:bg-primary-dark text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    {cadastrandoTratamento ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                    <span>Adicionar</span>
                                                </Button>
                                            </div>
                                            <div className="md:col-span-4">
                                                <label className="block text-neutral-gray font-semibold mb-1">Descrição / Detalhes</label>
                                                <input
                                                    type="text"
                                                    value={novoTratamentoDesc}
                                                    onChange={(e) => setNovoTratamentoDesc(e.target.value)}
                                                    placeholder="Breve resumo clínico ou orientações prévias..."
                                                    className="w-full p-3 bg-neutral-bg border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                                />
                                            </div>
                                        </form>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-xs space-y-4">
                                        <h3 className="font-bold text-sm text-neutral-dark">Tratamentos Ativos na Clínica ({procedimentos.length})</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {procedimentos.map((proc) => (
                                                <div
                                                    key={proc.id}
                                                    className="p-4 border border-neutral-border/80 rounded-2xl bg-neutral-bg/30 flex items-start justify-between gap-3 hover:bg-neutral-bg/60 transition"
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-xs text-neutral-dark">{proc.nome}</h4>
                                                            <span className="text-[10px] bg-primary-light text-primary-main font-semibold px-2 py-0.5 rounded-md">
                                                                {proc.duracao_minutos} min
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-neutral-gray mt-1 leading-relaxed">
                                                            {proc.descricao || "Sem descrição informada."}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleExcluirTratamento(proc.id)}
                                                        title="Excluir procedimento"
                                                        className="p-2 text-neutral-gray hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ABA 5: CONFIGURAÇÕES */}
                            {activeTab === "configuracoes" && (
                                <div className="max-w-4xl bg-white p-8 rounded-2xl border border-neutral-border space-y-6 shadow-xs">
                                    <h2 className="text-base font-bold text-neutral-dark">Dados da Clínica</h2>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <label className="block text-neutral-gray font-semibold mb-1">Nome da Clínica</label>
                                            <input
                                                type="text"
                                                defaultValue="Clínica Dra. Thais Tardelli"
                                                className="w-full p-3 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-neutral-gray font-semibold mb-1">CNPJ</label>
                                            <input
                                                type="text"
                                                defaultValue="12.345.678/0001-90"
                                                disabled
                                                className="w-full p-3 border border-neutral-border rounded-xl bg-neutral-bg text-neutral-gray cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer">
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* MODAL: NOVO AGENDAMENTO */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-neutral-border w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary-main">
                                    <UserCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-neutral-dark">Novo Agendamento</h3>
                                    <p className="text-[11px] text-neutral-gray">Agendar consulta para um paciente cadastrado</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="p-1.5 rounded-lg hover:bg-neutral-bg text-neutral-gray cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCriarAgendamento} className="space-y-4 pt-4 text-xs">
                            <div>
                                <label className="block font-semibold text-neutral-dark mb-1">Paciente *</label>
                                <select
                                    value={formPacienteId}
                                    onChange={(e) => setFormPacienteId(Number(e.target.value))}
                                    required
                                    className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                >
                                    <option value="">Selecione um paciente cadastrado...</option>
                                    {pacientes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome} {p.telefone ? `(${p.telefone})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-neutral-dark mb-1">Procedimento *</label>
                                <select
                                    value={formProcedimentoId}
                                    onChange={(e) => setFormProcedimentoId(Number(e.target.value))}
                                    required
                                    className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                >
                                    <option value="">Selecione o procedimento...</option>
                                    {procedimentos.map((proc) => (
                                        <option key={proc.id} value={proc.id}>
                                            {proc.nome} ({proc.duracao_minutos} min)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-neutral-dark mb-1">Data *</label>
                                    <input
                                        type="date"
                                        value={formData}
                                        onChange={(e) => setFormData(e.target.value)}
                                        required
                                        className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-neutral-dark mb-1">Horário *</label>
                                    <input
                                        type="time"
                                        value={formHora}
                                        onChange={(e) => setFormHora(e.target.value)}
                                        required
                                        className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-neutral-dark mb-1">Observações</label>
                                <input
                                    type="text"
                                    value={formObservacao}
                                    onChange={(e) => setFormObservacao(e.target.value)}
                                    placeholder="Ex: Agendado pela Dra. Thaís"
                                    className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-border">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="px-4 py-2.5 rounded-xl border border-neutral-border text-neutral-gray hover:bg-neutral-bg cursor-pointer font-semibold"
                                >
                                    Cancelar
                                </button>
                                <Button
                                    type="submit"
                                    disabled={salvandoAgendamento}
                                    className="bg-primary-main hover:bg-primary-dark text-white rounded-xl px-5 py-2.5 cursor-pointer font-semibold flex items-center gap-2"
                                >
                                    {salvandoAgendamento && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>Confirmar Agendamento</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;