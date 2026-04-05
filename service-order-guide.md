<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>ServiceOrder com Repositório Pai — Guia de Implementação</title>
</head>
<body>

<h1>ServiceOrder com Repositório Pai — Guia de Implementação</h1>

<p>Chegamos na peça que amarra tudo. O <code>ServiceOrderService</code> precisa buscar dispositivos de qualquer tipo — celular, tablet ou laptop — sem precisar conhecer cada service filho individualmente. A solução é usar o repositório da entidade pai (<code>PortableDevice</code>), que enxerga todas as linhas da tabela independente do valor da coluna <code>type</code>.</p>

<hr>

<h2>Por que o repositório pai resolve o problema</h2>

<p>Lembra que no STI todas as entidades filhas vivem na mesma tabela (<code>tb_portable_devices</code>)? O repositório de <code>PortableDevice</code> faz um <code>SELECT</code> nessa tabela sem nenhum filtro de <code>type</code>. Quando os resultados voltam, o TypeORM lê a coluna <code>type</code> de cada linha e instancia o objeto com a subclasse correta automaticamente — você recebe um array onde cada item já é <code>Cellphone</code>, <code>Tablet</code> ou <code>Laptop</code>, sem precisar fazer nada manualmente.</p>

<p>O <code>ServiceOrderService</code> não precisa saber disso. Ele só pede os dispositivos pelos IDs e recebe os objetos prontos.</p>

<hr>

<h2>Estrutura de arquivos envolvidos</h2>

<pre><code>src/
├── portable-device/
│   └── portable-device.module.ts   ← exporta o TypeOrmModule com PortableDevice
└── service-order/
    ├── service-order.module.ts      ← importa o PortableDeviceModule
    ├── service-order.service.ts     ← injeta Repository&lt;PortableDevice&gt;
    ├── service-order.controller.ts
    └── dto/
        └── create-service-order.dto.ts
</code></pre>

<hr>

<h2>1. O DTO de criação</h2>

<pre><code>// service-order/dto/create-service-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateServiceOrderDTO {

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    deviceIds: number[];

    // outros campos da ordem de serviço...
}
</code></pre>

<p>O campo <code>deviceIds</code> é um array de números — os IDs dos dispositivos que entram nessa ordem. O <code>@IsInt({ each: true })</code> garante que <em>cada item</em> do array seja um inteiro, não só o array como um todo. O <code>@ArrayMinSize(1)</code> impede que uma ordem seja criada sem nenhum dispositivo.</p>

<hr>

<h2>2. O PortableDeviceModule — exportando o repositório</h2>

<pre><code>// portable-device/portable-device.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortableDevice } from './entities/portable-device.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PortableDevice]),
    ],
    exports: [
        TypeOrmModule, // torna o Repository&lt;PortableDevice&gt; disponível para quem importar este módulo
    ],
})
export class PortableDeviceModule {}
</code></pre>

<h3>Por que exportar <code>TypeOrmModule</code> e não o próprio repositório?</h3>

<p>O NestJS não permite exportar repositórios do TypeORM diretamente como providers avulsos. Quando você exporta o <code>TypeOrmModule</code>, você está dizendo: "qualquer módulo que importar o <code>PortableDeviceModule</code> vai ter acesso a todos os repositórios que eu registrei no <code>forFeature</code> aqui dentro". É uma convenção do NestJS para compartilhar repositórios entre módulos.</p>

<p>Se você não fizesse esse export, o <code>@InjectRepository(PortableDevice)</code> no <code>ServiceOrderService</code> jogaria um erro em runtime dizendo que o provider não foi encontrado — mesmo com o módulo importado.</p>

<hr>

<h2>3. O ServiceOrderModule — importando o que precisa</h2>

<pre><code>// service-order/service-order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { PortableDeviceModule } from '../portable-device/portable-device.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceOrder]), // repositório da própria entidade
        PortableDeviceModule,                     // disponibiliza Repository&lt;PortableDevice&gt;
    ],
    controllers: [ServiceOrderController],
    providers: [ServiceOrderService],
    exports: [ServiceOrderService],
})
export class ServiceOrderModule {}
</code></pre>

<p>Dois imports aqui com papéis distintos:</p>

