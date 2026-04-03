<h1>Single Table Inheritance no TypeORM — Explicação completa</h1>

<p>Vou te guiar parte por parte, como se estivéssemos numa sessão de pair programming.</p>

<hr>

<h2>1. O problema que estamos resolvendo</h2>

<p>Antes de codar, entenda o <strong>porquê</strong>. Você tem três tipos de marca:</p>

<ul>
  <li><code>CellphoneBrand</code></li>
  <li><code>TabletBrand</code></li>
  <li><code>LaptopBrand</code></li>
</ul>

<p>E <code>PortableDevice</code> precisa de uma FK que aponte para qualquer uma delas. O banco não aceita FK polimórfica — então a solução é: <strong>as três marcas vivem na mesma tabela</strong>, diferenciadas por uma coluna <code>type</code>. O TypeORM cuida do resto.</p>

<hr>

<h2>2. O decorator <code>@TableInheritance</code></h2>

<pre><code>@Entity({ name: 'tb_device_brands' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DeviceBrand {
    ...
}
</code></pre>

<p><strong>O que ele faz:</strong> diz ao TypeORM <em>"essa entidade é uma classe pai de uma hierarquia de herança, e quero guardar tudo numa tabela só"</em>.</p>

<p>A opção <code>column</code> define a <strong>coluna discriminadora</strong> — ela é criada automaticamente pelo TypeORM na tabela. É ela quem vai guardar uma string indicando de qual subclasse aquele registro pertence. No banco vai ficar assim:</p>

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Samsung</td>
      <td>CellphoneBrand</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Dell</td>
      <td>LaptopBrand</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Apple</td>
      <td>TabletBrand</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <p><strong>Regra importante:</strong> toda a lógica de filtrar por tipo fica transparente. Quando você busca pelo repositório de <code>CellphoneBrand</code>, o TypeORM automaticamente adiciona <code>WHERE type = 'CellphoneBrand'</code> na query. Você nunca precisa fazer isso na mão.</p>
</blockquote>

<hr>

<h2>3. Os campos comuns ficam no pai</h2>

<pre><code>@Entity({ name: 'tb_device_brands' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DeviceBrand {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @OneToMany(() => PortableDevice, (device) => device.brand)
    devices: PortableDevice[];
}
</code></pre>

<p><strong>Princípio aqui:</strong> tudo que é compartilhado entre as marcas vai no pai. <code>id</code> e <code>name</code> toda marca tem. O relacionamento <code>devices</code> também é genérico o suficiente para ficar aqui.</p>

<p>Pensa assim: se amanhã você tiver que adicionar um campo <code>countryOfOrigin</code> que vale pra todo tipo de marca, você adiciona <strong>só aqui</strong> e todas as subclasses ganham automaticamente.</p>

<hr>

<h2>4. Os filhos com <code>@ChildEntity</code></h2>

<pre><code>@ChildEntity()
export class CellphoneBrand extends DeviceBrand {}

@ChildEntity()
export class TabletBrand extends DeviceBrand {}

@ChildEntity()
export class LaptopBrand extends DeviceBrand {}
</code></pre>

<p><strong>O que o <code>@ChildEntity</code> faz:</strong> registra essa classe como uma subclasse na hierarquia STI. O TypeORM vai usar o nome da classe (<code>'CellphoneBrand'</code>) como valor padrão na coluna <code>type</code>.</p>

<p>Perceba que as classes estão <strong>vazias</strong> por enquanto — e tudo bem. Elas herdam tudo do pai. A utilidade delas hoje é semântica e de tipagem. Amanhã, se <code>LaptopBrand</code> precisar de um campo <code>voltageType</code>, você adiciona só nela:</p>

<pre><code>@ChildEntity()
export class LaptopBrand extends DeviceBrand {
    @Column({ nullable: true })
    voltageType: string; // campo exclusivo de LaptopBrand
}
</code></pre>

<blockquote>
  <p>⚠️ <strong>Atenção:</strong> em STI, esse campo extra vai existir na tabela para <strong>todos</strong> os registros, só vai ser <code>NULL</code> para os outros tipos. É o trade-off da abordagem — uma tabela única, mas com alguns NULLs eventuais.</p>
</blockquote>

<hr>

<h2>5. Ajustando o <code>PortableDevice</code></h2>

<pre><code>@ManyToOne(() => DeviceBrand, (brand) => brand.devices, { onDelete: 'CASCADE' })
brand: DeviceBrand;
</code></pre>

<p><strong>Por que a arrow function aponta para <code>DeviceBrand</code> e não para <code>CellphoneBrand</code>?</strong></p>

<p>Porque no banco existe só <strong>uma tabela</strong> (<code>tb_device_brands</code>), e é para ela que a FK aponta. O TypeORM não sabe — e não precisa saber — de qual subclasse o registro vai ser na hora de criar a constraint.</p>

<p>A tipagem TypeScript <code>DeviceBrand</code> no campo <code>brand</code> também está correta: ela aceita qualquer subclasse, já que <code>CellphoneBrand extends DeviceBrand</code>.</p>

<hr>

<h2>6. Registrando no módulo</h2>

<p>Você precisa registrar <strong>todas as entidades</strong> no <code>TypeOrmModule</code>. Um erro comum de júnior é registrar só o pai e esquecer os filhos:</p>

<pre><code>TypeOrmModule.forFeature([
    DeviceBrand,
    CellphoneBrand, // não esqueça os filhos!
    TabletBrand,
    LaptopBrand,
    PortableDevice,
])
</code></pre>

<hr>

<h2>7. Criando repositórios no service</h2>

<p>Você pode injetar o repositório genérico do pai <strong>ou</strong> repositórios específicos dos filhos:</p>

<pre><code>@Injectable()
export class DeviceBrandService {
    constructor(
        // repositório do pai — busca TODOS os tipos
        @InjectRepository(DeviceBrand)
        private brandRepo: Repository&lt;DeviceBrand&gt;,

        // repositório filho — busca SÓ celulares (WHERE type = 'CellphoneBrand')
        @InjectRepository(CellphoneBrand)
        private cellphoneBrandRepo: Repository&lt;CellphoneBrand&gt;,
    ) {}

    async createCellphoneBrand(name: string) {
        const brand = this.cellphoneBrandRepo.create({ name });
        return this.cellphoneBrandRepo.save(brand);
        // INSERT INTO tb_device_brands (name, type) VALUES ('Samsung', 'CellphoneBrand')
    }

    async findAll() {
        return this.brandRepo.find();
        // SELECT * FROM tb_device_brands (retorna todos os tipos)
    }

    async findAllCellphones() {
        return this.cellphoneBrandRepo.find();
        // SELECT * FROM tb_device_brands WHERE type = 'CellphoneBrand'
    }
}
</code></pre>

<hr>

<h2>8. Verificando o tipo em runtime com <code>instanceof</code></h2>

<p>Quando você carrega um <code>PortableDevice</code> com a relação <code>brand</code>, o TypeORM já instancia o objeto com a subclasse correta:</p>

<pre><code>const device = await this.portableDeviceRepo.findOne({
    where: { id: 1 },
    relations: ['brand'],
});

// device.brand é automaticamente uma instância de CellphoneBrand, TabletBrand, etc.
if (device.brand instanceof CellphoneBrand) {
    console.log('É uma marca de celular');
}
</code></pre>

<p>Isso funciona porque o TypeORM lê a coluna <code>type</code> e instancia a classe correspondente. <strong>Você não precisa fazer esse mapeamento manualmente.</strong></p>

<hr>

<h2>Visão geral do fluxo</h2>

<pre><code>CellphoneBrand ──┐
TabletBrand  ────┼──► DeviceBrand ──► tb_device_brands (uma tabela só)
LaptopBrand  ────┘                         ▲
                                           │ FK (brand_id)
                                    PortableDevice
</code></pre>

<hr>

<h2>Checklist final</h2>

<ul>
  <li>☐ <code>@TableInheritance</code> no pai com a coluna <code>type</code></li>
  <li>☐ <code>@ChildEntity()</code> em cada filho</li>
  <li>☐ <code>@ManyToOne</code> em <code>PortableDevice</code> apontando para <code>DeviceBrand</code> (o pai)</li>
  <li>☐ Todas as entidades registradas no <code>TypeOrmModule.forFeature</code></li>
  <li>☐ Repositórios injetados com <code>@InjectRepository</code> para cada entidade que você precisar usar</li>
</ul>

</body>