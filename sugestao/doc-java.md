# Proposta de Contrato de API — Backend Java

> Versão 1 · 2026-05-26  
> Documento gerado para orientar a refatoração do backend Java.  
> Base URL: `http://localhost:8080`

---

## Por que este documento existe

Durante a integração front/back foram encontrados os seguintes problemas:

| Problema | Causa |
|---|---|
| 500 em `GET /pesquisa/lista?status=1` | Jackson serializando entidade JPA com lazy loading |
| Front recebia objeto `{}` onde esperava array `[]` | Falta de padrão: alguns endpoints retornam objeto, outros array |
| Campo `GET /pesquisa/cadastro/{id}` não existia | Endpoint documentado mas não implementado |
| Nomes de campos diferentes entre endpoints | `idArea`, `idSistema`, `idEtapa` vs `id`; `tituloAlternativa` vs `descricaoAlternativa` |
| Paths sem padrão | `/api/etapas` (correto) vs `/api/pesquisa/lista/areas` (aninhado sem motivo) |

Este documento propõe um contrato limpo e consistente para que esses problemas não se repitam.

---

## Regras gerais

### 1. Nunca serializar entidades JPA diretamente

Sempre usar DTOs (classes separadas da entidade) como response. Isso evita o erro de Jackson com lazy loading e desacopla o contrato do banco.

```java
// ERRADO
@GetMapping("/areas")
public List<Area> listar() { return areaRepository.findAll(); }

// CERTO
@GetMapping("/areas")
public List<AreaDTO> listar() { return areaService.listarDTO(); }
```

### 2. Listas sempre retornam array `[]`

Nenhum endpoint de lista retorna objeto único `{}`. Se não há resultados, retorna `[]` com status `200`.

### 3. Endpoints de item único retornam objeto `{}`

Se o item não existe, retorna `404` com o formato de erro padrão (ver seção 6).

### 4. Nomes de campos em `camelCase`, padronizados

- O campo de identificação é sempre `id` (nunca `idArea`, `idSistema`, `idEtapa`)
- Textos descritivos de alternativas: sempre `descricao` (nunca `titulo` ou `tituloAlternativa`)
- Quantidade de pessoas: sempre `quantidadePessoas`

### 5. URLs no padrão REST com substantivos no plural

```
GET  /api/areas                  → lista de áreas
GET  /api/areas/{id}             → área por ID
GET  /api/etapas                 → lista de etapas
GET  /api/sistemas               → lista de sistemas
GET  /api/pesquisas              → lista de pesquisas (com filtros opcionais)
GET  /api/pesquisas/{id}         → pesquisa por ID (sem questões)
GET  /api/pesquisas/{id}/questoes → questões da pesquisa (com filtros)
POST /api/pesquisas              → cadastrar pesquisa
POST /api/respostas              → gravar resposta
GET  /api/respostas/consulta     → verificar se matrícula já respondeu
```

---

## 1. Listas de Referência

### 1.1 Listar Áreas

