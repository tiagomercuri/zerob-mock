# Documentação de API — Pesquisa de Satisfação Digital

> Versão 2 · Atualizado em 2026-05-21  
> Base URL (produção): `http://localhost/api`  
> Base URL (desenvolvimento / mock): `http://localhost:3000`

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
        { "alternativaNumero": 1, "ordem": 1, "letra": "A", "valor": 100, "tituloAlternativa": "Totalmente Satisfatória" },
        { "alternativaNumero": 2, "ordem": 2, "letra": "B", "valor": 70,  "tituloAlternativa": "Satisfatória" },
        { "alternativaNumero": 3, "ordem": 3, "letra": "C", "valor": 40,  "tituloAlternativa": "Indiferente" },
        { "alternativaNumero": 4, "ordem": 4, "letra": "D", "valor": 10,  "tituloAlternativa": "Insatisfatória" }
      ]
    }
  ]
}
```

> **Nota:** cada questão pertence a uma etapa (1–4) e a um sistema (`idSistema`). `tipoQuestao` pode ser `"M"` (múltipla escolha) ou `"S"` (subjetiva).

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

**Exemplo:** `GET /api/pesquisa/cadastro/000000001`

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Pesquisa de Satisfação Digital - MAIO",
  "descricao": "Avaliação da experiência digital dos colaboradores com os sistemas internos.",
  "area": "Capítulo de Codificação",
  "pessoasArea": 200,
  "status": "Aberta",
  "dtInicio": "2026-06-01",
  "dtFim": "2026-06-05",
  "questoes": [
    {
      "numero": 1,
      "etapa": "Usabilidade",
      "idSistema": 1,
      "tipoQuestao": "M",
      "tituloQuestao": "O sistema é fácil de usar no dia a dia?",
      "alternativas": [
        { "alternativaNumero": 1, "tituloAlternativa": "Totalmente Satisfatória" },
        { "alternativaNumero": 2, "tituloAlternativa": "Satisfatória" },
        { "alternativaNumero": 3, "tituloAlternativa": "Indiferente" },
        { "alternativaNumero": 4, "tituloAlternativa": "Insatisfatória" }
      ]
    }
  ]
}
```

---

### 1.3 Consultar Pesquisa por ID + Sistema

**`GET /api/pesquisa?idPesquisa={id}&idSistema={idSistema}`**

Retorna a pesquisa filtrando questões apenas do sistema informado.

