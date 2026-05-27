# Documentação de API — Pesquisa de Satisfação Digital

> Versão 3 · Atualizado em 2026-05-21  
> Base URL (produção / back Java): `http://localhost:8080`  
> Base URL (mock): `http://localhost:3000`

---

## Sumário

1. [Pesquisa — Cadastro e Consulta](#1-pesquisa--cadastro-e-consulta)
2. [Listas de Referência](#2-listas-de-referência)
3. [Resposta de Pesquisa](#3-resposta-de-pesquisa)

---

## 1. Pesquisa — Cadastro e Consulta

### 1.1 Cadastrar Pesquisa

**`POST /api/pesquisa/cadastro`**

**Request**
```json
{
  "nome": "Pesquisa de Satisfação Digital - MAIO",
  "descricao": "Avaliação da experiência digital dos colaboradores com os sistemas internos.",
  "area": 2,
  "pessoasArea": 200,
  "dtInicio": "2026-06-01",
  "dtFim": "2026-06-05",
  "questoes": [
    {
      "numero": 1,
      "etapa": 1,
      "idSistema": 30,
      "tipoQuestao": "M",
      "tituloQuestao": "O sistema é fácil de usar no dia a dia?",
      "obrigatoria": true,
      "alternativas": [
        { "alternativaNumero": 1, "ordem": 1, "letra": "A", "valor": 1, "descricaoAlternativa": "Discordo totalmente" },
        { "alternativaNumero": 2, "ordem": 2, "letra": "B", "valor": 2, "descricaoAlternativa": "Discordo parcialmente" },
        { "alternativaNumero": 3, "ordem": 3, "letra": "C", "valor": 3, "descricaoAlternativa": "Concordo parcialmente" },
        { "alternativaNumero": 4, "ordem": 4, "letra": "D", "valor": 4, "descricaoAlternativa": "Concordo totalmente" }
      ]
    }
  ]
}
```

> **Nota:** cada questão pertence a uma etapa (1–4) e a um sistema (`idSistema`). `tipoQuestao` pode ser `"M"` (múltipla escolha) ou `"S"` (subjetiva). A escala de valores vai de 1 (Discordo totalmente) a 4 (Concordo totalmente).

**Response `201 Created`**
```json
{
  "id": "000000001",
  "nome": "Pesquisa de Satisfação Digital - MAIO",
  "situacao": 2,
  "dtInicio": "2026-06-01",
  "dtFim": "2026-06-05"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID da pesquisa criada |
| `situacao` | number | `1` = Aberta · `2` = Em andamento · `3` = Encerrada |

---

### 1.2 Consultar Pesquisa por ID

**`GET /api/pesquisa/cadastro/{id}`**

Retorna a pesquisa completa com todas as questões.

**Exemplo:** `GET /api/pesquisa/cadastro/1`

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Pesquisa de Satisfação da Experiência Digital na Caixa - 2026",
  "descricao": "Pesquisa anual para avaliar a satisfação dos colaboradores com os sistemas digitais corporativos.",
  "area": "Tecnologia da Informação",
  "pessoasArea": 120,
  "status": 1,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-06-30",
  "questoes": [
    {
      "numero": 1,
      "etapa": 1,
      "idSistema": 1,
      "tipoQuestao": "M",
      "tituloQuestao": "A interface do SISRH é fácil de usar e intuitiva?",
      "alternativas": [
        { "alternativaNumero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricaoAlternativa": "Discordo totalmente" },
        { "alternativaNumero": 2, "letra": "B", "valor": 2, "ordem": 2, "descricaoAlternativa": "Discordo parcialmente" },
        { "alternativaNumero": 3, "letra": "C", "valor": 3, "ordem": 3, "descricaoAlternativa": "Concordo parcialmente" },
        { "alternativaNumero": 4, "letra": "D", "valor": 4, "ordem": 4, "descricaoAlternativa": "Concordo totalmente" }
      ]
    }
  ]
}
```

---

### 1.3 Consultar Pesquisa por ID + Sistema + Etapa

**`GET /api/pesquisa?idPesquisa={id}&idSistema={idSistema}&etapa={etapa}`**

Retorna a pesquisa filtrando questões pelo sistema e etapa informados.

**Exemplo:** `GET /api/pesquisa?idPesquisa=1&idSistema=2&etapa=1`

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Pesquisa de Satisfação da Experiência Digital na Caixa - 2026",
  "descricao": "Pesquisa anual para avaliar a satisfação dos colaboradores da Caixa com os sistemas digitais corporativos. Avalia 7 sistemas em 4 etapas: Usabilidade, Eficiência, Aprendizado e Eficácia. PESQUISA ANÔNIMA.",
  "area": "Tecnologia da Informação",
  "pessoasArea": 120,
  "status": 1,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-06-30",
  "questoes": [
    {
      "numero": 6,
      "idSistema": 2,
      "etapa": 1,
      "tipoQuestao": "M",
      "tituloQuestao": "A interface do SIPON é fácil de usar para registrar o ponto?",
      "alternativas": [
        { "alternativaNumero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricaoAlternativa": "Discordo totalmente" },
        { "alternativaNumero": 2, "letra": "B", "valor": 2, "ordem": 2, "descricaoAlternativa": "Discordo parcialmente" },
        { "alternativaNumero": 3, "letra": "C", "valor": 3, "ordem": 3, "descricaoAlternativa": "Concordo parcialmente" },
        { "alternativaNumero": 4, "letra": "D", "valor": 4, "ordem": 4, "descricaoAlternativa": "Concordo totalmente" }
      ]
    }
  ]
}
```

---

### 1.4 Listar Pesquisas

**`GET /api/pesquisa/lista`**

Retorna todas as pesquisas. Aceita filtros opcionais via query string.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `area` | number | Filtra por área |
| `dataInicio` | string (YYYY-MM-DD) | Data de início |
| `dataFim` | string (YYYY-MM-DD) | Data de fim |
| `status` | number | `1` = Aberta · `2` = Em andamento · `3` = Encerrada |

**Exemplo com filtros:** `GET /api/pesquisa/lista?area=2&dataInicio=2026-06-01&dataFim=2026-06-05&status=1`

**Response `200 OK`**
```json
[
  {
    "idPesquisa": 1,
    "nome": "Pesquisa de Satisfação Digital - MAIO",
    "descricao": "Avaliação da experiência digital...",
    "area": 2,
    "pessoasArea": 200,
    "status": 1,
    "dtInicio": "2026-05-01",
    "dtFim": "2026-05-31",
    "quantidadeQuestoes": 12,
    "quantidadeRespostas": 158
  }
]
```

---

## 2. Listas de Referência

### 2.1 Listar Áreas

**`GET /api/pesquisa/lista/areas`**

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Tecnologia da Informação",   "sigla": "CETEC", "descricao": "Centralizadora de Tecnologia",                         "quantidadePessoas": 120, "ativo": true },
  { "id": 2, "nome": "Gestão de Pessoas",           "sigla": "GIPES", "descricao": "Gerência de Gestão de Pessoas",                        "quantidadePessoas": 45,  "ativo": true },
  { "id": 3, "nome": "Atendimento e Operações",     "sigla": "GIATE", "descricao": "Gerência de Atendimento",                              "quantidadePessoas": 200, "ativo": true },
  { "id": 4, "nome": "Administração e Finanças",    "sigla": "GIAFI", "descricao": "Gerência de Administração e Finanças",                  "quantidadePessoas": 35,  "ativo": true },
  { "id": 5, "nome": "Saúde e Qualidade de Vida",   "sigla": "GISQV", "descricao": "Gerência de Saúde e Qualidade de Vida",                "quantidadePessoas": 25,  "ativo": true },
  { "id": 6, "nome": "Rede de Agências",            "sigla": "REAGE", "descricao": "Rede de Agências e Unidades de Atendimento",           "quantidadePessoas": 350, "ativo": true },
  { "id": 7, "nome": "Controladoria e Compliance",  "sigla": "GICOC", "descricao": "Gerência de Controladoria e Compliance",               "quantidadePessoas": 30,  "ativo": true },
  { "id": 8, "nome": "Habitação",                   "sigla": "GIHAB", "descricao": "Gerência de Habitação",                                "quantidadePessoas": 80,  "ativo": true }
]
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number | ID da área |
| `sigla` | string | Sigla da gerência |
| `quantidadePessoas` | number | Número de colaboradores na área |
| `ativo` | boolean | Se a área está ativa |

---

### 2.2 Listar Etapas

**`GET /api/etapas`**

As 4 dimensões de avaliação por sistema.

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Usabilidade",  "descricao": "Facilidade de uso, interface intuitiva e navegação do sistema.",         "icone": "mouse", "ordem": 1, "ativo": true },
  { "id": 2, "nome": "Eficiência",   "descricao": "Rapidez, desempenho, tempo de resposta e produtividade com o sistema.",  "icone": "bolt",  "ordem": 2, "ativo": true },
  { "id": 3, "nome": "Aprendizado",  "descricao": "Facilidade de aprendizado, curva de aprendizado e suporte disponível.",  "icone": "book",  "ordem": 3, "ativo": true },
  { "id": 4, "nome": "Eficácia",     "descricao": "Resultados e impacto no trabalho.",                                      "icone": "check", "ordem": 4, "ativo": true }
]
```

> **Atenção:** endpoint mudou de `/api/pesquisa/lista/etapas` para `/api/etapas`. Campos `id` (era `idEtapa`), sem `cor`, adicionado `ativo`.

---

### 2.3 Listar Sistemas

**`GET /api/sistemas`**

Os sistemas de TI disponíveis para avaliação.

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "sigla": "SISRH",
    "nome": "Sistema de Gestão de Recursos Humanos",
    "descricao": "Sistema corporativo para gestão de recursos humanos, cadastro funcional, movimentação e informações de pessoal.",
    "urlAcesso": null,
    "icone": "user",
    "ordem": 1,
    "ativo": true
  },
  {
    "id": 2,
    "sigla": "SIPON",
    "nome": "Sistema de Controle de Ponto",
    "descricao": "Sistema para registro e controle de ponto eletrônico, jornada de trabalho, horas extras e banco de horas.",
    "urlAcesso": null,
    "icone": "clock",
    "ordem": 2,
    "ativo": true
  },
  {
    "id": 3,
    "sigla": "Integramais",
    "nome": "Sistema de Integração de Sistemas de Gestão de Pessoas",
    "descricao": "Plataforma integradora dos sistemas de gestão de pessoas, centralizando informações de múltiplos sistemas.",
    "urlAcesso": null,
    "icone": "link",
    "ordem": 3,
    "ativo": true
  },
  {
    "id": 4,
    "sigla": "Atendimento",
    "nome": "Sistema de Atendimento",
    "descricao": "Sistema de gestão de atendimento ao cliente interno e externo, protocolos e solicitações.",
    "urlAcesso": null,
    "icone": "phone",
    "ordem": 4,
    "ativo": true
  },
  {
    "id": 5,
    "sigla": "SIABE",
    "nome": "Sistema Administração de Pagamentos de Benefícios",
    "descricao": "Sistema para administração e controle de pagamentos de benefícios sociais e trabalhistas.",
    "urlAcesso": null,
    "icone": "money",
    "ordem": 5,
    "ativo": true
  },
  {
    "id": 6,
    "sigla": "SIAGS",
    "nome": "Sistema de Autogestão em Saúde",
    "descricao": "Sistema para autogestão de planos de saúde, marcação de consultas, autorizações e reembolsos.",
    "urlAcesso": null,
    "icone": "health",
    "ordem": 6,
    "ativo": true
  },
  {
    "id": 7,
    "sigla": "SIAUT",
    "nome": "Sistema de Autoatendimento",
    "descricao": "Sistema de autoatendimento para colaboradores, acesso a contracheques, férias, benefícios e documentos.",
    "urlAcesso": null,
    "icone": "desktop",
    "ordem": 7,
    "ativo": true
  }
]
```

> **Atenção:** endpoint mudou de `/api/pesquisa/lista/sistemas` para `/api/sistemas`. Campos `id` (era `idSistema`), sem `categoria` e `tags`, adicionados `urlAcesso`, `ordem`, `ativo`. `nome` agora é o nome completo do sistema.

---

## 3. Resposta de Pesquisa

### 3.1 Consultar Resposta por Matrícula

Verifica se um colaborador já respondeu a pesquisa.

**`GET /api/pesquisa/resposta/{idPesquisa}/consulta?matricula={matricula}`**

**Exemplo:** `GET /api/pesquisa/resposta/1/consulta?matricula=c158543`

**Response `200 OK`**
```json
{
  "idResposta": 100,
  "idPesquisa": 1,
  "idArea": 2,
  "dtHoraResposta": "2026-06-10",
  "enderecoIp": "128.000.001.001",
  "finalizada": true,
  "questoes": [
    {
      "numero": 1,
      "titulo": "A interface do SISRH é fácil de usar e intuitiva?",
      "tipoQuestao": "M",
      "etapa": 1,
      "alternativas": [
        { "alternativaNumero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricaoAlternativa": "Discordo totalmente" }
      ],
      "respostaSubjetiva": null
    }
  ]
}
```

---

### 3.2 Consultar Resposta por ID

**`GET /api/pesquisa/resposta/{idPesquisa}/consulta/resposta?idResposta={idResposta}`**

**Exemplo:** `GET /api/pesquisa/resposta/1/consulta/resposta?idResposta=100`

**Response `200 OK`** — mesmo formato do item 3.1.

---

### 3.3 Gravar Resposta

**`POST /api/pesquisa/resposta`**

**Request**
```json
{
  "idPesquisa": 1,
  "matricula": "c158543",
  "dtHoraResposta": "2026-06-10",
  "questoes": [
    {
      "numero": 1,
      "tipoQuestao": "M",
      "alternativas": [
        { "alternativaNumero": 1 }
      ],
      "respostaSubjetiva": ""
    },
    {
      "numero": 9,
      "tipoQuestao": "S",
      "alternativas": [],
      "respostaSubjetiva": "O sistema poderia ter mais tutoriais."
    }
  ]
}
```

> **Nota:** campo `matricula` é obrigatório no request. Para questões subjetivas (`"S"`), `alternativas` fica vazio e `respostaSubjetiva` contém o texto. Para questões de múltipla escolha (`"M"`), informar apenas `alternativaNumero`.

**Response `201 Created`**
```json
{
  "idResposta": 100,
  "idPesquisa": 1,
  "idArea": 2,
  "dtHoraResposta": "2026-06-10",
  "enderecoIp": "128.000.001.001",
  "finalizada": true,
  "questoes": [
    {
      "numero": 1,
      "titulo": "A interface do SISRH é fácil de usar e intuitiva?",
      "tipoQuestao": "M",
      "etapa": 1,
      "alternativas": [
        { "alternativaNumero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricaoAlternativa": "Discordo totalmente" }
      ],
      "respostaSubjetiva": null
    }
  ]
}
```

---

## Fluxo do Colaborador (resumo)

```
1. Identificação        → (sessionStorage: matrícula, idArea, idPesquisa)
2. Seleção de Sistemas  → GET /api/sistemas
                          (sessionStorage: sistemasSelecionados, sistemaAtualIndex)
