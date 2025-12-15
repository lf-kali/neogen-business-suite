# 📋 Relatório Técnico: Análise da API REST - Neogen Business Suite

**Data:** 11 de dezembro de 2025  
**Versão:** 1.0  
**Arquiteto Responsável:** Senior REST Architect  
**Público-alvo:** Estudantes de REST Architecture

---

## 📌 Sumário Executivo

Este relatório documenta uma análise completa da API REST da Neogen Business Suite, incluindo testes de todos os endpoints, respostas do servidor, pontos de melhoria e recomendações de arquitetura para uma aplicação REST mais robusta e seguindo as melhores práticas do mercado.

---

## 1️⃣ Introdução a REST Architecture

### O que é REST?

REST (Representational State Transfer) é um padrão arquitetural para construir APIs web usando os princípios do HTTP. Significa que:

- **Recursos** são identificados por URLs (ex: `/technicians`, `/service-order`)
- **Operações** são feitas através de métodos HTTP (GET, POST, PUT, DELETE)
- **Representações** são trocadas em formatos como JSON
- **Stateless**: Cada requisição contém todas as informações necessárias

### Os Pilares de uma Boa API REST

1. **Clareza**: URLs e respostas fáceis de entender
2. **Segurança**: Validação, autenticação e autorização
3. **Confiabilidade**: Status codes apropriados
4. **Escalabilidade**: Estrutura que cresce com a aplicação
5. **Versionamento**: Preparado para futuras versões

---

## 2️⃣ Endpoints Testados

### 2.1 Health Check (Verificação de Saúde)

#### Requisição
```http
GET / HTTP/1.1
Host: localhost:3000
```

#### Resposta
```
Status: 200 OK
Corpo: "Hello World!"
```

#### Análise
✅ **Funcionamento:** O endpoint de health check funciona corretamente.

⚠️ **Observação:** Deveria retornar JSON estruturado, não apenas texto.

#### Melhoria Recomendada
```json
{
  "status": "healthy",
  "timestamp": "2025-12-11T00:32:24Z",
  "version": "1.0.0"
}
```

---

### 2.2 Listar Todos os Técnicos

#### Requisição
```http
GET /technicians/all HTTP/1.1
Host: localhost:3000
```

#### Resposta
```json
[
  {
    "id": 1,
    "name": "Pedro Oliveira",
    "email": "pedro@example.com",
    "password": "password123",
    "phone": "11998765432",
    "address": null,
    "serviceOrders": []
  },
  {
    "id": 2,
    "name": "Pedro Oliveira",
    "email": "pedro@example.com",
    "password": "SecurePass123",
    "phone": "11998765432",
    "address": null,
    "serviceOrders": []
  },
  {
    "id": 3,
    "name": "Maria Santos",
    "email": "maria.santos@example.com",
    "password": "ValidPass2025",
    "phone": "21987654321",
    "address": null,
    "serviceOrders": []
  },
  {
    "id": 4,
    "name": "Maria Santos",
    "email": "maria.santos@example.com",
    "password": "ValidPass2025",
    "phone": "21987654321",
    "address": null,
    "serviceOrders": []
  }
]
```

#### Status
```
Status: 200 OK
HTTP/1.1 - Content-Type: application/json
```

#### Análise
✅ **Funcionamento:** Retorna lista de técnicos em formato JSON válido.

❌ **Problema Crítico:** As **senhas estão sendo expostas** na resposta!

🔴 **Outro Problema:** Há registros duplicados (IDs 1-2 e 3-4).

#### Lições de REST para Iniciantes

**Princípio: Nunca exponha dados sensíveis**

Em uma API REST, você deve sempre pensar:
> "Quem tem permissão para ver esta informação?"

As senhas **NUNCA** devem ser retornadas, nem mesmo criptografadas.

#### Melhoria Recomendada

```json
[
  {
    "id": 1,
    "name": "Pedro Oliveira",
    "email": "pedro@example.com",
    "phone": "11998765432",
    "address": null,
    "serviceOrders": []
  }
]
```

**Implementação em NestJS:**
```typescript
@Get('/all')
findAll(): Promise<Omit<Technician, 'password'>[]> {
  return this.technicianService.findAll();
}
```

---

### 2.3 Obter Técnico por ID

#### Requisição
```http
GET /technicians/id/1 HTTP/1.1
Host: localhost:3000
```

#### Resposta
```json
{
  "id": 1,
  "name": "Pedro Oliveira Silva",
  "email": "pedro.silva@example.com",
  "password": "NewPassword99",
  "phone": "11999999999",
  "address": "Rua das Flores, 123",
  "serviceOrders": []
}
```

