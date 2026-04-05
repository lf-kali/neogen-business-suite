<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>PortableDevice Base Service — Guia de Implementação</title>
</head>
<body>

<h1>PortableDevice Base Service com Template Method Pattern — Guia de Implementação</h1>

<p>Até agora você construiu a hierarquia de marcas e modelos. Agora vamos fechar o ciclo implementando o service de <code>PortableDevice</code> — a entidade que amarra tudo. É aqui que a arquitetura que você construiu vai fazer sentido completo, porque esse service vai depender dos dois anteriores.</p>

<hr>

<h2>O que torna esse service diferente dos anteriores</h2>

<p>Os services de marca e modelo tinham um desafio cada: lidar com a herança de entidades. O <code>PortableDeviceBaseService</code> tem três:</p>

<ul>
  <li>Herança de entidades (<code>Cellphone</code>, <code>Tablet</code>, <code>Laptop</code>)</li>
  <li>Dependência do service de marca</li>
  <li>Dependência do service de modelo</li>
  <li>Dependência do service de ordem de serviço — com referência circular (<code>forwardRef</code>)</li>
</ul>

<p>Cada um desses pontos vai ser explicado no momento em que aparecer no código.</p>

<hr>

<h2>Estrutura de arquivos</h2>

<pre><code>src/
└── portable-device/
    ├── portable-device-base.service.ts    ← service abstrato pai
    ├── cellphone/
    │   ├── cellphone.service.ts
    │   ├── cellphone.controller.ts
    │   └── cellphone.module.ts
    ├── tablet/
    │   ├── tablet.service.ts
    │   ├── tablet.controller.ts
    │   └── tablet.module.ts
    └── laptop/
        ├── laptop.service.ts
        ├── laptop.controller.ts
        └── laptop.module.ts
</code></pre>

<hr>

<h2>1. Os três generics do service base</h2>

<p>Antes de ver o código completo, entenda por que esse service precisa de <strong>três</strong> generics em vez de um.</p>

<p>No service de modelo, você tinha <code>&lt;TModel, TBrand&gt;</code>. Aqui você tem:</p>

<pre><code>export abstract class PortableDeviceBaseService&lt;
    TDevice extends PortableDevice,
    TBrand extends PortableDeviceBrand,
    TModel extends PortableDeviceModel,
&gt;
</code></pre>

<p>O <code>TDevice</code> é o tipo da entidade filha (<code>Cellphone</code>, <code>Tablet</code>, <code>Laptop</code>). Sem ele, o repositório seria do tipo pai e você perderia a tipagem concreta.</p>

<p>O <code>TBrand</code> e o <code>TModel</code> existem por um motivo específico: o <code>buildEntity()</code> — que veremos adiante — recebe a marca e o modelo já resolvidos e precisa dos tipos concretos para montar a entidade sem cast. Se você usasse <code>PortableDeviceBrand</code> e <code>PortableDeviceModel</code> diretamente, o TypeScript só enxergaria os campos do pai, e os campos exclusivos de <code>CellphoneBrand</code> ou <code>CellphoneModel</code> ficariam invisíveis.</p>

<hr>

<h2>2. O construtor — quatro dependências</h2>

<pre><code>constructor(
    protected deviceRepo: Repository&lt;TDevice&gt;,
    protected brandService: BrandBaseService&lt;TBrand&gt;,
    protected modelService: ModelBaseService&lt;TModel, TBrand&gt;,
    protected serviceOrderService: ServiceOrderService,
) {}
</code></pre>

<p>Quatro dependências, cada uma com um papel:</p>

<p><strong><code>deviceRepo</code></strong>: o repositório do TypeORM para a entidade concreta. Assim como nos services anteriores, ele é <code>protected</code> para que os filhos possam usá-lo diretamente se precisarem de queries customizadas.</p>

<p><strong><code>brandService</code></strong>: o service base de marca. Note que o tipo é <code>BrandBaseService&lt;TBrand&gt;</code> — não um service filho específico. Isso significa que quando <code>CellphoneService</code> herdar com <code>TBrand = CellphoneBrand</code>, o TypeScript vai garantir que o <code>brandService</code> retorna <code>CellphoneBrand</code>, não o tipo pai genérico.</p>

