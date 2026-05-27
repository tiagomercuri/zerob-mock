# Swagger API — Contrato Proposto

> Base URL: `http://localhost:8080`

---

## GET /api/areas

```json
[
  { "id": 1, "nome": "Tecnologia da Informação",  "sigla": "CETEC", "descricao": "Centralizadora de Tecnologia",                "quantidadePessoas": 120, "ativo": true },
  { "id": 2, "nome": "Gestão de Pessoas",          "sigla": "GIPES", "descricao": "Gerência de Gestão de Pessoas",               "quantidadePessoas": 45,  "ativo": true },
  { "id": 3, "nome": "Atendimento e Operações",    "sigla": "GIATE", "descricao": "Gerência de Atendimento",                     "quantidadePessoas": 200, "ativo": true },
  { "id": 4, "nome": "Administração e Finanças",   "sigla": "GIAFI", "descricao": "Gerência de Administração e Finanças",         "quantidadePessoas": 35,  "ativo": true },
  { "id": 5, "nome": "Saúde e Qualidade de Vida",  "sigla": "GISQV", "descricao": "Gerência de Saúde e Qualidade de Vida",       "quantidadePessoas": 25,  "ativo": true },
  { "id": 6, "nome": "Rede de Agências",           "sigla": "REAGE", "descricao": "Rede de Agências e Unidades de Atendimento",  "quantidadePessoas": 350, "ativo": true },
  { "id": 7, "nome": "Controladoria e Compliance", "sigla": "GICOC", "descricao": "Gerência de Controladoria e Compliance",      "quantidadePessoas": 30,  "ativo": true },
  { "id": 8, "nome": "Habitação",                  "sigla": "GIHAB", "descricao": "Gerência de Habitação",                       "quantidadePessoas": 80,  "ativo": true }
]
```

---

## GET /api/etapas

```json
[
  { "id": 1, "nome": "Usabilidade",  "descricao": "Facilidade de uso, interface intuitiva e navegação do sistema.",        "icone": "mouse", "ordem": 1, "ativo": true },
  { "id": 2, "nome": "Eficiência",   "descricao": "Rapidez, desempenho, tempo de resposta e produtividade com o sistema.", "icone": "bolt",  "ordem": 2, "ativo": true },
  { "id": 3, "nome": "Aprendizado",  "descricao": "Facilidade de aprendizado, curva de aprendizado e suporte disponível.", "icone": "book",  "ordem": 3, "ativo": true },
  { "id": 4, "nome": "Eficácia",     "descricao": "Resultados e impacto no trabalho.",                                     "icone": "check", "ordem": 4, "ativo": true }
]
```

---

## GET /api/sistemas

```json
[
  { "id": 1, "sigla": "SISRH",       "nome": "Sistema de Gestão de Recursos Humanos",                  "descricao": "Sistema corporativo para gestão de recursos humanos, cadastro funcional, movimentação e informações de pessoal.",       "icone": "user",    "ordem": 1, "ativo": true },
  { "id": 2, "sigla": "SIPON",       "nome": "Sistema de Controle de Ponto",                           "descricao": "Sistema para registro e controle de ponto eletrônico, jornada de trabalho, horas extras e banco de horas.",          "icone": "clock",   "ordem": 2, "ativo": true },
  { "id": 3, "sigla": "Integramais", "nome": "Sistema de Integração de Sistemas de Gestão de Pessoas", "descricao": "Plataforma integradora dos sistemas de gestão de pessoas, centralizando informações de múltiplos sistemas.",          "icone": "link",    "ordem": 3, "ativo": true },
  { "id": 4, "sigla": "Atendimento", "nome": "Sistema de Atendimento",                                 "descricao": "Sistema de gestão de atendimento ao cliente interno e externo, protocolos e solicitações.",                           "icone": "phone",   "ordem": 4, "ativo": true },
  { "id": 5, "sigla": "SIABE",       "nome": "Sistema de Administração de Pagamentos de Benefícios",  "descricao": "Sistema para administração e controle de pagamentos de benefícios sociais e trabalhistas.",                           "icone": "money",   "ordem": 5, "ativo": true },
  { "id": 6, "sigla": "SIAGS",       "nome": "Sistema de Autogestão em Saúde",                         "descricao": "Sistema para autogestão de planos de saúde, marcação de consultas, autorizações e reembolsos.",                       "icone": "health",  "ordem": 6, "ativo": true },
  { "id": 7, "sigla": "SIAUT",       "nome": "Sistema de Autoatendimento",                             "descricao": "Sistema de autoatendimento para colaboradores: contracheques, férias, benefícios e documentos.",                     "icone": "desktop", "ordem": 7, "ativo": true }
]
```

---

## GET /api/pesquisas?status=1

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

---

## GET /api/pesquisas/{id}

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

---

## GET /api/pesquisas/{id}/questoes?sistemaId=2&etapa=1

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

---

## GET /api/respostas/consulta?pesquisaId=1&matricula=c158543

**200 OK** — já respondeu
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

**404 Not Found** — não respondeu
```json
{ "erro": "NAO_ENCONTRADO", "mensagem": "Nenhuma resposta encontrada para a matrícula c158543 na pesquisa 1." }
```

---

## POST /api/respostas

Request Body:
```json
{
  "pesquisaId": 1,
  "matricula": "c158543",
  "areaId": 2,
  "dtHoraResposta": "2026-06-10T14:30:00",
  "questoes": [
    { "questaoId": 1, "numero": 1, "tipo": "M", "alternativaNumero": 3, "respostaSubjetiva": null },
    { "questaoId": 3, "numero": 3, "tipo": "S", "alternativaNumero": null, "respostaSubjetiva": "O sistema poderia ter mais tutoriais." }
  ]
}
```

**201 Created**
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

**409 Conflict** — matrícula já respondeu
```json
{ "erro": "RESPOSTA_DUPLICADA", "mensagem": "A matrícula c158543 já respondeu a pesquisa 1.", "idRespostaExistente": 100 }
```