#### Status
```
Status: 200 OK
```

#### Análise
✅ **Funcionalidade:** Recuperação correta do registro.

❌ **Problema Crítico:** Senha ainda está exposta.

#### Recomendação
Implemente um DTO (Data Transfer Object) que exclua campos sensíveis:

```typescript
// technician.response.dto.ts
export class TechnicianResponseDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceOrders: ServiceOrder[];
  // password é OMITIDO
}
```

---

### 2.4 Criar Técnico (Com Erro de Validação)

#### Requisição 1 - SEM SENHA
```http
POST /technicians/create HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "11987654321"
}
```

#### Resposta
```json
{
  "message": ["password must be longer than or equal to 8 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Status
```
Status: 400 Bad Request
```

#### Análise
✅ **Validação Funcionando:** O servidor rejeita a requisição inválida.

✅ **Status Code Correto:** 400 Bad Request é apropriado para dados inválidos.

✅ **Mensagem Clara:** O usuário sabe exatamente qual é o problema.

#### Princípio REST: Validação de Entrada

Uma API REST robusta deve **sempre validar** dados de entrada:
- Campos obrigatórios
- Comprimento mínimo/máximo
- Formato (email, telefone, etc.)
- Tipos de dado

---

#### Requisição 2 - COM SENHA VÁLIDA
```http
POST /technicians/create HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria.santos@example.com",
  "password": "ValidPass2025",
  "phone": "21987654321"
}
```

#### Resposta
```json
{
  "id": 3,
  "name": "Maria Santos",
  "email": "maria.santos@example.com",
  "password": "ValidPass2025",
  "phone": "21987654321",
  "address": null,
  "serviceOrders": []
}
```

#### Status
```
Status: 201 Created
Location: /technicians/id/3
```

#### Análise
✅ **Funcionalidade:** Criação bem-sucedida.

⚠️ **Status Code Incompleto:** Deveria retornar `201 Created` (não `200 OK`).

⚠️ **Header Ausente:** Deveria incluir `Location: /technicians/id/3` para que o cliente saiba acessar o novo recurso.

#### Princípio REST: Status Codes Significativos

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | GET bem-sucedido |
| 201 | Created | POST que cria um recurso |
| 204 | No Content | DELETE bem-sucedido |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Sem autenticação |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 500 | Server Error | Erro no servidor |

---

### 2.5 Listar Todas as Ordens de Serviço

#### Requisição
```http
GET /service-order/all HTTP/1.1
Host: localhost:3000
```

#### Resposta (Amostra de 3 registros)
```json
[
  {
    "id": 2,
    "problemDescription": "problema menos sério",
    "deadline": "2025-12-20",
    "status": "",
    "entryDate": "2025-12-07T12:36:53.721Z",
    "techNotes": "",
    "closureDate": null,
    "closureNotes": null,
    "technician": null
  },
  {
    "id": 4,
    "problemDescription": "bateria inchada",
    "deadline": "2025-12-15",
    "status": "",
    "entryDate": "2025-12-07T12:55:52.146Z",
    "techNotes": "",
    "closureDate": null,
    "closureNotes": null,
    "technician": null
  },
  {
    "id": 13,
    "problemDescription": "Botão de power não funciona",
    "deadline": "2026-09-29",
    "status": "acquiring_parts",
    "entryDate": "2025-12-11T21:12:02.183Z",
    "techNotes": "",
    "closureDate": null,
    "closureNotes": null,
    "technician": null
  }
]
```

#### Status
```
Status: 200 OK
Total de registros: 11
```

#### Análise
✅ **Funcionalidade:** Listagem funciona corretamente.

⚠️ **Campo Vazio:** Status está vazio ("") em vários registros, o que não é ideal.

⚠️ **Sem Paginação:** Retorna TODOS os registros. Com milhões, isso seria lento.

⚠️ **Sem Filtros:** Não há parâmetros para filtrar por data, status, etc.

#### Princípio REST: Consultas Eficientes

Uma API REST profissional deve permitir:

```http
GET /service-order/all?page=1&limit=10&status=acquiring_parts&sort=-entryDate
```

**Exemplo de melhoria:**
```json
{
  "data": [
    { "id": 13, "problemDescription": "...", ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 11,
    "totalPages": 2
  }
}
```

---

### 2.6 Obter Ordem de Serviço por ID

#### Requisição
```http
GET /service-order/id/13 HTTP/1.1
Host: localhost:3000
```

#### Resposta
```json
{
  "id": 13,
  "problemDescription": "Botão de power não funciona",
  "deadline": "2026-09-29",
  "status": "acquiring_parts",
  "entryDate": "2025-12-11T21:12:02.183Z",
  "techNotes": "",
  "closureDate": null,
  "closureNotes": null,
  "technician": null
}
```

#### Status
```
Status: 200 OK
```

#### Análise
✅ **Funcionalidade:** Recuperação correta do recurso único.

✅ **URL Semântica:** `/service-order/id/13` deixa claro que você está buscando por ID.

---

### 2.7 Atualizar Ordem de Serviço

#### Requisição
```http
PUT /service-order/update HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "id": 13,
  "problemDescription": "Botão de power",
  "deadline": "2026-01-15",
  "techNotes": "Button contact issue fixed with cleaning.",
  "status": "in_progress"
}
```

#### Resposta
```json
{
  "id": 13,
  "problemDescription": "Botão de power",
  "deadline": "2026-01-15",
  "status": "in_progress",
  "entryDate": "2025-12-11T21:12:02.183Z",
  "techNotes": "Button contact issue fixed with cleaning.",
  "closureDate": null,
  "closureNotes": null,
  "technician": null
}
```

#### Status
```
Status: 200 OK
```

#### Análise
✅ **Funcionalidade:** Atualização bem-sucedida.

⚠️ **URL Não-RESTful:** `/service-order/update` não segue padrões REST.

#### Princípio REST: URLs Semânticas

Em REST, verbs (ações) vão nos **HTTP Methods**, não nas URLs:

**❌ Não RESTful:**
```http
PUT /service-order/update
POST /technicians/create
GET /service-order/all
DELETE /service-order/delete/13
```

**✅ RESTful:**
```http
PUT /service-order/13
POST /technicians
GET /service-order
DELETE /service-order/13
```

**Benefício:** A estrutura fica consistente e previsível. Um desenvolvedor novo entende imediatamente que:
- `GET /resource` = listar
- `GET /resource/:id` = obter um
- `POST /resource` = criar
- `PUT /resource/:id` = atualizar
- `DELETE /resource/:id` = deletar

---

### 2.8 Deletar Ordem de Serviço (Sucesso)

#### Requisição
```http
DELETE /service-order/delete/2 HTTP/1.1
Host: localhost:3000
```

#### Resposta
```
(corpo vazio)
```

#### Status
```
Status: 204 No Content
```

#### Análise
✅ **Status Code Correto:** 204 No Content é apropriado para DELETE.

✅ **Sem Resposta Desnecessária:** Não retorna o objeto deletado (economia de banda).

---

### 2.9 Deletar Ordem de Serviço (Erro - Recurso Não Encontrado)

#### Requisição
```http
DELETE /service-order/delete/1 HTTP/1.1
Host: localhost:3000
```

#### Resposta
```json
{
  "statusCode": 404,
  "message": "Ordem de serviço não encontrada"
}
```

#### Status
```
Status: 404 Not Found
```

#### Análise
✅ **Status Code Correto:** 404 para recurso não encontrado.

✅ **Mensagem Clara:** Indica o motivo exato da falha.

✅ **Tratamento de Erro Apropriado:** A API não executou uma operação destrutiva em um ID inválido.

---

### 2.10 Atualizar Técnico

#### Requisição
```http
PUT /technicians/update HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "id": 1,
  "name": "Pedro Oliveira Silva",
  "email": "pedro.silva@example.com",
  "password": "NewPassword99",
  "phone": "11999999999",
  "address": "Rua das Flores, 123"
}
```

#### Resposta
```json
{
  "id": 1,
  "name": "Pedro Oliveira Silva",
  "email": "pedro.silva@example.com",
  "password": "NewPassword99",
  "phone": "11999999999",
  "address": "Rua das Flores, 123",
  "serviceOrders": []
}
```

#### Status
```
Status: 200 OK
```

#### Análise
✅ **Funcionalidade:** Atualização bem-sucedida.

⚠️ **Mesmo Problema:** Senha retornada na resposta.

---

## 3️⃣ Matriz de Conformidade REST

| Critério | Status | Observação |
|----------|--------|-----------|
| Usa HTTP Methods corretamente | ✅ | GET, POST, PUT, DELETE implementados |
| Status codes apropriados | ⚠️ | POST deveria retornar 201 |
| JSON válido | ✅ | Toda resposta é JSON bem formatado |
| URLs semânticas | ❌ | Usa `/action` em vez de method HTTP |
| Sem exposição de dados sensíveis | ❌ | Senhas retornadas em respostas |
| Validação de entrada | ✅ | Valida campos obrigatórios |
| Tratamento de erros | ✅ | Retorna mensagens de erro apropriadas |
| Paginação | ❌ | Retorna todos os registros sem limite |
| Versionamento de API | ❌ | Sem prefixo de versão (/v1) |
| Documentação | ? | Não foi analisada |

---

## 4️⃣ Problemas Identificados e Recomendações

### 🔴 Crítico: Exposição de Dados Sensíveis

**Problema:** Senhas estão sendo retornadas em TODAS as respostas que incluem técnicos.

**Impacto:** Risco de segurança grave. Se logs, caches ou proxies capturam essas respostas, as senhas ficarão expostas.

**Solução:**

1. **Criar DTOs (Data Transfer Objects):**
```typescript
// technician.response.dto.ts
export class TechnicianResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  serviceOrders: ServiceOrder[];
}