<p><strong><code>TypeOrmModule.forFeature([ServiceOrder])</code></strong>: registra o repositório da própria entidade <code>ServiceOrder</code>. O service vai precisar dele para salvar a ordem.</p>

<p><strong><code>PortableDeviceModule</code></strong>: graças ao <code>exports: [TypeOrmModule]</code> que configuramos lá, importar esse módulo aqui é suficiente para desbloquear o <code>@InjectRepository(PortableDevice)</code> dentro deste contexto.</p>

<hr>

<h2>4. O ServiceOrderService — o núcleo da implementação</h2>

<pre><code>// service-order/service-order.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { PortableDevice } from '../portable-device/entities/portable-device.entity';
import { CreateServiceOrderDTO } from './dto/create-service-order.dto';

@Injectable()
export class ServiceOrderService {
    constructor(
        @InjectRepository(ServiceOrder)
        private serviceOrderRepo: Repository&lt;ServiceOrder&gt;,

        @InjectRepository(PortableDevice)
        private deviceRepo: Repository&lt;PortableDevice&gt;,
    ) {}

    async findAll(): Promise&lt;ServiceOrder[]&gt; {
        return this.serviceOrderRepo.find({
            relations: ['devices'],
        });
    }

    async findByID(id: number): Promise&lt;ServiceOrder&gt; {
        const order = await this.serviceOrderRepo.findOne({
            where: { id },
            relations: ['devices'],
        });
        if (!order) {
            throw new HttpException(
                `Service order with id "${id}" not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        return order;
    }

    async create(dto: CreateServiceOrderDTO): Promise&lt;ServiceOrder&gt; {
        const devices = await this.deviceRepo.findBy(
            dto.deviceIds.map(id =&gt; ({ id }))
        );

        if (devices.length !== dto.deviceIds.length) {
            const foundIds = devices.map(d =&gt; d.id);
            const missing = dto.deviceIds.filter(id =&gt; !foundIds.includes(id));
            throw new HttpException(
                `Devices not found: ${missing.join(', ')}`,
                HttpStatus.NOT_FOUND,
            );
        }

        const order = new ServiceOrder();
        order.devices = devices;
        // atribua aqui os outros campos do dto...

        return this.serviceOrderRepo.save(order);
    }

    async delete(id: number): Promise&lt;void&gt; {
        await this.findByID(id);
        await this.serviceOrderRepo.delete(id);
    }
}
</code></pre>

<p>Vamos destrinchar cada parte do <code>create</code>, que é onde a mágica acontece.</p>

<hr>

<h2>5. O findBy com array de objetos</h2>

<pre><code>const devices = await this.deviceRepo.findBy(
    dto.deviceIds.map(id =&gt; ({ id }))
);
</code></pre>

<p>Esse é o ponto central. O <code>findBy</code> do TypeORM aceita um array de condições — quando você passa um array, ele interpreta como múltiplas cláusulas <code>OR</code>. O <code>.map(id =&gt; ({ id }))</code> transforma <code>[1, 2, 3]</code> em <code>[{ id: 1 }, { id: 2 }, { id: 3 }]</code>, gerando a query:</p>

<pre><code>SELECT * FROM tb_portable_devices
WHERE id = 1 OR id = 2 OR id = 3
</code></pre>

<p>Em uma única ida ao banco, você busca todos os dispositivos de uma vez — independente de serem celulares, tablets ou laptops. O TypeORM retorna cada objeto já instanciado com a subclasse correta, lendo a coluna <code>type</code> de cada linha automaticamente.</p>

<hr>

<h2>6. A validação de IDs não encontrados</h2>

<pre><code>if (devices.length !== dto.deviceIds.length) {
    const foundIds = devices.map(d =&gt; d.id);
    const missing = dto.deviceIds.filter(id =&gt; !foundIds.includes(id));
    throw new HttpException(
        `Devices not found: ${missing.join(', ')}`,
        HttpStatus.NOT_FOUND,
    );
}
</code></pre>

<p>O <code>findBy</code> não lança erro quando um ID não existe — ele simplesmente não inclui aquele item no resultado. Por isso a validação é manual.</p>

<p>Se o cliente enviou 3 IDs mas apenas 2 foram encontrados, os arrays têm tamanhos diferentes. Filtramos quais IDs estão faltando comparando o que foi pedido com o que foi encontrado, e retornamos um erro descritivo informando exatamente quais IDs não existem. Isso é muito mais útil do que uma mensagem genérica de "not found".</p>

<hr>

<h2>7. O que o TypeORM faz por baixo dos panos</h2>

<p>Quando o resultado do <code>findBy</code> volta, cada objeto já é uma instância da subclasse correta:</p>

<pre><code>// suponha que o banco retornou um celular, um tablet e um laptop
console.log(devices[0] instanceof Cellphone); // true
console.log(devices[1] instanceof Tablet);    // true
console.log(devices[2] instanceof Laptop);    // true

// você pode usar instanceof para lógica condicional se precisar no futuro
devices.forEach(device =&gt; {
    if (device instanceof Cellphone) {
        // lógica específica de celular
    }
});
</code></pre>

<p>Você não fez nada para isso acontecer — o TypeORM leu a coluna <code>type</code> de cada linha e instanciou a classe correspondente. Essa é a recompensa de ter configurado o STI corretamente desde o início.</p>

<hr>

<h2>8. O controller</h2>

<pre><code>// service-order/service-order.controller.ts
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDTO } from './dto/create-service-order.dto';

@Controller('service-orders')
export class ServiceOrderController {

    constructor(private service: ServiceOrderService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findByID(+id);
    }

    @Post()
    create(@Body() dto: CreateServiceOrderDTO) {
        return this.service.create(dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(+id);
    }
}
</code></pre>

<p>Nada de especial aqui — segue o mesmo padrão dos controllers anteriores. O <code>+id</code> converte a string do parâmetro de rota para número antes de passar para o service.</p>

<hr>

<h2>9. Registrando no AppModule</h2>

<pre><code>// app.module.ts
@Module({
    imports: [
        TypeOrmModule.forRoot({ ...config }),
        PortableDeviceModule,
        ServiceOrderModule,
        CellphoneBrandModule,
        TabletBrandModule,
        LaptopBrandModule,
        CellphoneModelModule,
        TabletModelModule,
        LaptopModelModule,
        CellphoneModule,
        TabletModule,
        LaptopModule,
    ],
})
export class AppModule {}
</code></pre>

<p>O <code>PortableDeviceModule</code> precisa estar registrado aqui também. Mesmo que o <code>ServiceOrderModule</code> já o importe internamente, o NestJS precisa que ele esteja no contexto global da aplicação para resolver o grafo de dependências corretamente.</p>

<hr>

<h2>Visão geral do fluxo de uma requisição POST /service-orders</h2>

<pre><code>Cliente envia: { deviceIds: [1, 2, 3] }
        │
        ▼
ServiceOrderController.create(dto)
        │
        ▼
ServiceOrderService.create(dto)
        │
        ├─► deviceRepo.findBy([{id:1},{id:2},{id:3}])
        │       │
        │       ▼
        │   SELECT * FROM tb_portable_devices WHERE id IN (1,2,3)
        │       │
        │       ▼
        │   TypeORM lê coluna type de cada linha
        │   e instancia Cellphone / Tablet / Laptop
        │
        ├─► valida se todos os IDs foram encontrados
        │
        ├─► new ServiceOrder()
        │   order.devices = devices
        │
        └─► serviceOrderRepo.save(order)
                │
                ▼
            ServiceOrder salva com relação para os dispositivos
</code></pre>

<hr>

<h2>Checklist final</h2>

<ul>
  <li>☐ <code>PortableDeviceModule</code> com <code>TypeOrmModule.forFeature([PortableDevice])</code> e <code>exports: [TypeOrmModule]</code></li>
  <li>☐ <code>ServiceOrderModule</code> importando <code>PortableDeviceModule</code> e <code>TypeOrmModule.forFeature([ServiceOrder])</code></li>
  <li>☐ <code>ServiceOrderService</code> com dois repositórios injetados: <code>ServiceOrder</code> e <code>PortableDevice</code></li>
  <li>☐ <code>findBy</code> com <code>.map(id =&gt; ({ id }))</code> para buscar todos os dispositivos em uma query só</li>
  <li>☐ Validação manual comparando <code>devices.length</code> com <code>dto.deviceIds.length</code></li>
  <li>☐ Mensagem de erro informando quais IDs específicos não foram encontrados</li>
  <li>☐ <code>PortableDeviceModule</code> registrado no <code>AppModule</code></li>
</ul>

</body>
</html>
