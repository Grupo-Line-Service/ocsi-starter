import { FlatCompat } from "@eslint/eslintrc";

/**
 * Lint do template — e por que ele existe.
 *
 * Este repo tinha `"lint": "next lint"` no package.json e NENHUM eslint
 * instalado, nenhuma config. Rodar `npm run lint` abria o assistente
 * interativo do Next e travava: um portão que só PARECIA existir, herdado por
 * todo produto que nasce daqui.
 *
 * ⚠️ Por que FlatCompat, e não o import nativo como no `ocsi-site`:
 * o `eslint-config-next` só passou a exportar flat config (arrays direto) na
 * versão 16. Aqui o Next é 15, e o `eslint-config-next@15` ainda exporta o
 * formato legado (`{ extends }`) — medido com `require()`. Então o compat é
 * necessário, e foi TESTADO: não estoura nesta combinação.
 *
 * Quando o template subir para o Next 16, trocar isto pelo import nativo do
 * `ocsi-site` (`eslint-config-next/core-web-vitals` + `/typescript`), que
 * dispensa o compat.
 */
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // `next-env.d.ts` é GERADO pelo Next a cada build e vem com um triple-slash
    // reference que a regra @typescript-eslint/triple-slash-reference recusa.
    // Não é código nosso e não se edita — reescrevê-lo é desfeito no build
    // seguinte.
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