**`GET /api/areas`**

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "nome": "Tecnologia da Informação",
    "sigla": "CETEC",
    "descricao": "Centralizadora de Tecnologia",
    "quantidadePessoas": 120,
    "ativo": true
  },
  {
    "id": 2,
    "nome": "Gestão de Pessoas",
    "sigla": "GIPES",
    "descricao": "Gerência de Gestão de Pessoas",
    "quantidadePessoas": 45,
    "ativo": true
  },
  {
    "id": 3,
    "nome": "Atendimento e Operações",
    "sigla": "GIATE",
    "descricao": "Gerência de Atendimento",
    "quantidadePessoas": 200,
    "ativo": true
  },
  {
    "id": 4,
    "nome": "Administração e Finanças",
    "sigla": "GIAFI",
    "descricao": "Gerência de Administração e Finanças",
    "quantidadePessoas": 35,
    "ativo": true
  },
  {
    "id": 5,
    "nome": "Saúde e Qualidade de Vida",
    "sigla": "GISQV",
    "descricao": "Gerência de Saúde e Qualidade de Vida",
    "quantidadePessoas": 25,
    "ativo": true
  },
  {
    "id": 6,
    "nome": "Rede de Agências",
    "sigla": "REAGE",
    "descricao": "Rede de Agências e Unidades de Atendimento",
    "quantidadePessoas": 350,
    "ativo": true
  },
  {
    "id": 7,
    "nome": "Controladoria e Compliance",
    "sigla": "GICOC",
    "descricao": "Gerência de Controladoria e Compliance",
    "quantidadePessoas": 30,
    "ativo": true
  },
  {
    "id": 8,
    "nome": "Habitação",
    "sigla": "GIHAB",
    "descricao": "Gerência de Habitação",
    "quantidadePessoas": 80,
    "ativo": true
  }
]
```

---

### 1.2 Listar Etapas

**`GET /api/etapas`**

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Usabilidade",  "descricao": "Facilidade de uso, interface intuitiva e navegação do sistema.",        "icone": "mouse", "ordem": 1, "ativo": true },
  { "id": 2, "nome": "Eficiência",   "descricao": "Rapidez, desempenho, tempo de resposta e produtividade com o sistema.", "icone": "bolt",  "ordem": 2, "ativo": true },
  { "id": 3, "nome": "Aprendizado",  "descricao": "Facilidade de aprendizado, curva de aprendizado e suporte disponível.", "icone": "book",  "ordem": 3, "ativo": true },
  { "id": 4, "nome": "Eficácia",     "descricao": "Resultados e impacto no trabalho.",                                     "icone": "check", "ordem": 4, "ativo": true }
]
```

---

### 1.3 Listar Sistemas

**`GET /api/sistemas`**

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "sigla": "SISRH",
    "nome": "Sistema de Gestão de Recursos Humanos",
    "descricao": "Sistema corporativo para gestão de recursos humanos, cadastro funcional, movimentação e informações de pessoal.",
    "icone": "user",
    "ordem": 1,
    "ativo": true
  },
  {
    "id": 2,
    "sigla": "SIPON",
    "nome": "Sistema de Controle de Ponto",
    "descricao": "Sistema para registro e controle de ponto eletrônico, jornada de trabalho, horas extras e banco de horas.",
    "icone": "clock",
    "ordem": 2,
    "ativo": true
  },
  {
    "id": 3,
    "sigla": "Integramais",
    "nome": "Sistema de Integração de Sistemas de Gestão de Pessoas",
    "descricao": "Plataforma integradora dos sistemas de gestão de pessoas, centralizando informações de múltiplos sistemas.",
    "icone": "link",
    "ordem": 3,
    "ativo": true
  },
  {
    "id": 4,
    "sigla": "Atendimento",
    "nome": "Sistema de Atendimento",
    "descricao": "Sistema de gestão de atendimento ao cliente interno e externo, protocolos e solicitações.",
    "icone": "phone",
    "ordem": 4,
    "ativo": true
  },
  {
    "id": 5,
    "sigla": "SIABE",
    "nome": "Sistema de Administração de Pagamentos de Benefícios",
    "descricao": "Sistema para administração e controle de pagamentos de benefícios sociais e trabalhistas.",
    "icone": "money",
    "ordem": 5,
    "ativo": true
  },
  {
    "id": 6,
    "sigla": "SIAGS",
    "nome": "Sistema de Autogestão em Saúde",
    "descricao": "Sistema para autogestão de planos de saúde, marcação de consultas, autorizações e reembolsos.",
    "icone": "health",
    "ordem": 6,
    "ativo": true
  },
  {
    "id": 7,
    "sigla": "SIAUT",
    "nome": "Sistema de Autoatendimento",
    "descricao": "Sistema de autoatendimento para colaboradores: contracheques, férias, benefícios e documentos.",
    "icone": "desktop",
    "ordem": 7,
    "ativo": true
  }
]
```

> **Nota:** `urlAcesso` foi removido do contrato — o front não usa esse campo.

---

## 2. Pesquisas

### 2.1 Listar Pesquisas

**`GET /api/pesquisas`**

Aceita filtros opcionais via query string.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `status` | number | `1` = Aberta · `2` = Em andamento · `3` = Encerrada |
| `areaId` | number | Filtra por área |
| `dataInicio` | string (YYYY-MM-DD) | Data de início |
| `dataFim` | string (YYYY-MM-DD) | Data de fim |

**Exemplo:** `GET /api/pesquisas?status=1`

**Response `200 OK`** — sempre array, mesmo com um único resultado
```json
[
  {
    "id": 1,
    "nome": "Pesquisa de Satisfação da Experiência Digital na Caixa - 2026",
    "descricao": "Pesquisa anual para avaliar a satisfação dos colaboradores com os sistemas digitais corporativos.",
    "areaId": 1,
    "areaNome": "Tecnologia da Informação",
    "quantidadePessoas": 120,
    "status": 1,
    "dtInicio": "2026-05-01",
    "dtFim": "2026-06-30",
    "quantidadeQuestoes": 84,
    "quantidadeRespostas": 47
  }
]
```

> **Importante:** retornar **array** mesmo quando há apenas uma pesquisa ativa. O front usa `lista[0]` para pegar a pesquisa ativa — se vier objeto `{}`, quebra.

---

### 2.2 Buscar Pesquisa por ID

**`GET /api/pesquisas/{id}`**

Retorna os dados da pesquisa **sem questões**. Questões vêm separadas (ver 2.3).

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Pesquisa de Satisfação da Experiência Digital na Caixa - 2026",
  "descricao": "Pesquisa anual para avaliar a satisfação dos colaboradores da Caixa com os sistemas digitais corporativos. Avalia 7 sistemas em 4 etapas: Usabilidade, Eficiência, Aprendizado e Eficácia. PESQUISA ANÔNIMA.",
  "areaId": 1,
  "areaNome": "Tecnologia da Informação",
  "quantidadePessoas": 120,
  "status": 1,
  "dtInicio": "2026-05-01",
  "dtFim": "2026-06-30"
}
```