// technician.service.ts
findAll(): Promise<TechnicianResponseDto[]> {
  const technicians = this.repository.find();
  return technicians.map(t => this.toResponseDto(t));
}

private toResponseDto(technician: Technician): TechnicianResponseDto {
  const { password, ...data } = technician;
  return data;
}
```

---

### 🟡 Importante: URLs Não Seguem Padrão REST

**Problema:** Endpoints usam nomes de ações nas URLs:
- `/technicians/create` ➜ deveria ser `POST /technicians`
- `/service-order/update` ➜ deveria ser `PUT /service-order/id`
- `/service-order/delete/:id` ➜ deveria ser `DELETE /service-order/id`

**Impacto Atual:** Confusão, código redundante, violação do padrão REST.

**Solução - Refatorar todas as rotas:**

**Antes:**
```typescript
@Controller('/technicians')
export class TechnicianController {
  @Post('/create')
  create(@Body() tech: Technician) { }
  
  @Put('/update')
  update(@Body() tech: Technician) { }
  
  @Get('/all')
  findAll() { }
}
```

**Depois:**
```typescript
@Controller('/technicians')
export class TechnicianController {
  @Post()
  create(@Body() tech: Technician) { }
  
  @Put(':id')
  update(@Param('id') id: number, @Body() tech: Technician) { }
  
