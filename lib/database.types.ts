/**
 * Tipos do banco.
 *
 * ⚠️ Este arquivo é GERADO — não edite à mão. Depois de cada migração:
 *
 *     npm run db:types
 *
 * Esquecer disto tem uma assinatura clara: o TypeScript não conhece a coluna
 * nova, ou o CI acusa que os tipos divergem do schema. (No saas-gestao uma
 * tabela ficou dois dias sem tipo por causa disso.)
 *
 * O conteúdo abaixo é o mínimo do núcleo, para o projeto compilar antes da
 * primeira geração.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizacoes: {
        Row: {
          cantos: string | null;
          cor_primaria: string | null;
          cor_secundaria: string | null;
          criado_em: string;
          documento: string | null;
          fonte: string | null;
          id: string;
          logo_url: string | null;
          nome: string;
          tema: string | null;
        };
        Insert: {
          cantos?: string | null;
          cor_primaria?: string | null;
          cor_secundaria?: string | null;
          criado_em?: string;
          documento?: string | null;
          fonte?: string | null;
          id?: string;
          logo_url?: string | null;
          nome: string;
          tema?: string | null;
        };
        Update: {
          cantos?: string | null;
          cor_primaria?: string | null;
          cor_secundaria?: string | null;
          criado_em?: string;
          documento?: string | null;
          fonte?: string | null;
          id?: string;
          logo_url?: string | null;
          nome?: string;
          tema?: string | null;
        };
        Relationships: [];
      };
      usuarios: {
        Row: {
          ativo: boolean;
          criado_em: string;
          email: string | null;
          id: string;
          nome: string;
          organizacao_id: string;
        };
        Insert: {
          ativo?: boolean;
          criado_em?: string;
          email?: string | null;
          id: string;
          nome?: string;
          organizacao_id: string;
        };
        Update: {
          ativo?: boolean;
          criado_em?: string;
          email?: string | null;
          id?: string;
          nome?: string;
          organizacao_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "usuarios_organizacao_id_fkey";
            columns: ["organizacao_id"];
            isOneToOne: false;
            referencedRelation: "organizacoes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      organizacao_atual: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
