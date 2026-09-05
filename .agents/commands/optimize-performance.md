---
name: /optimize-performance
description: "Audita e otimiza performance da página/componente"
usage: "/optimize-performance [rota]"
---

# Comando: Otimizar Performance

## Passos
1. **Auditar**
   - Rodar Lighthouse
   - Verificar Core Web Vitals
   - Analisar bundle com `@next/bundle-analyzer`

2. **Imagens**
   - Converter para WebP/AVIF
   - Adicionar `width`/`height`
   - `priority` para LCP
   - `loading="lazy"` abaixo da dobra

3. **JavaScript**
   - Dynamic imports para componentes pesados
   - Remover dependências não usadas
   - Verificar tree-shaking

4. **CSS**
   - Remover CSS não utilizado
   - Verificar ordem de carregamento

5. **Caching**
   - Configurar headers
   - ISR para conteúdo dinâmico
   - Static para conteúdo estático

6. **Medir**
   - Comparar antes/depois
   - Documentar melhorias