<p><strong><code>modelService</code></strong>: o service base de modelo, com <code>ModelBaseService&lt;TModel, TBrand&gt;</code>. Ele precisa dos dois generics porque o service de modelo também é genérico — você precisa "fechar" os dois tipos para que o TypeScript consiga rastrear os retornos corretamente.</p>

<p><strong><code>serviceOrderService</code></strong>: esse é o único service concreto (não genérico) aqui, porque <code>ServiceOrder</code> não tem hierarquia de herança. Ele é o mesmo para qualquer tipo de dispositivo.</p>

<hr>

<h2>3. O método abstrato — buildEntity</h2>

<pre><code>protected abstract buildEntity(
    dto: CreatePortableDeviceDTO,
    brand: TBrand,
    model: TModel,
): TDevice;
</code></pre>

<p>Esse é o coração do Template Method Pattern. Vamos entender o papel de cada parâmetro:</p>

<p><strong><code>dto</code></strong>: os dados brutos que chegaram da requisição — descrição do problema, diagnóstico inicial, acessórios entregues.</p>

<p><strong><code>brand: TBrand</code></strong>: a marca já resolvida pelo <code>brandService.findByID()</code>. O tipo concreto (<code>CellphoneBrand</code>, etc.) já está garantido pelo generic.</p>

<p><strong><code>model: TModel</code></strong>: o modelo já resolvido pelo <code>modelService.findByID()</code>. Mesmo raciocínio.</p>

<p>O método é <code>abstract</code> porque o service pai não sabe qual classe concreta instanciar — ele não pode fazer <code>new Cellphone()</code>. Só o filho sabe isso. O pai define <em>quando</em> esse método é chamado; o filho define <em>o que</em> ele faz.</p>

<hr>

<h2>4. Os métodos de leitura — findAll e findByID</h2>

<pre><code>async findAll(): Promise&lt;TDevice[]&gt; {
    return this.deviceRepo.find({
        relations: ['brand', 'model', 'serviceOrder'],
    });
}

async findByID(id: number): Promise&lt;TDevice&gt; {
    const device = await this.deviceRepo.findOne({
        where: { id } as any,
        relations: ['brand', 'model', 'serviceOrder'],
    });
    if (!device) {
        throw new HttpException(
            `Device with id "${id}" not found`,
            HttpStatus.NOT_FOUND,
        );
    }
    return device;
}
</code></pre>

<p>Nada de novo aqui em relação aos services anteriores. O <code>as any</code> no <code>where</code> existe pelo mesmo motivo de sempre: o TypeScript não consegue garantir que <code>T</code> tem um campo <code>id</code> através do generic, mas você sabe que toda subclasse de <code>PortableDevice</code> tem, porque ele está declarado no pai.</p>

<p>As <code>relations</code> carregam automaticamente os objetos relacionados. Sem elas, <code>device.brand</code>, <code>device.model</code> e <code>device.serviceOrder</code> chegariam como <code>undefined</code>.</p>

<hr>

<h2>5. O método create — onde o Template Method brilha</h2>

<pre><code>async create(dto: CreatePortableDeviceDTO): Promise&lt;TDevice&gt; {
    const brand = await this.brandService.findByID(dto.brandId);
    const model = await this.modelService.findByID(dto.modelId);

    const device = this.buildEntity(dto, brand, model);

    if (dto.serviceOrderId) {
        device.serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
    }

    return this.deviceRepo.save(device);
}
</code></pre>

<p>Observe o fluxo em ordem:</p>

<p>Primeiro, resolvemos as dependências obrigatórias — marca e modelo. Se qualquer um dos IDs não existir no banco, o <code>findByID()</code> de cada service já lança o <code>HttpException</code> apropriado, então o código nem chega na linha seguinte.</p>

<p>Depois, chamamos <code>this.buildEntity()</code> passando o DTO e as entidades já resolvidas. O pai não sabe o que acontece dentro dessa chamada — ele só sabe que vai receber um <code>TDevice</code> pronto para salvar. A implementação concreta está no filho.</p>

<p>Por último, o <code>serviceOrderId</code> é opcional — um dispositivo pode entrar no sistema sem estar vinculado a uma ordem de serviço ainda, então só atribuímos se o campo vier preenchido.</p>

<hr>

<h2>6. O método update — desestruturação para separar dados de relações</h2>

