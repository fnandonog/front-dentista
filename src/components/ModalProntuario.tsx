import { useState, useEffect } from "react";
import { X, Loader2, Save, FileText } from "lucide-react";
import { Button } from "./ui/Button";
import { api } from "../services/api";

interface ModalProntuarioProps {
    paciente: {
        id: number,
        nome: string,
        telefone?: string;
    } | null;
    onClose: () => void;
}

export function ModalProntuario({ paciente, onClose }: ModalProntuarioProps) {
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [isEdicao, setIsEdicao] = useState(false);

    const [anamnese, setAnamnese] = useState("");
    const [historicoTratamento, setHistoricoTratamento] = useState("");
    const [controleProtese, setControleProtese] = useState("");
    const [followUpEvolucao, setFollowUpEvolucao] = useState("");

    useEffect(() => {
        if (!paciente) return;

        const carregar = async () => {
            try {
                setLoading(true);
                const data = await api.getProntuarioByPacienteId(paciente.id);

                if (data) {
                    setIsEdicao(true);
                    setAnamnese(data.anamnese || "");
                    setHistoricoTratamento(data.historico_tratamento || "");
                    setControleProtese(data.controle_protese || "");
                    setFollowUpEvolucao(data.follow_up_evolucao || "");
                } else {
                    setIsEdicao(false);
                    setAnamnese("");
                    setHistoricoTratamento("");
                    setControleProtese("");
                    setFollowUpEvolucao("");
                }
            } catch (err: any) {
                alert(err.message || "Erro ao carregar prontuário.");
            } finally {
                setLoading(false);
            }
        };

        carregar();
    }, [paciente]);

    if (!paciente) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSalvando(true);
            await api.saveProntuario({
                paciente_id: paciente.id,
                isEdicao,
                anamnese,
                historico_tratamento: historicoTratamento,
                controle_protese: controleProtese,
                follow_up_evolucao: followUpEvolucao
            });
            alert("Prontuário salvo com sucesso!");
            onClose();
        } catch (err: any) {
            alert(err.message || "Erro ao salvar prontuário.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-neutral-border w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary-main">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-neutral-dark">
                                Prontuário Clínico: {paciente.nome}
                            </h3>
                            <p className="text-[11px] text-neutral-gray">
                                {isEdicao ? "Atualizando histórico existente" : "Novo registro clínico"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-bg text-neutral-gray cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-gray gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-main" />
                        <p className="text-xs">Buscando dados do prontuário...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 text-xs pr-1">
                        <div>
                            <label className="block font-semibold text-neutral-dark mb-1">
                                Anamnese / Queixa Principal
                            </label>
                            <textarea
                                rows={3}
                                value={anamnese}
                                onChange={(e) => setAnamnese(e.target.value)}
                                placeholder="Histórico de saúde, alergias, queixa principal relatada..."
                                className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main resize-none"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-neutral-dark mb-1">
                                Histórico de Procedimentos Realizados
                            </label>
                            <textarea
                                rows={3}
                                value={historicoTratamento}
                                onChange={(e) => setHistoricoTratamento(e.target.value)}
                                placeholder="Restaurações, canais, extrações, datas e materiais..."
                                className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-neutral-dark mb-1">
                                    Controle de Prótese / Aparelho
                                </label>
                                <textarea
                                    rows={3}
                                    value={controleProtese}
                                    onChange={(e) => setControleProtese(e.target.value)}
                                    placeholder="Cor, molde, laboratório, ajustes..."
                                    className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main resize-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-neutral-dark mb-1">
                                    Follow-up & Evolução
                                </label>
                                <textarea
                                    rows={3}
                                    value={followUpEvolucao}
                                    onChange={(e) => setFollowUpEvolucao(e.target.value)}
                                    placeholder="Orientações pós-operatórias, cicatrização..."
                                    className="w-full p-3 bg-neutral-bg/60 border border-neutral-border rounded-xl outline-none focus:border-primary-main resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl border border-neutral-border text-neutral-gray hover:bg-neutral-bg cursor-pointer font-semibold"
                            >
                                Cancelar
                            </button>
                            <Button
                                type="submit"
                                disabled={salvando}
                                className="bg-primary-main hover:bg-primary-dark text-white rounded-xl px-5 py-2.5 cursor-pointer font-semibold flex items-center gap-2"
                            >
                                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{isEdicao ? "Atualizar Prontuário" : "Salvar Prontuário"}</span>
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}