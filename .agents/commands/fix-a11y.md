---
name: /fix-a11y
description: "Corrige problemas de acessibilidade em componentes/páginas"
usage: "/fix-a11y [arquivo ou componente]"
---

# Comando: Corrigir Acessibilidade

## Checklist de Correções

### Estrutura
- [ ] Headings em ordem hierárquica
- [ ] Landmarks corretos (header, nav, main, footer)
- [ ] Listas para itens relacionados

### Formulários
- [ ] Labels associados
- [ ] Campos obrigatórios indicados
- [ ] Erros com `aria-describedby`
- [ ] Instruções claras

### Interatividade
- [ ] Botões para ações (não div/span)
- [ ] Links para navegação
- [ ] Foco visível
- [ ] Estados hover/focus definidos
- [ ] `aria-expanded` para expandir/recolher

### Conteúdo
- [ ] Alt text descritivo
- [ ] Contraste adequado
- [ ] Texto não depende apenas de cor
- [ ] `aria-hidden` para decorativos

### Teclado
- [ ] Todos elementos interativos acessíveis por Tab
- [ ] Ordem lógica
- [ ] Atalhos não conflitantes
- [ ] Skip link presente