**Response `404 Not Found`** — ver seção 6.

---

### 2.3 Buscar Questões da Pesquisa

**`GET /api/pesquisas/{id}/questoes`**

Retorna as questões da pesquisa. Aceita filtros obrigatórios para o fluxo de resposta.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `sistemaId` | number | Sim | Filtra questões do sistema |
| `etapa` | number | Sim | Filtra questões da etapa (1–4) |

**Exemplo:** `GET /api/pesquisas/1/questoes?sistemaId=2&etapa=1`

**Response `200 OK`** — sempre array
```json
[
  {
    "id": 6,
    "numero": 6,
    "sistemaId": 2,
    "etapa": 1,
    "tipo": "M",
    "titulo": "A interface do SIPON é fácil de usar para registrar o ponto?",
    "descricao": "Considere a facilidade de navegação e o layout das telas.",
    "alternativas": [
      { "id": 1, "numero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricao": "Discordo totalmente" },
      { "id": 2, "numero": 2, "letra": "B", "valor": 2, "ordem": 2, "descricao": "Discordo parcialmente" },
      { "id": 3, "numero": 3, "letra": "C", "valor": 3, "ordem": 3, "descricao": "Concordo parcialmente" },
      { "id": 4, "numero": 4, "letra": "D", "valor": 4, "ordem": 4, "descricao": "Concordo totalmente" }
    ]
  },
  {
    "id": 7,
    "numero": 7,
    "sistemaId": 2,
    "etapa": 1,
    "tipo": "M",
    "titulo": "A navegação entre telas e funcionalidades do SIPON é fluida e lógica?",
    "descricao": null,
    "alternativas": [
      { "id": 1, "numero": 1, "letra": "A", "valor": 1, "ordem": 1, "descricao": "Discordo totalmente" },
      { "id": 2, "numero": 2, "letra": "B", "valor": 2, "ordem": 2, "descricao": "Discordo parcialmente" },
      { "id": 3, "numero": 3, "letra": "C", "valor": 3, "ordem": 3, "descricao": "Concordo parcialmente" },
      { "id": 4, "numero": 4, "letra": "D", "valor": 4, "ordem": 4, "descricao": "Concordo totalmente" }
    ]
  },
  {
    "id": 8,
    "numero": 8,
    "sistemaId": 2,
    "etapa": 1,
    "tipo": "S",
    "titulo": "Deixe um comentário sobre a usabilidade do SIPON.",
    "descricao": null,
    "alternativas": []
  }
]
```