**Variação com filtro de etapa:**  
`GET /api/pesquisa?idPesquisa={id}&etapa={etapa}&idSistema={idSistema}`

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
  {
    "idArea": 1,
    "nome": "Tecnologia da Informação",
    "descricao": "Departamento de TI e Desenvolvimento",
    "pessoasArea": 45
  },
  {
    "idArea": 2,
    "nome": "Recursos Humanos",
    "descricao": "Departamento de Gestão de Pessoas",
    "pessoasArea": 115
  }
]
```

---

### 2.2 Listar Etapas

**`GET /api/pesquisa/lista/etapas`**

As 4 dimensões de avaliação por sistema.

**Response `200 OK`**
```json
[
  { "idEtapa": 1, "nome": "Usabilidade",  "descricao": "Facilidade de uso e intuitividade",      "icone": "touch_app", "cor": "#1976D2", "ordem": 1 },
  { "idEtapa": 2, "nome": "Eficiência",   "descricao": "Desempenho e velocidade",                "icone": "speed",     "cor": "#388E3C", "ordem": 2 },
  { "idEtapa": 3, "nome": "Aprendizado",  "descricao": "Curva de aprendizado e recursos de ajuda","icone": "school",    "cor": "#F57C00", "ordem": 3 },
  { "idEtapa": 4, "nome": "Eficácia",     "descricao": "Resultados e impacto no trabalho",        "icone": "verified",  "cor": "#7B1FA2", "ordem": 4 }
]
```

---

### 2.3 Listar Sistemas

**`GET /api/pesquisa/lista/sistemas`**

Os sistemas de TI disponíveis para avaliação.

**Response `200 OK`**
```json
[
  {
    "idSistema": 1,
    "sigla": "SISRH",
    "categoria": "RH",
    "nome": "SISRH",
    "descricao": "Sistema de Gestão de Recursos Humanos — cadastro, movimentações e administração de pessoal.",
    "tags": ["Gestão de Pessoas", "RH"],
    "icone": "group"
  },
  {
    "idSistema": 2,
    "sigla": "SIPON",
    "categoria": "PONTO",
    "nome": "SIPON",
    "descricao": "Sistema de Controle de Ponto — registro de jornada, horas extras, abonos e ocorrências.",
    "tags": ["Controle de Jornada", "RH"],
    "icone": "schedule"
  },
  {
    "idSistema": 3,
    "sigla": "Integramais",
    "categoria": "INTEGRAÇÃO",
    "nome": "Integramais",
    "descricao": "Plataforma integradora dos sistemas de Gestão de Pessoas.",
    "tags": ["Integração", "RH"],
    "icone": "sync_alt"
  },
  {
    "idSistema": 4,
    "sigla": "Atendimento",
    "categoria": "ATENDIMENTO",
    "nome": "Atendimento",
    "descricao": "Sistema de gerenciamento de chamados, solicitações e suporte aos colaboradores.",
    "tags": ["Suporte", "Atendimento"],
    "icone": "headset_mic"
  },
  {
    "idSistema": 5,
    "sigla": "SIABE",
    "categoria": "BENEFÍCIOS",
    "nome": "SIABE",
    "descricao": "Sistema de Administração de Pagamentos de Benefícios — processamento e gestão de benefícios.",
    "tags": ["Pagamentos", "Benefícios"],
    "icone": "payments"
  },
  {
    "idSistema": 6,
    "sigla": "SIAGS",
    "categoria": "SAÚDE",
    "nome": "SIAGS",
    "descricao": "Sistema de Autogestão em Saúde — plano de saúde, consultas, reembolsos e rede credenciada.",
    "tags": ["Saúde", "Autogestão"],
    "icone": "favorite"
  },
  {
    "idSistema": 7,
    "sigla": "SIAUT",
    "categoria": "AUTOATENDIMENTO",
    "nome": "SIAUT",
    "descricao": "Portal do colaborador para solicitações, consultas e serviços de RH online.",
    "tags": ["Portal", "Autoatendimento"],
    "icone": "person_pin"
  }
]
```

---

## 3. Resposta de Pesquisa

### 3.1 Consultar Resposta Existente

Verifica se um colaborador já respondeu a pesquisa.

**Por matrícula:**  
`GET /api/pesquisa/resposta/{idPesquisa}/consulta?matricula=C199999`

**Por ID de resposta:**  
`GET /api/pesquisa/resposta/{idPesquisa}/consulta?resposta=5353`

**Response `200 OK`**
```json
{
  "idResposta": 1,
  "idPesquisa": 1,
  "idArea": 2,
  "dtHoraResposta": "2026-05-18T14:30:00Z",
  "enderecoIp": "128.0.0.1",
  "finalizada": true,
  "questoes": [
    {
      "numero": 1,
      "titulo": "O sistema é fácil de usar no dia a dia?",
      "tipoQuestao": "M",
      "etapa": 1,
      "alternativas": [
        { "ordem": 1, "letra": "A", "alternativaNumero": 1, "valor": 20 }
      ]
    },
    {
      "numero": 6,
      "titulo": "Descreva sua experiência com o sistema.",
      "tipoQuestao": "S",
      "etapa": 2,
      "respostaSubjetiva": "O sistema poderia ter mais tutoriais."
    }
  ]
}
```

---

### 3.2 Gravar Resposta

**`POST /api/pesquisa/resposta`**

**Request**
```json
{
  "idPesquisa": 1,
  "dtHoraResposta": "2026-05-18T14:30:00Z",
  "questoes": [
    {
      "numero": 1,
      "tipoQuestao": "M",
      "alternativas": [
        { "alternativaNumero": 1 }
      ]
    },
    {
      "numero": 9,
      "tipoQuestao": "S",
      "respostaSubjetiva": "O sistema poderia ter mais tutoriais."
    }
  ]
}
```

**Response `201 Created`**

Retorna o objeto completo da resposta gravada (mesmo formato do item 3.1).

---

## Fluxo do Colaborador (resumo)

```
1. Identificação        → POST (sessionStorage: matrícula, idArea, idPesquisa)
2. Seleção de Sistemas  → GET /api/pesquisa/lista/sistemas
                          (sessionStorage: sistemasSelecionados, sistemaAtualIndex)
3. Avaliação            → GET /api/pesquisa/cadastro/{id}  (4 etapas × por sistema)
4. Conclusão            → POST /api/pesquisa/resposta
```

**Cálculo de questões:** 3 questões × 4 etapas × quantidade de sistemas selecionados = total de questões.