<pre><code>async update(id: number, dto: UpdatePortableDeviceDTO): Promise&lt;TDevice&gt; {
    const device = await this.findByID(id);

    if (dto.brandId) {
        device.brand = await this.brandService.findByID(dto.brandId);
    }
    if (dto.modelId) {
        device.model = await this.modelService.findByID(dto.modelId);
    }
    if (dto.serviceOrderId) {
        device.serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
    }

    const { brandId, modelId, serviceOrderId, ...rest } = dto;
    Object.assign(device, rest);

    return this.deviceRepo.save(device);
}
</code></pre>

<p>O ponto mais importante aqui é a desestruturação:</p>

<pre><code>const { brandId, modelId, serviceOrderId, ...rest } = dto;
</code></pre>

<p>Isso separa os campos de ID das relações (<code>brandId</code>, <code>modelId</code>, <code>serviceOrderId</code>) dos campos escalares (<code>problemDescription</code>, <code>initialDiagnosis</code>, etc.). O <code>...rest</code> contém só os campos que podem ser passados diretamente para <code>Object.assign()</code>.</p>

<p>Por que não passar o <code>dto</code> inteiro no <code>Object.assign()</code>? Porque o <code>dto</code> tem <code>brandId: number</code>, mas a entidade espera <code>brand: PortableDeviceBrand</code>. Se você passasse o dto completo, o TypeORM tentaria salvar um número no lugar de um objeto de relação e quebraria em runtime.</p>

<hr>

<h2>7. O método delete</h2>

<pre><code>async delete(id: number): Promise&lt;DeleteResult&gt; {
    await this.findByID(id);
    return this.deviceRepo.delete(id);
}
</code></pre>

<p>Simples e direto. O <code>findByID()</code> antes do delete serve para garantir que o recurso existe antes de tentar deletar — caso contrário, o TypeORM executaria um <code>DELETE</code> sem afetar nenhuma linha e retornaria silenciosamente sem erro, o que seria um comportamento enganoso para a API.</p>

<hr>

<h2>8. O service filho — CellphoneService</h2>

<pre><code>// cellphone/cellphone.service.ts
@Injectable()
export class CellphoneService extends PortableDeviceBaseService&lt;
    Cellphone,
    CellphoneBrand,
    CellphoneModel