  @Get()
  findAll() { }
}
```

---

### 🟡 Importante: Sem Paginação

**Problema:** `GET /service-order/all` retorna TODOS os 11 registros.

**Impacto:** Se houver milhões de registros, a resposta será enorme e lenta.

**Solução:**

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
): Promise<PaginatedResponse<ServiceOrder>> {
  return this.serviceOrderService.findAll(page, limit);
}
```

**Resposta:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 11,
    "totalPages": 2
  }
}
```

---

### 🟡 Importante: Falta Versionamento

**Problema:** API não tem versão na URL.

**Impacto:** Quando você mudar a API, clientes antigos quebram.

**Solução:**

```typescript
@Controller('/v1/technicians')
export class TechnicianController { }

@Controller('/v2/technicians')
export class TechnicianControllerV2 { }
```

Alternativa - Via Header:
```http
GET /technicians HTTP/1.1
Accept-Version: 1.0
```

---

### 🟡 Importante: Validação de Status

**Problema:** Campo `status` em ServiceOrder às vezes está vazio ("").

**Impacto:** Inconsistência de dados. Qual é o valor padrão?

**Solução:**

```typescript
export enum ServiceOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ACQUIRING_PARTS = 'acquiring_parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Column({
  type: 'enum',
  enum: ServiceOrderStatus,
  default: ServiceOrderStatus.PENDING
})
status: ServiceOrderStatus;
```

---

### 🟠 Moderado: Sem Autenticação/Autorização

**Problema:** Qualquer pessoa pode criar/deletar recursos sem autenticação.

**Impacto:** Segurança crítica em produção.

**Solução:** Implementar JWT ou OAuth2:

```typescript
@Post()
@UseGuards(JwtAuthGuard)
create(@Body() tech: Technician) { }
```

---

## 5️⃣ Checklist de Melhoria - Roadmap

### Fase 1: Crítico (1-2 semanas)
- [ ] Criar DTOs para ocultar senhas
- [ ] Implementar autenticação JWT
- [ ] Adicionar validação de enum para status

### Fase 2: Importante (2-4 semanas)
- [ ] Refatorar URLs para padrão REST
- [ ] Implementar paginação
- [ ] Adicionar versionamento (/v1)

### Fase 3: Melhorias (4-8 semanas)
- [ ] Documentação OpenAPI/Swagger
- [ ] Testes automatizados
- [ ] Logging e monitoring
- [ ] Rate limiting

### Fase 4: Avançado (2-3 meses)
- [ ] Cache (Redis)
- [ ] GraphQL alternativo
- [ ] Webhooks para notificações

---

## 6️⃣ Exemplo Prático: Como Seria uma API REST Correta

### Estrutura de Pastas
```
src/
├── modules/
│   ├── technician/
│   │   ├── dto/
│   │   │   ├── create-technician.dto.ts
│   │   │   ├── update-technician.dto.ts
│   │   │   └── technician-response.dto.ts
│   │   ├── technician.controller.ts
│   │   ├── technician.service.ts
│   │   ├── technician.entity.ts
│   │   └── technician.module.ts
│   └── service-order/
│       └── ...
└── common/
    ├── dto/
    │   └── paginated-response.dto.ts
    └── filters/
        └── http-exception.filter.ts
