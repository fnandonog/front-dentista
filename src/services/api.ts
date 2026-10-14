const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders() {
    const token = localStorage.getItem('@clinica:token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

export const api = {
    // ==========================================
    // AUTENTICAÇÃO E USUÁRIOS
    // ==========================================

    // Consultar ViaCep pelo Backend
    async getAddressByCep(cep: string) {
        const cleanCep = cep.replace(/\D/g, '');
        const response = await fetch(`${API_BASE_URL}/usuarios/cep/${cleanCep}`);

        if (!response.ok) {
            throw new Error('Não foi possível encontrar o endereço para este CEP!');
        }
        return response.json();
    },

    // Criar Usuário (Cadastro)
    async register(userData: {
        nome: string;
        email: string;
        senha: string;
        telefone: string;
        cep?: string;
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        uf?: string;
        tipo?: 'PACIENTE' | 'CLINICA';
    }) {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao realizar cadastro!');
        }

        if (data.token) {
            localStorage.setItem('@clinica:token', data.token);
        }

        return data;
    },

    // Login do Usuário
    async login(credentials: { email: string; senha: string }) {
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Falha no Login!');
        }

        if (data.token) {
            localStorage.setItem('@clinica:token', data.token);
        }

        return data;
    },

    // ==========================================
    // AGENDAMENTOS (CONECTADO AO APPOINTMENT CONTROLLER)
    // ==========================================

    // Listar agendamentos (READ ALL / GET)
    async getAgendamentos() {
        const response = await fetch(`${API_BASE_URL}/agendamentos`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Erro ao carregar agendamento!');
        }

        return data;
    },

    // Buscar Agendamento por ID (READ BY ID / GET)
    async getAgendamentoById(id: number | string) {
        const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Erro ao buscar agendamento!');
        }

        return data;
    },

    // Criar Agendamento (CREATE / POST)
    async createAgendamento(appointmentData: {
        procedimento_id: number;
        data_hora_inicio: string;
        data_hora_fim: string;
        paciente_id?: number;
        estado?: string;
        is_emergencia?: number;
        observacao?: string;
    }) {
        const response = await fetch(`${API_BASE_URL}/agendamentos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(appointmentData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Erro ao agendar consulta!');
        }

        return data;
    },

    // Atualizar Estado da consulta
    async updateEstadoAgendamento(id: number | string, estado: string) {
        const response = await fetch(`${API_BASE_URL}/agendamentos/${id}/estado`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ estado })
        });

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Erro ao atualizar consulta!');
        }

        return data;
    },

    // Deletar Agendamento (DELETE /agendamentos/:id)
    async deleteAgendamento(id: number | string) {
        const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Erro ao excluir agendamento!');
        }

        return data;
    },

    // Exportação Excel do Backend (GET /agendamentos/exportar/excel)
    async exportAgendamentosExcel() {
        const token = localStorage.getItem('@clinica:token');
        const response = await fetch(`${API_BASE_URL}/agendamentos/exportar/excel`, {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao exportar a planilha de agendamentos!');
        }

        // Criar Blob e disparar o download no nav
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_agendamentos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },

    async getHorariosOcupados() {
        const response = await fetch(`${API_BASE_URL}/agendamentos/ocupados`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) return [];
        return await response.json();
    },

    async updatePerfil(dados: { nome: string; email: string; telefone: string }) {
        const resposne = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados),
        });

        const data = await resposne.json();
        if (!resposne.ok) {
            throw new Error(data.error || "Erro ao atualizar dados do perfil");
        }
        return data;
    },
};

export default api;