&gt; {
    constructor(
        @InjectRepository(Cellphone)
        repo: Repository&lt;Cellphone&gt;,

        brandService: CellPhoneBrandService,
        modelService: CellphoneModelService,

        @Inject(forwardRef(() =&gt; ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(
        dto: CreatePortableDeviceDTO,
        brand: CellphoneBrand,
        model: CellphoneModel,
    ): Cellphone {
        const device = new Cellphone();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
}
</code></pre>

<h3>Os três generics fechados</h3>

<p>Quando você escreve <code>extends PortableDeviceBaseService&lt;Cellphone, CellphoneBrand, CellphoneModel&gt;</code>, você está "fechando" os generics — substituindo os tipos variáveis pelos concretos. A partir daí, o TypeScript sabe que <code>deviceRepo</code> é <code>Repository&lt;Cellphone&gt;</code>, que <code>brandService.findByID()</code> retorna <code>CellphoneBrand</code>, e assim por diante.</p>

<h3>O forwardRef no construtor filho</h3>

<p>O <code>@Inject(forwardRef(() =&gt; ServiceOrderService))</code> existe por causa de uma referência circular: <code>ServiceOrder</code> provavelmente referencia <code>PortableDevice</code> e vice-versa. O NestJS não consegue resolver qual módulo inicializar primeiro quando há ciclo de dependência.</p>

<p>O <code>forwardRef</code> diz ao NestJS: "use uma referência adiada para esse service — resolva ele depois que ambos os módulos estiverem carregados". É uma solução oficial do NestJS para esse problema específico e não indica nenhum erro de design.</p>

<h3>O buildEntity sem cast</h3>

<p>Aqui está o payoff de toda a arquitetura. Você instancia <code>new Cellphone()</code> diretamente — sem <code>as any</code>, sem <code>as unknown as</code>. O TypeScript sabe exatamente o que é cada campo porque os tipos concretos foram passados via generics. Se você errar o nome de um campo, o compilador avisa na hora.</p>

<hr>

<h2>9. O módulo filho — CellphoneModule</h2>

<pre><code>// cellphone/cellphone.module.ts
@Module({
    imports: [
        TypeOrmModule.forFeature([Cellphone]),
        CellphoneBrandModule,
        CellphoneModelModule,
        forwardRef(() =&gt; ServiceOrderModule),
    ],
    controllers: [CellphoneController],
    providers: [CellphoneService],
    exports: [CellphoneService],
})
export class CellphoneModule {}
</code></pre>

<p>Cada <code>import</code> aqui tem um motivo:</p>

<p><strong><code>TypeOrmModule.forFeature([Cellphone])</code></strong>: registra o repositório de <code>Cellphone</code> para que o <code>@InjectRepository(Cellphone)</code> no service funcione.</p>

<p><strong><code>CellphoneBrandModule</code></strong>: precisa estar importado aqui para que o <code>CellPhoneBrandService</code> esteja disponível para injeção. Lembre-se que o módulo de marca precisa exportar o service no seu próprio <code>exports: [CellPhoneBrandService]</code>.</p>

<p><strong><code>CellphoneModelModule</code></strong>: mesmo raciocínio para o <code>CellphoneModelService</code>.</p>

<p><strong><code>forwardRef(() =&gt; ServiceOrderModule)</code></strong>: o <code>forwardRef</code> precisa aparecer tanto no módulo quanto no construtor do service quando há referência circular. É a forma de dizer ao NestJS para resolver esse módulo de forma adiada.</p>

<hr>

<h2>10. Os outros filhos — Tablet e Laptop</h2>

<pre><code>// tablet/tablet.service.ts
@Injectable()
export class TabletService extends PortableDeviceBaseService&lt;
    Tablet,
    TabletBrand,
    TabletModel
&gt; {
    constructor(
        @InjectRepository(Tablet) repo: Repository&lt;Tablet&gt;,
        brandService: TabletBrandService,
        modelService: TabletModelService,
        @Inject(forwardRef(() =&gt; ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(
        dto: CreatePortableDeviceDTO,
        brand: TabletBrand,
        model: TabletModel,
    ): Tablet {
        const device = new Tablet();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
}
</code></pre>

<pre><code>// laptop/laptop.service.ts
@Injectable()
export class LaptopService extends PortableDeviceBaseService&lt;
    Laptop,
    LaptopBrand,
    LaptopModel
&gt; {
    constructor(
        @InjectRepository(Laptop) repo: Repository&lt;Laptop&gt;,
        brandService: LaptopBrandService,
        modelService: LaptopModelService,
        @Inject(forwardRef(() =&gt; ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(
        dto: CreatePortableDeviceDTO,
        brand: LaptopBrand,
        model: LaptopModel,
    ): Laptop {
        const device = new Laptop();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
}
</code></pre>

<hr>

<h2>Visão geral da hierarquia completa</h2>

<pre><code>PortableDeviceBaseService&lt;TDevice, TBrand, TModel&gt;
         │
  ┌──────┼──────┐
  │      │      │
Cellphone Tablet Laptop
Service  Service Service
  │         │       │
  │    (cada um fecha os 3 generics com seus tipos concretos)
  │
  └─ buildEntity() instancia new Cellphone() / new Tablet() / new Laptop()
       sem nenhum cast — TypeScript 100% satisfeito
</code></pre>

<hr>

<h2>Checklist final</h2>

<ul>
  <li>☐ <code>PortableDeviceBaseService</code> criado com três generics: <code>TDevice</code>, <code>TBrand</code>, <code>TModel</code></li>
  <li>☐ Método <code>abstract buildEntity()</code> declarado no pai</li>
  <li>☐ Cada service filho fecha os três generics com os tipos concretos</li>
  <li>☐ Cada filho implementa <code>buildEntity()</code> com <code>new ConcreteClass()</code> — sem cast</li>
  <li>☐ <code>forwardRef</code> aplicado tanto no construtor do service filho quanto no módulo filho para o <code>ServiceOrderModule</code></li>
  <li>☐ Cada módulo filho importa <code>TypeOrmModule.forFeature</code>, o módulo de marca, o módulo de modelo e o <code>ServiceOrderModule</code> com <code>forwardRef</code></li>
  <li>☐ Os módulos de marca e modelo exportam seus respectivos services</li>
</ul>

</body>
</html>
