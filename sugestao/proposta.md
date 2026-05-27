# Proposta de Endpoints — Painel Admin e Dashboard

> Versão 1 · 2026-05-26  
> Complemento ao `doc-java.md`. Os endpoints da seção 4 daquele documento são detalhados aqui.  
> Base URL: `http://localhost:8080`

---

## Contexto

A pesquisa tem estrutura fixa: **7 sistemas × 4 etapas × 3 questões = 84 questões** por pesquisa.  
Questões do tipo `"M"` (múltipla escolha) usam escala de 1 a 4:

| Valor | Letra | Texto |
|-------|-------|-------|
| 1 | A | Discordo totalmente |
| 2 | B | Discordo parcialmente |
| 3 | C | Concordo parcialmente |
| 4 | D | Concordo totalmente |

Questões do tipo `"S"` (subjetivas) recebem texto livre.  
As médias e percentuais do dashboard são calculados sobre as questões do tipo `"M"` — as subjetivas ficam em endpoint próprio.

---

## Parte 1 — Gestão de Pesquisas (Painel Admin)

Endpoints necessários para o CRUD completo. `POST /api/pesquisas` já está definido no `doc-java.md`.

---

### 1.1 Atualizar Pesquisa

**`PUT /api/pesquisas/{id}`**

Permite editar nome, descrição, área e datas. Só funciona se o status for `1` (Aberta) — pesquisas em andamento ou encerradas não podem ser editadas.