3. Avaliação            → GET /api/pesquisa?idPesquisa={id}&idSistema={id}&etapa={etapa}
                          (4 etapas × por sistema)
4. Conclusão            → POST /api/pesquisa/resposta  (com matrícula)
```

**Cálculo de questões:** 3 questões × 4 etapas × quantidade de sistemas selecionados = total de questões.

---

## Resumo das Mudanças (v2 → v3)

| Endpoint anterior | Endpoint atual | Mudança |
|---|---|---|
| `GET /api/pesquisa/lista/etapas` | `GET /api/etapas` | URL alterada; `idEtapa` → `id`; sem `cor`; adicionado `ativo` |
| `GET /api/pesquisa/lista/sistemas` | `GET /api/sistemas` | URL alterada; `idSistema` → `id`; sem `categoria`/`tags`; adicionados `urlAcesso`, `ordem`, `ativo` |
| `GET /api/pesquisa/lista/areas` | `GET /api/pesquisa/lista/areas` | Mesma URL; `idArea` → `id`; adicionados `sigla`, `ativo`; `pessoasArea` → `quantidadePessoas` |
| `tituloAlternativa` (nas alternativas) | `descricaoAlternativa` | Campo renomeado em toda a API |
| Escala de valores `100/70/40/10` | Escala `1/2/3/4` | Valores das alternativas reescalados |
| `POST /api/pesquisa/resposta` sem matrícula | `POST /api/pesquisa/resposta` com `matricula` | Campo `matricula` adicionado ao request |
| `GET .../consulta?resposta={id}` | `GET .../consulta/resposta?idResposta={id}` | Rota e parâmetro renomeados |
