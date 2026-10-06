const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    // Adicionar exportação Excel do Backend
    async exportAgendamentosExcel() {
        const token = localStorage.getItem('@clinica:token');
        const response = await fetch(`${API_BASE_URL}/agendamentos/exportar/excel`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao exportar a planílha de agendamentos!');
        }

        // Criando a Blob e disparando o download no navegador
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_agendamentos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },

    // Consultar ViaCep pelo Backend
    async getAddressByCep(cep: string) {
        const cleanCep = cep.replace(/\D/g, '');
        const resposne = await fetch(`${API_BASE_URL}/usuarios/cep/${cleanCep}`);

        if (!resposne.ok) {
            throw new Error('Não foi possível encontrar o endereço para este CEP!');
        }
        return resposne.json();
    },

    // Criar Usuário
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
    }
};