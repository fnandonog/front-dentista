import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { User } from "lucide-react";

export function MeuPerfil() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-dark">Meu Perfil</h1>
                <p className="text-sm text-neutral-gray mt-1">
                    Edite as principais informações de seu perfil pessoal.
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-neutral-border space-y-8 shadow-xs">
                {/* Cabeçalho do Perfil com Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-neutral-bg border border-neutral-border flex items-center justify-center text-neutral-gray">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-dark text-base">Beatriz Nogueira Moreira</h3>
                        <button
                            type="button"
                            className="text-xs font-semibold text-primary-main hover:underline mt-0.5 cursor-pointer"
                        >
                            Alterar Foto
                        </button>
                    </div>
                </div>

                {/* Formulário com Grid */}
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nome Completo"
                            defaultValue="Beatriz Nogueira Moreira"
                        />
                        <Input
                            label="CPF"
                            defaultValue="696.696.69-69"
                            disabled
                            className="bg-neutral-bg cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="E-mail"
                            type="email"
                            defaultValue="bebedofe@gmail.com"
                        />
                        <Input
                            label="Telefone / WhatsApp"
                            defaultValue="+55 (19) 98178-8940"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            className="bg-primary-main hover:bg-primary-dark text-white rounded-xl px-8 py-3.5 text-sm font-semibold"
                        >
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}