**Request**
```json
{
  "nome": "Pesquisa de Satisfação Digital - Revisado",
  "descricao": "Descrição atualizada.",
  "areaId": 2,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-07-31"
}
```

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Pesquisa de Satisfação Digital - Revisado",
  "descricao": "Descrição atualizada.",
  "areaId": 2,
  "areaNome": "Gestão de Pessoas",
  "status": 1,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-07-31"
}
```

**Response `409 Conflict`** — pesquisa não pode ser editada
```json
{
  "erro": "OPERACAO_INVALIDA",
  "mensagem": "Pesquisa com status 'Em andamento' não pode ser editada."
}
```

---

### 1.2 Alterar Status da Pesquisa

**`PATCH /api/pesquisas/{id}/status`**

Transições permitidas: `1 → 2` (abrir), `2 → 3` (encerrar). Não retrocede.

**Request**
```json
{ "status": 2 }
```

**Response `200 OK`**
```json
{
  "id": 1,
  "status": 2,
  "mensagem": "Pesquisa alterada para 'Em andamento'."
}
```

**Response `409 Conflict`** — transição inválida
```json
{
  "erro": "TRANSICAO_INVALIDA",
  "mensagem": "Não é possível alterar o status de 'Encerrada' para 'Aberta'."
}
```

---

### 1.3 Remover Pesquisa

**`DELETE /api/pesquisas/{id}`**

Soft delete — marca como inativa, não apaga do banco. Só permite se não houver nenhuma resposta registrada.

**Response `204 No Content`** — removida com sucesso (sem body)

**Response `409 Conflict`** — já possui respostas
```json
{
  "erro": "OPERACAO_INVALIDA",
  "mensagem": "A pesquisa possui 47 resposta(s) registrada(s) e não pode ser removida."
}
```

---

### 1.4 Listar Respostas de uma Pesquisa

**`GET /api/pesquisas/{id}/respostas`**

Lista os registros de quem respondeu. Útil para a tabela de participantes no admin. Aceita paginação.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | number | Página (começa em 0) |
| `size` | number | Itens por página (padrão 20) |
| `areaId` | number | Filtra por área |

**Exemplo:** `GET /api/pesquisas/1/respostas?page=0&size=20&areaId=2`

**Response `200 OK`**
```json
{
  "total": 47,
  "pagina": 0,
  "tamanhoPagina": 20,
  "itens": [
    {
      "id": 100,
      "matricula": "c158543",
      "areaId": 2,
      "areaNome": "Gestão de Pessoas",
      "dtHoraResposta": "2026-06-10T14:30:00",
      "finalizada": true,
      "totalQuestoes": 84
    },
    {
      "id": 101,
      "matricula": "c112233",
      "areaId": 1,
      "areaNome": "Tecnologia da Informação",
      "dtHoraResposta": "2026-06-11T09:15:00",
      "finalizada": true,
      "totalQuestoes": 84
    }
  ]
}
```

---

## Parte 2 — Dashboard de Resultados

Todos os endpoints abaixo exigem que a pesquisa exista (`404` caso contrário).  
Podem ser chamados mesmo com a pesquisa ainda aberta — mostram o estado atual das respostas.

---

### 2.1 Resumo Geral

**`GET /api/pesquisas/{id}/dashboard`**

Visão consolidada: participação, médias gerais, ranking por sistema e por etapa. É o endpoint principal da tela de dashboard.

**Response `200 OK`**
```json
{
  "pesquisaId": 1,
  "pesquisaNome": "Pesquisa de Satisfação da Experiência Digital na Caixa - 2026",
  "status": 2,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-06-30",
  "participacao": {
    "totalColaboradores": 120,
    "totalRespostas": 47,
    "taxaParticipacao": 39.2
  },
  "mediaGeral": 3.2,
  "mediaPorEtapa": [
    { "etapaId": 1, "etapaNome": "Usabilidade",  "icone": "mouse", "media": 3.1 },
    { "etapaId": 2, "etapaNome": "Eficiência",   "icone": "bolt",  "media": 3.4 },
    { "etapaId": 3, "etapaNome": "Aprendizado",  "icone": "book",  "media": 2.9 },
    { "etapaId": 4, "etapaNome": "Eficácia",     "icone": "check", "media": 3.3 }
  ],
  "mediaPorSistema": [
    { "sistemaId": 1, "sistemaSigla": "SISRH",       "sistemaNome": "Sistema de Gestão de Recursos Humanos",   "media": 3.4 },
    { "sistemaId": 2, "sistemaSigla": "SIPON",        "sistemaNome": "Sistema de Controle de Ponto",            "media": 3.2 },
    { "sistemaId": 3, "sistemaSigla": "Integramais",  "sistemaNome": "Sistema de Integração de Gestão",         "media": 2.8 },
    { "sistemaId": 4, "sistemaSigla": "Atendimento",  "sistemaNome": "Sistema de Atendimento",                  "media": 3.1 },
    { "sistemaId": 5, "sistemaSigla": "SIABE",        "sistemaNome": "Sistema de Administração de Benefícios",  "media": 3.0 },
    { "sistemaId": 6, "sistemaSigla": "SIAGS",        "sistemaNome": "Sistema de Autogestão em Saúde",          "media": 3.5 },
    { "sistemaId": 7, "sistemaSigla": "SIAUT",        "sistemaNome": "Sistema de Autoatendimento",              "media": 2.9 }
  ]
}
```

> A `mediaGeral` é a média de todas as questões do tipo `"M"` de todos os sistemas e etapas. `taxaParticipacao` = `(totalRespostas / totalColaboradores) * 100`, arredondado para 1 casa decimal.

---

### 2.2 Resultados por Sistema

**`GET /api/pesquisas/{id}/dashboard/sistemas`**

Detalha cada sistema com sua média por etapa. Usado para o gráfico de radar ou tabela comparativa.

Aceita filtro opcional:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `sistemaId` | number | Retorna apenas o sistema especificado |

**Response `200 OK`**
```json
[
  {
    "sistemaId": 1,
    "sistemaSigla": "SISRH",
    "sistemaNome": "Sistema de Gestão de Recursos Humanos",
    "icone": "user",
    "mediaGeral": 3.4,
    "totalRespostas": 47,
    "mediaPorEtapa": [
      { "etapaId": 1, "etapaNome": "Usabilidade",  "media": 3.3, "totalRespostas": 47 },
      { "etapaId": 2, "etapaNome": "Eficiência",   "media": 3.5, "totalRespostas": 46 },
      { "etapaId": 3, "etapaNome": "Aprendizado",  "media": 3.2, "totalRespostas": 47 },
      { "etapaId": 4, "etapaNome": "Eficácia",     "media": 3.6, "totalRespostas": 45 }
    ]
  },
  {
    "sistemaId": 2,
    "sistemaSigla": "SIPON",
    "sistemaNome": "Sistema de Controle de Ponto",
    "icone": "clock",
    "mediaGeral": 3.2,
    "totalRespostas": 47,
    "mediaPorEtapa": [
      { "etapaId": 1, "etapaNome": "Usabilidade",  "media": 3.1, "totalRespostas": 47 },
      { "etapaId": 2, "etapaNome": "Eficiência",   "media": 3.4, "totalRespostas": 47 },
      { "etapaId": 3, "etapaNome": "Aprendizado",  "media": 2.9, "totalRespostas": 46 },
      { "etapaId": 4, "etapaNome": "Eficácia",     "media": 3.3, "totalRespostas": 47 }
    ]
  }
]
```

> Retorna sempre os 7 sistemas, ordenados por `ordem`. `totalRespostas` por etapa pode variar levemente se algum colaborador pulou questões.

---

### 2.3 Resultados por Área

**`GET /api/pesquisas/{id}/dashboard/areas`**

Mostra participação e média por área. Útil para identificar quais áreas estão sub-representadas ou com avaliações discrepantes.

**Response `200 OK`**
```json
[
  {
    "areaId": 1,
    "areaNome": "Tecnologia da Informação",
    "areaSigla": "CETEC",
    "totalColaboradores": 120,
    "totalRespostas": 28,
    "taxaParticipacao": 23.3,
    "mediaGeral": 3.5
  },
  {
    "areaId": 2,
    "areaNome": "Gestão de Pessoas",
    "areaSigla": "GIPES",
    "totalColaboradores": 45,
    "totalRespostas": 19,
    "taxaParticipacao": 42.2,
    "mediaGeral": 2.9
  },
  {
    "areaId": 3,
    "areaNome": "Atendimento e Operações",
    "areaSigla": "GIATE",
    "totalColaboradores": 200,
    "totalRespostas": 0,
    "taxaParticipacao": 0.0,
    "mediaGeral": null
  }
]
```

> `mediaGeral` é `null` quando `totalRespostas` = 0 — o front deve tratar exibindo `"—"` em vez de `0` ou `NaN`.

---

### 2.4 Resultados por Questão

**`GET /api/pesquisas/{id}/dashboard/questoes`**

Retorna distribuição de respostas questão a questão. Filtros obrigatórios para não retornar as 84 questões de uma vez.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `sistemaId` | number | Sim | Sistema avaliado |
| `etapa` | number | Sim | Etapa (1–4) |

**Exemplo:** `GET /api/pesquisas/1/dashboard/questoes?sistemaId=2&etapa=1`

**Response `200 OK`**
```json
[
  {
    "questaoId": 6,
    "numero": 6,
    "tipo": "M",
    "titulo": "A interface do SIPON é fácil de usar para registrar o ponto?",
    "totalRespostas": 47,
    "media": 3.1,
    "distribuicao": [
      { "letra": "A", "valor": 1, "descricao": "Discordo totalmente",    "quantidade": 3,  "percentual": 6.4  },
      { "letra": "B", "valor": 2, "descricao": "Discordo parcialmente",  "quantidade": 8,  "percentual": 17.0 },
      { "letra": "C", "valor": 3, "descricao": "Concordo parcialmente",  "quantidade": 22, "percentual": 46.8 },
      { "letra": "D", "valor": 4, "descricao": "Concordo totalmente",    "quantidade": 14, "percentual": 29.8 }
    ]
  },
  {
    "questaoId": 7,
    "numero": 7,
    "tipo": "M",
    "titulo": "A navegação entre telas e funcionalidades do SIPON é fluida e lógica?",
    "totalRespostas": 47,
    "media": 2.9,
    "distribuicao": [
      { "letra": "A", "valor": 1, "descricao": "Discordo totalmente",    "quantidade": 5,  "percentual": 10.6 },
      { "letra": "B", "valor": 2, "descricao": "Discordo parcialmente",  "quantidade": 12, "percentual": 25.5 },
      { "letra": "C", "valor": 3, "descricao": "Concordo parcialmente",  "quantidade": 20, "percentual": 42.6 },
      { "letra": "D", "valor": 4, "descricao": "Concordo totalmente",    "quantidade": 10, "percentual": 21.3 }
    ]
  },
  {
    "questaoId": 8,
    "numero": 8,
    "tipo": "S",
    "titulo": "Deixe um comentário sobre a usabilidade do SIPON.",
    "totalRespostas": 23,
    "media": null,
    "distribuicao": []
  }
]
```

> Questões do tipo `"S"` retornam `media: null` e `distribuicao: []`. O texto das respostas subjetivas vem do endpoint 2.5, para não inflar esta resposta.

---

### 2.5 Respostas Subjetivas

**`GET /api/pesquisas/{id}/dashboard/respostas-subjetivas`**

Lista o texto livre das questões abertas, com paginação. Permite filtrar por sistema e etapa para exibir junto ao detalhamento de cada sistema.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `sistemaId` | number | Não | Filtra por sistema |
| `etapa` | number | Não | Filtra por etapa (1–4) |
| `questaoId` | number | Não | Filtra por questão específica |
| `page` | number | Não | Página (começa em 0, padrão 0) |
| `size` | number | Não | Itens por página (padrão 20) |

**Exemplo:** `GET /api/pesquisas/1/dashboard/respostas-subjetivas?sistemaId=2&etapa=1`

**Response `200 OK`**
```json
{
  "total": 23,
  "pagina": 0,
  "tamanhoPagina": 20,
  "itens": [
    {
      "questaoId": 8,
      "questaoTitulo": "Deixe um comentário sobre a usabilidade do SIPON.",
      "sistemaId": 2,
      "sistemaSigla": "SIPON",
      "etapa": 1,
      "etapaNome": "Usabilidade",
      "resposta": "O sistema poderia ter mais tutoriais."
    },
    {
      "questaoId": 8,
      "questaoTitulo": "Deixe um comentário sobre a usabilidade do SIPON.",
      "sistemaId": 2,
      "sistemaSigla": "SIPON",
      "etapa": 1,
      "etapaNome": "Usabilidade",
      "resposta": "Achei a interface confusa no início, mas fui me acostumando."
    }
  ]
}
```

> As respostas subjetivas são anônimas — não inclua matrícula nem identificação do respondente.

---

## Parte 3 — Resumo dos Endpoints Propostos

```
# Gestão (Painel Admin)
GET    /api/pesquisas                          → lista com filtros (já existe)
POST   /api/pesquisas                          → criar (já existe)
GET    /api/pesquisas/{id}                     → buscar por ID (já existe)
PUT    /api/pesquisas/{id}                     → atualizar metadados
PATCH  /api/pesquisas/{id}/status              → alterar status (1→2→3)
DELETE /api/pesquisas/{id}                     → remover (soft delete, sem respostas)
GET    /api/pesquisas/{id}/respostas           → listar participantes (paginado)