**Campos das questões:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number | ID da questão |
| `numero` | number | Número sequencial dentro da pesquisa |
| `sistemaId` | number | ID do sistema avaliado |
| `etapa` | number | Número da etapa (1–4) |
| `tipo` | string | `"M"` = múltipla escolha · `"S"` = subjetiva |
| `titulo` | string | Texto da questão |
| `descricao` | string \| null | Subtítulo/instrução da questão |
| `alternativas` | array | Vazio `[]` para questões subjetivas |

---

### 2.4 Cadastrar Pesquisa

**`POST /api/pesquisas`**

**Request**
```json
{
  "nome": "Pesquisa de Satisfação Digital - JUNHO",
  "descricao": "Avaliação da experiência digital dos colaboradores.",
  "areaId": 1,
  "dtInicio": "2026-06-01",
  "dtFim": "2026-06-30"
}
```

**Response `201 Created`**
```json
{
  "id": 2,
  "nome": "Pesquisa de Satisfação Digital - JUNHO",
  "status": 1,
  "dtInicio": "2026-06-01",
  "dtFim": "2026-06-30"
}
```

> **Nota:** as questões são geradas automaticamente pelo back a partir de um template fixo (3 questões × 4 etapas × 7 sistemas = 84 questões). O front não envia questões no cadastro.

---

## 3. Respostas

### 3.1 Verificar se Matrícula Já Respondeu

**`GET /api/respostas/consulta?pesquisaId={pesquisaId}&matricula={matricula}`**

**Exemplo:** `GET /api/respostas/consulta?pesquisaId=1&matricula=c158543`

| Situação | Status | Body |
|----------|--------|------|
| Já respondeu | `200 OK` | Objeto da resposta (ver abaixo) |
| Não respondeu | `404 Not Found` | Formato de erro padrão (ver seção 6) |

**Response `200 OK`**
```json
{
  "id": 100,
  "pesquisaId": 1,
  "matricula": "c158543",
  "areaId": 2,
  "dtHoraResposta": "2026-06-10T14:30:00",
  "enderecoIp": "128.0.0.1",
  "finalizada": true,
  "totalQuestoes": 84,
  "sistemaIds": [1, 2, 3]
}
```

> **Nota:** o front usa esse endpoint apenas para verificar se a pessoa já respondeu e quais sistemas avaliou. Não precisa retornar as questões respondidas — isso economiza processamento e simplifica a implementação.

---

### 3.2 Gravar Resposta

**`POST /api/respostas`**

**Request**
```json
{
  "pesquisaId": 1,
  "matricula": "c158543",
  "areaId": 2,
  "dtHoraResposta": "2026-06-10T14:30:00",
  "questoes": [
    {
      "questaoId": 1,
      "numero": 1,
      "tipo": "M",
      "alternativaNumero": 3,
      "respostaSubjetiva": null
    },
    {
      "questaoId": 3,
      "numero": 3,
      "tipo": "S",
      "alternativaNumero": null,
      "respostaSubjetiva": "O sistema poderia ter mais tutoriais."
    }
  ]
}
```

**Campos do request:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `pesquisaId` | number | Sim | ID da pesquisa |
| `matricula` | string | Sim | Matrícula do colaborador |
| `areaId` | number | Sim | Área do colaborador |
| `dtHoraResposta` | string (ISO 8601) | Sim | Data/hora do envio |
| `questoes` | array | Sim | Respostas de todas as questões |
| `questoes[].questaoId` | number | Sim | ID da questão |
| `questoes[].numero` | number | Sim | Número sequencial da questão |
| `questoes[].tipo` | string | Sim | `"M"` ou `"S"` |
| `questoes[].alternativaNumero` | number \| null | Para tipo `"M"` | Número da alternativa escolhida |
| `questoes[].respostaSubjetiva` | string \| null | Para tipo `"S"` | Texto livre |

**Response `201 Created`**
```json
{
  "id": 100,
  "pesquisaId": 1,
  "matricula": "c158543",
  "areaId": 2,
  "dtHoraResposta": "2026-06-10T14:30:00",
  "finalizada": true
}
```

