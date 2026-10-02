import { useState } from "react";
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
    FileText,
    Edit2
} from "lucide-react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export type AdminTab = "visao-geral" | "agenda" | "pacientes" | "tratamentos" | "configuracoes";

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("visao-geral");

    // Dados mockados profissionais para exibição limpa
    const consultasHoje = [
        { horario: "09:00", paciente: "João Miguel da Silva", status: "concluida" as const },
        { horario: "10:00", paciente: "Lucas Henrique Ferreira", status: "pendente" as const },
        { horario: "14:00", paciente: "Matheus Bezerra", status: "confirmada" as const },
        { horario: "17:15", paciente: "Gabriel Sartório", status: "confirmada" as const },
    ];

    const listaPacientes = [
        {
            nome: "João Miguel da Silva",
            cpf: "123.456.789-00",
            contato: "(19) 99888-7766",
            ultimaConsulta: "15/09/2026",
            tratamento: "Clareamento Laser",
            status: "Em Tratamento",
        },
        {
            nome: "Lucas Henrique Ferreira",
            cpf: "253.456.312-00",
            contato: "(19) 98838-2134",
            ultimaConsulta: "16/09/2026",
            tratamento: "Limpeza / Profilaxia",
            status: "Em Análise",
        },
        {
            nome: "Matheus Barrense",
            cpf: "133.444.888-00",
            contato: "(19) 99693-5793",
            ultimaConsulta: "01/10/2026",
            tratamento: "Clareamento Laser",
            status: "Em Tratamento",
        },
        {
            nome: "Fernando Nogueira",
            cpf: "123.456.789-11",
            contato: "(19) 99214-7766",
            ultimaConsulta: "15/09/2026",
            tratamento: "Ortodontia & Alinhadores",
            status: "Concluída",
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-main text-neutral-dark">
            {/* Sidebar do Administrador */}
            <aside className="w-[260px] bg-white border-r border-neutral-border p-6 flex flex-col justify-between shrink-0">
                <div className="space-y-8">
                    <div className="pt-2 text-center border-b border-neutral-border/60 pb-4">
                        <h2 className="text-body-medium font-bold text-neutral-dark tracking-tight">
                            Dra. Thais Tardelli
                        </h2>
                        <p className="text-[11px] text-neutral-gray mt-0.5">Painel Administrativo</p>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        <button
                            onClick={() => setActiveTab("visao-geral")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "visao-geral"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Visão Geral
                        </button>

                        <button
                            onClick={() => setActiveTab("agenda")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "agenda"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Calendar className="w-4 h-4" /> Agenda & Consultas
                        </button>

                        <button
                            onClick={() => setActiveTab("pacientes")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "pacientes"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Users className="w-4 h-4" /> Meus Pacientes
                        </button>

                        <button
                            onClick={() => setActiveTab("tratamentos")}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-xs transition cursor-pointer ${activeTab === "tratamentos"
                                ? "bg-primary-light text-primary-main"
                                : "text-neutral-gray hover:bg-neutral-bg hover:text-neutral-dark"
                                }`}
                        >
                            <Activity className="w-4 h-4" /> Tratamentos & Valores
                        </button>

                        <button
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
            </aside>

            {/* Área de Conteúdo Principal */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-18 px-8 bg-white border-b border-neutral-border flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-dark capitalize">
                            {activeTab === "visao-geral" && "Visão Geral"}
                            {activeTab === "agenda" && "Agendas e Consultas"}
                            {activeTab === "pacientes" && "Meus Pacientes"}
                            {activeTab === "tratamentos" && "Tratamentos e Valores"}
                            {activeTab === "configuracoes" && "Configurações"}
                        </h1>
                        <p className="text-xs text-neutral-gray">Bem-vinda de volta, Dra. Thais 👋</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-neutral-gray absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar paciente ou consulta..."
                                className="pl-9 pr-4 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs outline-none focus:border-primary-main w-64"
                            />
                        </div>
                        <button className="p-2 border border-neutral-border rounded-xl text-neutral-gray hover:text-neutral-dark">
                            <Bell className="w-4 h-4" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-primary-main text-white flex items-center justify-center font-bold text-xs">
                            TT
                        </div>
                    </div>
                </header>

                {/* Corpo da Aba */}
                <main className="flex-1 p-8 overflow-y-auto space-y-6">
                    {/* ABA 1: VISÃO GERAL */}
                    {activeTab === "visao-geral" && (
                        <div className="space-y-6 max-w-6xl">
                            {/* Cards de Métricas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4">
                                    <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-gray font-semibold">Consultas Hoje</span>
                                        <h3 className="text-2xl font-bold text-neutral-dark">8 Atendimentos</h3>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4">
                                    <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-gray font-semibold">Pacientes no Mês</span>
                                        <h3 className="text-2xl font-bold text-neutral-dark">42 Pacientes</h3>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-neutral-border flex items-center gap-4">
                                    <div className="p-3 bg-neutral-bg rounded-xl text-primary-main">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-neutral-gray font-semibold">Próxima Consulta</span>
                                        <h3 className="text-2xl font-bold text-neutral-dark">14:00h</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Tabela de Consultas de Hoje */}
                            <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-bold text-neutral-dark">Consultas de Hoje</h2>
                                    <Button className="bg-primary-main hover:bg-primary-dark text-white rounded-xl py-2 px-4 text-xs">
                                        <Plus className="w-3.5 h-3.5 mr-1" /> Novo Agendamento
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {consultasHoje.map((c, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-neutral-bg/60 border border-neutral-border/60 rounded-xl text-xs"
                                        >
                                            <span className="font-bold text-neutral-dark px-3 py-1 bg-white border border-neutral-border rounded-lg">
                                                {c.horario}
                                            </span>
                                            <span className="font-semibold text-neutral-dark flex-1 px-6">{c.paciente}</span>
                                            <Badge status={c.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABA 2: AGENDAS E CONSULTAS (Grade Horária) */}
                    {activeTab === "agenda" && (
                        <div className="space-y-6 max-w-6xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button className="p-1 hover:bg-neutral-bg rounded-lg">
                                        <ChevronLeft className="w-4 h-4 text-neutral-gray" />
                                    </button>
                                    <span className="font-bold text-sm text-neutral-dark">Quinta-feira, 24 de Setembro</span>
                                    <button className="p-1 hover:bg-neutral-bg rounded-lg">
                                        <ChevronRight className="w-4 h-4 text-neutral-gray" />
                                    </button>
                                </div>
                                <Button className="bg-primary-main hover:bg-primary-dark text-white rounded-xl py-2 px-4 text-xs">
                                    <Plus className="w-3.5 h-3.5 mr-1" /> Novo Agendamento
                                </Button>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-6 min-h-[500px]">
                                <div className="flex items-start gap-6 border-b border-neutral-border/40 pb-6">
                                    <span className="text-xs font-bold text-neutral-gray w-12 pt-1">08:00</span>
                                    <div className="flex-1 bg-primary-light/60 border-l-4 border-primary-main p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold text-primary-main bg-white px-2 py-0.5 rounded-md">
                                                Limpeza
                                            </span>
                                            <h4 className="text-xs font-semibold text-neutral-dark mt-2">Lucas Henrique Ferreira</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-neutral-gray">08:00 - 08:45</span>
                                            <div className="mt-1">
                                                <Badge status="confirmada" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 border-b border-neutral-border/40 pb-6">
                                    <span className="text-xs font-bold text-neutral-gray w-12 pt-1">14:00</span>
                                    <div className="flex-1 bg-primary-light/60 border-l-4 border-primary-main p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold text-primary-main bg-white px-2 py-0.5 rounded-md">
                                                Limpeza / Profilaxia
                                            </span>
                                            <h4 className="text-xs font-semibold text-neutral-dark mt-2">Lucas Henrique Ferreira</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-neutral-gray">14:00 - 14:30</span>
                                            <div className="mt-1">
                                                <Badge status="confirmada" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABA 3: MEUS PACIENTES */}
                    {activeTab === "pacientes" && (
                        <div className="space-y-6 max-w-6xl">
                            <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#FAFAFB] border-b border-neutral-border text-neutral-gray font-semibold uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="py-4 px-6">Paciente</th>
                                            <th className="py-4 px-6">Contato</th>
                                            <th className="py-4 px-6">Última Consulta</th>
                                            <th className="py-4 px-6">Tratamento</th>
                                            <th className="py-4 px-6">Status</th>
                                            <th className="py-4 px-6 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-border/60">
                                        {listaPacientes.map((p, i) => (
                                            <tr key={i} className="hover:bg-neutral-bg/40 transition">
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-neutral-dark">{p.nome}</p>
                                                    <p className="text-[10px] text-neutral-gray">CPF: {p.cpf}</p>
                                                </td>
                                                <td className="py-4 px-6 text-neutral-gray">{p.contato}</td>
                                                <td className="py-4 px-6 text-neutral-gray">{p.ultimaConsulta}</td>
                                                <td className="py-4 px-6 font-medium text-neutral-dark">{p.tratamento}</td>
                                                <td className="py-4 px-6">
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-[10px]">
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right space-x-2 text-neutral-gray">
                                                    <button className="hover:text-primary-main"><FileText className="w-4 h-4 inline" /></button>
                                                    <button className="hover:text-primary-main"><Edit2 className="w-4 h-4 inline" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ABA 4: CONFIGURAÇÕES */}
                    {activeTab === "configuracoes" && (
                        <div className="max-w-4xl bg-white p-8 rounded-2xl border border-neutral-border space-y-6">
                            <h2 className="text-base font-bold text-neutral-dark">Dados da Clínica</h2>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block text-neutral-gray font-semibold mb-1">Nome da Clínica</label>
                                    <input
                                        type="text"
                                        defaultValue="Clínica Dra. Thais Tardelli"
                                        className="w-full p-3 border border-neutral-border rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-gray font-semibold mb-1">CNPJ</label>
                                    <input
                                        type="text"
                                        defaultValue="12.345.678/0001-90"
                                        disabled
                                        className="w-full p-3 border border-neutral-border rounded-xl bg-neutral-bg"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="bg-primary-main text-white px-6 py-2.5 rounded-xl text-xs font-semibold">
                                    Salvar Alterações
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}