# Dashboard
GET    /api/pesquisas/{id}/dashboard                          → resumo geral
GET    /api/pesquisas/{id}/dashboard/sistemas                 → detalhamento por sistema
GET    /api/pesquisas/{id}/dashboard/sistemas?sistemaId=N     → um sistema específico
GET    /api/pesquisas/{id}/dashboard/areas                    → participação por área
GET    /api/pesquisas/{id}/dashboard/questoes?sistemaId=N&etapa=N  → distribuição por questão
GET    /api/pesquisas/{id}/dashboard/respostas-subjetivas     → comentários livres (paginado)
```

---

## Parte 4 — Ordem de Implementação Sugerida

| Prioridade | Endpoint | Motivo |
|-----------|----------|--------|
| 1 | `GET /dashboard` | Tela principal do admin — visão geral |
| 2 | `GET /dashboard/sistemas` | Gráfico de radar por sistema |
| 3 | `GET /dashboard/areas` | Tabela de participação |
| 4 | `PATCH /{id}/status` | Necessário para abrir/encerrar pesquisas |
| 5 | `GET /dashboard/questoes` | Detalhamento por questão (drill-down) |
| 6 | `GET /{id}/respostas` | Tabela de participantes |
| 7 | `GET /dashboard/respostas-subjetivas` | Comentários livres |
| 8 | `PUT /{id}` | Edição de pesquisa |
| 9 | `DELETE /{id}` | Remoção |

---

## Parte 5 — Notas de Implementação

### Cálculo de médias
A média de uma questão é `soma dos valores das alternativas escolhidas / quantidade de respostas`. Calcular no banco com `AVG()` em vez de trazer todos os registros para o Java e somar em memória.

### Arredondamento
Todas as médias com **1 casa decimal**. Percentuais com **1 casa decimal**. Usar `ROUND()` no SQL ou `Math.round(v * 10) / 10` no Java.

### Performance
Os endpoints de dashboard devem usar queries com `GROUP BY` direto no banco — não iterar registros em Java. Para pesquisas com muitas respostas, considerar view materializada ou cache de 5 minutos.

### Autenticação (futuro)
Os endpoints de gestão (`PUT`, `PATCH`, `DELETE`) devem exigir autenticação quando o back implementar segurança. Por ora, sem auth. Os endpoints de dashboard também deverão ser protegidos.