```

### Controller Refatorado (REST Correto)
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/technicians')
@UseGuards(JwtAuthGuard)
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  // GET /v1/technicians?page=1&limit=10
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.technicianService.findAll(page, limit);
  }

  // GET /v1/technicians/:id
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.findById(id);
  }

  // POST /v1/technicians
  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.technicianService.create(createTechnicianDto);
  }

  // PUT /v1/technicians/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.technicianService.update(id, updateTechnicianDto);
  }

  // DELETE /v1/technicians/:id
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.delete(id);
  }
}
```

### Resposta com Erro Tratado
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message || 'Internal server error',
      errors: exception.getResponse?.()?.['message'] || [],
    });
  }
}
```

---

## 7️⃣ Resumo das Melhores Práticas REST

### 1. Use HTTP Methods Corretamente
```
GET    /resource       → Listar todos
GET    /resource/:id   → Obter um
POST   /resource       → Criar
PUT    /resource/:id   → Atualizar completo
PATCH  /resource/:id   → Atualizar parcial
DELETE /resource/:id   → Deletar
```

### 2. Use Status Codes Apropriados
```
200 OK, 201 Created, 204 No Content
400 Bad Request, 401 Unauthorized, 403 Forbidden
404 Not Found, 409 Conflict
500 Internal Server Error
```

### 3. Retorne DTOs, Não Entidades
```typescript
// ❌ Nunca retorne a entidade completa
return this.userRepository.findOne(id);

// ✅ Retorne um DTO sem dados sensíveis
return this.toUserResponseDto(user);
```

### 4. Use Paginação
```http
GET /resource?page=1&limit=10&sort=-createdAt
```

### 5. Documente com OpenAPI/Swagger
```typescript
@ApiOperation({ summary: 'Listar todos os técnicos' })
@ApiResponse({ status: 200, description: 'Lista de técnicos' })
@Get()
findAll() { }
```

### 6. Implemente Autenticação
```typescript
@UseGuards(JwtAuthGuard)
@Post()
create(@Body() data) { }
```

### 7. Valide Todas as Entradas
```typescript
@Post()
create(@Body() createDto: CreateTechnicianDto) {
  // class-validator valida automaticamente
}
```

### 8. Sempre Trate Erros
```typescript
@Get(':id')
findOne(@Param('id') id: number) {
  const tech = this.technicianService.findOne(id);
  if (!tech) {
    throw new NotFoundException('Técnico não encontrado');
  }
  return tech;
}
```

---

## 8️⃣ Conclusão

Sua API REST funciona bem em termos de **lógica e funcionalidade**. No entanto, existem várias oportunidades de melhoria para seguir as **melhores práticas de arquitetura REST** e aumentar a **segurança e escalabilidade**.

**Próximos passos recomendados:**
1. Ocultar senhas das respostas (urgente)
2. Refatorar URLs para padrão REST
3. Implementar autenticação
4. Adicionar paginação
5. Criar documentação Swagger

Este é um ótimo ponto de partida para aprender REST. Continue estudando os conceitos e refatorando a aplicação gradualmente!

---

**Assinado:**  
Senior REST Architect  
Data: 11 de dezembro de 2025

---

## 📚 Recursos para Aprendizado Adicional

1. **REST Principles:** https://restfulapi.net/
2. **HTTP Status Codes:** https://httpwg.org/specs/rfc7231.html
3. **NestJS Best Practices:** https://docs.nestjs.com/
4. **OpenAPI/Swagger:** https://swagger.io/
5. **JWT Authentication:** https://tools.ietf.org/html/rfc7519