**Response `409 Conflict`** — matrícula já respondeu esta pesquisa
```json
{
  "erro": "RESPOSTA_DUPLICADA",
  "mensagem": "A matrícula c158543 já respondeu a pesquisa 1.",
  "idRespostaExistente": 100
}
```

---

## 4. Dashboard (futuro — não implementar agora)

Endpoints reservados para a tela de administração. Serão detalhados em documento separado quando o front estiver pronto.

```
GET /api/pesquisas/{id}/dashboard          → resumo geral da pesquisa
GET /api/pesquisas/{id}/dashboard/sistemas → resultados por sistema
GET /api/pesquisas/{id}/dashboard/areas    → resultados por área
```

---

## 5. Cabeçalhos CORS

O back deve aceitar requisições do front em desenvolvimento (`http://localhost:4200`) e produção.

```java
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
```

Ou configurar globalmente no `WebMvcConfigurer`.

---

## 6. Formato Padrão de Erros

Todos os erros devem seguir o mesmo formato para que o front possa tratar de forma genérica.

**Response `404 Not Found`**
```json
{
  "erro": "NAO_ENCONTRADO",
  "mensagem": "Pesquisa com id 99 não encontrada."
}
```

**Response `400 Bad Request`**
```json
{
  "erro": "DADOS_INVALIDOS",
  "mensagem": "O campo 'matricula' é obrigatório.",
  "campo": "matricula"
}
```

**Response `500 Internal Server Error`**
```json
{
  "erro": "ERRO_INTERNO",
  "mensagem": "Erro inesperado. Contate o suporte."
}
```

> **Importante:** nunca expor stack trace ou mensagem de exceção Java no response de produção.

---

## 7. Mapeamento: atual → proposto

| Endpoint atual | Endpoint proposto | Motivo da mudança |
|---|---|---|
| `GET /api/pesquisa/lista/areas` | `GET /api/areas` | Simplificação — `/lista/` é redundante |
| `GET /api/etapas` | `GET /api/etapas` | Sem mudança — já está correto |
| `GET /api/sistemas` | `GET /api/sistemas` | Sem mudança — já está correto |
| `GET /api/pesquisa/lista` | `GET /api/pesquisas` | Plural consistente com REST |
| `GET /api/pesquisa?idPesquisa=X&idSistema=Y&etapa=Z` | `GET /api/pesquisas/{id}/questoes?sistemaId=Y&etapa=Z` | ID no path, filtros na query string |
| `GET /api/pesquisa/cadastro/{id}` | `GET /api/pesquisas/{id}` | Era inexistente; agora faz parte do padrão |
| `POST /api/pesquisa/cadastro` | `POST /api/pesquisas` | Verbo HTTP já indica criação — `/cadastro` é redundante |
| `POST /api/pesquisa/resposta` | `POST /api/respostas` | Substantivo no plural, fora do namespace de pesquisa |
| `GET /api/pesquisa/resposta/{id}/consulta?matricula=X` | `GET /api/respostas/consulta?pesquisaId=X&matricula=Y` | Mais legível; sem path param desnecessário |
| `GET /api/pesquisa/resposta/{id}/consulta/resposta?idResposta=X` | `GET /api/respostas/{id}` | Simplificado para o padrão REST |

---

## 8. Checklist para o back-end

- [ ] Criar DTOs separados para cada response — nunca retornar entidade JPA diretamente
- [ ] Garantir que todos os endpoints de lista retornam `[]` (array), nunca `{}` (objeto)
- [ ] Garantir que `GET /api/pesquisas?status=1` retorna **array** mesmo com um único resultado
- [ ] Configurar `@ControllerAdvice` com handler de exceção global para os formatos de erro da seção 6
- [ ] Configurar CORS para `http://localhost:4200`
- [ ] Remover `spring.jackson.serialization.fail-on-empty-beans=false` — essa propriedade mascara o problema; a solução correta é usar DTOs
- [ ] Testar `GET /api/pesquisas/consulta?pesquisaId=1&matricula=SEM_RESPOSTA` — deve retornar `404`, não `500` nem `[]`