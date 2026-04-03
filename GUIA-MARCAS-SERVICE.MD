<h1>Controllers e Services com Herança de Classes — Guia de Implementação</h1>

<p>Vamos implementar a Opção 2 juntos, passo a passo. A ideia central é simples: assim como as suas entidades já usam herança (<code>CellphoneBrand extends DeviceBrand</code>), os seus services e controllers vão espelhar essa mesma hierarquia. Quem já entendeu o STI vai se sentir em casa aqui.</p>

<hr>

<h2>Estrutura de arquivos que vamos criar</h2>

<pre><code>src/
└── device-brand/
    ├── brand-base.service.ts         ← service abstrato pai
    ├── brand-base.controller.ts      ← controller abstrato pai
    ├── cellphone-brand/
    │   ├── cellphone-brand.service.ts
    │   ├── cellphone-brand.controller.ts
    │   └── cellphone-brand.module.ts
    ├── tablet-brand/
    │   ├── tablet-brand.service.ts
    │   ├── tablet-brand.controller.ts
    │   └── tablet-brand.module.ts
    └── laptop-brand/
        ├── laptop-brand.service.ts
        ├── laptop-brand.controller.ts
        └── laptop-brand.module.ts
</code></pre>

<hr>

<h2>1. O Service base abstrato</h2>

<p>Esse é o coração de tudo. Vamos criar um service genérico que sabe fazer o CRUD básico para <strong>qualquer</strong> subclasse de <code>DeviceBrand</code>.</p>

<pre><code>// device-brand/brand-base.service.ts

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeviceBrand } from './entities/device-brand.entity';

@Injectable()
export abstract class BrandBaseService&lt;T extends DeviceBrand&gt; {

  constructor(protected repo: Repository&lt;T&gt;) {}

  findAll(): Promise&lt;T[]&gt; {
    return this.repo.find();
  }

  findOne(id: number): Promise&lt;T&gt; {
    return this.repo.findOneBy({ id } as any);
  }

  create(dto: Partial&lt;T&gt;): Promise&lt;T&gt; {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise&lt;void&gt; {
    await this.repo.delete(id);
  }
}
</code></pre>

<p>Vamos destrinchar cada detalhe dessa classe:</p>

<h3><code>abstract class</code></h3>

<p><code>abstract</code> significa que essa classe <strong>não pode ser instanciada diretamente</strong>. Você nunca vai fazer <code>new BrandBaseService()</code>. Ela existe exclusivamente para ser herdada. É um contrato: todo service filho vai ter esses métodos garantidos.</p>

<h3><code>&lt;T extends DeviceBrand&gt;</code></h3>

<p>Esse é o <strong>generic</strong>. O <code>T</code> é um tipo variável que será definido por quem herdar essa classe. O <code>extends DeviceBrand</code> é a restrição: o TypeScript só aceita tipos que sejam <code>DeviceBrand</code> ou uma subclasse dela. Se você tentar passar algo que não tem nada a ver, o compilador vai reclamar na hora.</p>

<p>Na prática: quando <code>CellphoneBrandService</code> herdar com <code>&lt;CellphoneBrand&gt;</code>, o TypeScript vai substituir todo <code>T</code> por <code>CellphoneBrand</code> — os métodos vão retornar <code>CellphoneBrand</code>, não o tipo genérico.</p>

<h3><code>protected repo: Repository&lt;T&gt;</code></h3>

<p><code>protected</code> significa que o repositório fica acessível para os filhos, mas não para quem está de fora da hierarquia. É diferente de <code>private</code> (só a classe atual enxerga) e de <code>public</code> (qualquer um enxerga). É exatamente o que você quer aqui: o <code>CellphoneBrandService</code> vai conseguir usar <code>this.repo</code> para adicionar métodos extras.</p>

<h3><code>{ id } as any</code> no <code>findOneBy</code></h3>

<p>O TypeORM exige que o objeto passado para <code>findOneBy</code> use os tipos exatos dos campos da entidade. Como <code>T</code> é genérico, o TypeScript não consegue garantir isso em tempo de compilação e reclama. O <code>as any</code> é um contorno pontual e seguro — sabemos que toda <code>DeviceBrand</code> tem <code>id</code>, então não há risco real.</p>

<hr>

<h2>2. O Controller base abstrato</h2>

<pre><code>// device-brand/brand-base.controller.ts

import { Body, Delete, Get, Param, Post } from '@nestjs/common';
import { DeviceBrand } from './entities/device-brand.entity';
import { BrandBaseService } from './brand-base.service';

export abstract class BrandBaseController&lt;T extends DeviceBrand&gt; {

  constructor(protected service: BrandBaseService&lt;T&gt;) {}

  @Get()
  findAll(): Promise&lt;T[]&gt; {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise&lt;T&gt; {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: Partial&lt;T&gt;): Promise&lt;T&gt; {
    return this.service.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise&lt;void&gt; {
    return this.service.remove(+id);
  }
}
</code></pre>

<p>Dois pontos importantes sobre o controller base:</p>

<h3>Sem <code>@Controller()</code> no pai</h3>

<p>Repare que o controller base <strong>não tem o decorator <code>@Controller()</code></strong>. Isso é intencional. O prefixo da rota (<code>'cellphone-brands'</code>, <code>'tablet-brands'</code> etc.) é responsabilidade de cada filho. Se você colocar <code>@Controller()</code> aqui, o Nest vai tentar registrar a classe abstrata como uma rota — e vai quebrar.</p>

<h3><code>+id</code> no <code>findOne</code> e <code>remove</code></h3>

<p>Parâmetros de rota chegam sempre como <code>string</code>. O <code>+id</code> é um atalho JavaScript para converter <code>"1"</code> em <code>1</code> (número). É equivalente a <code>parseInt(id, 10)</code>, só mais conciso.</p>

<hr>

<h2>3. Os filhos — CellphoneBrand</h2>

<p>Agora criamos os três filhos. Vou mostrar o de <code>CellphoneBrand</code> completo. Os outros dois são análogos.</p>

<h3>Service filho</h3>

<pre><code>// cellphone-brand/cellphone-brand.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandBaseService } from '../brand-base.service';
import { CellphoneBrand } from '../entities/device-brand.entity';

@Injectable()
export class CellphoneBrandService extends BrandBaseService&lt;CellphoneBrand&gt; {

  constructor(
    @InjectRepository(CellphoneBrand)
    repo: Repository&lt;CellphoneBrand&gt;
  ) {
    super(repo); // repassa o repositório para o service pai
  }

  // Exemplo de método exclusivo desta subclasse:
  findByCountry(country: string): Promise&lt;CellphoneBrand[]&gt; {
    return this.repo.findBy({ countryOfOrigin: country } as any);
  }
}
</code></pre>

<h3>Por que o <code>repo</code> não tem modificador de acesso aqui?</h3>

<p>No pai, o <code>repo</code> foi declarado com <code>protected</code> no construtor, o que já cria a propriedade na classe. No filho, o <code>repo</code> do construtor é apenas um <strong>parâmetro local</strong> sendo passado para o <code>super()</code> — ele não precisa de modificador porque não estamos criando uma nova propriedade, só alimentando a que já existe no pai.</p>

<h3>O <code>super(repo)</code></h3>

<p>Em toda classe que usa <code>extends</code>, o construtor filho <strong>é obrigado</strong> a chamar <code>super()</code> antes de qualquer outra coisa. Aqui, o pai precisa do repositório para funcionar, então passamos ele via <code>super(repo)</code>. É como dizer: "pai, aqui está o que você precisa para se inicializar".</p>

<h3>Controller filho</h3>

<pre><code>// cellphone-brand/cellphone-brand.controller.ts

import { Controller, Get, Param } from '@nestjs/common';
import { BrandBaseController } from '../brand-base.controller';
import { CellphoneBrand } from '../entities/device-brand.entity';
import { CellphoneBrandService } from './cellphone-brand.service';

@Controller('cellphone-brands') // aqui sim entra o @Controller com o prefixo
export class CellphoneBrandController extends BrandBaseController&lt;CellphoneBrand&gt; {

  constructor(private cellphoneService: CellphoneBrandService) {
    super(cellphoneService); // passa o service para o controller pai
  }

  // Endpoint exclusivo de celulares, que usa o método extra do service filho
  @Get('country/:country')
  findByCountry(@Param('country') country: string) {
    return this.cellphoneService.findByCountry(country);
  }
}
</code></pre>

<h3>Por que injetar <code>CellphoneBrandService</code> e não <code>BrandBaseService</code>?</h3>

<p>O pai precisa de um <code>BrandBaseService&lt;T&gt;</code> — e o <code>CellphoneBrandService</code> satisfaz isso por herança. Mas declaramos o tipo como <code>CellphoneBrandService</code> no filho para ter acesso aos métodos extras (como <code>findByCountry</code>) sem precisar de cast. Se você tipasse como <code>BrandBaseService</code>, o TypeScript não enxergaria o <code>findByCountry</code>.</p>

<h3>Module filho</h3>

<pre><code>// cellphone-brand/cellphone-brand.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellphoneBrand } from '../entities/device-brand.entity';
import { CellphoneBrandService } from './cellphone-brand.service';
import { CellphoneBrandController } from './cellphone-brand.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CellphoneBrand]) // registra o repositório desta entidade
  ],
  controllers: [CellphoneBrandController],
  providers: [CellphoneBrandService],
  exports: [CellphoneBrandService], // exporte se outros módulos precisarem usar
})
export class CellphoneBrandModule {}
</code></pre>

<p>O <code>TypeOrmModule.forFeature([CellphoneBrand])</code> é o que torna o <code>@InjectRepository(CellphoneBrand)</code> funcionar dentro deste módulo. Sem ele, o Nest não saberia de onde tirar o repositório na injeção de dependência e jogaria um erro em tempo de execução.</p>

<hr>

<h2>4. Os outros filhos — TabletBrand e LaptopBrand</h2>

<p>São análogos ao <code>CellphoneBrand</code>. Só muda o nome da classe e o prefixo da rota:</p>

<pre><code>// tablet-brand/tablet-brand.service.ts
@Injectable()
export class TabletBrandService extends BrandBaseService&lt;TabletBrand&gt; {
  constructor(
    @InjectRepository(TabletBrand)
    repo: Repository&lt;TabletBrand&gt;
  ) {
    super(repo);
  }
}

// tablet-brand/tablet-brand.controller.ts
@Controller('tablet-brands')
export class TabletBrandController extends BrandBaseController&lt;TabletBrand&gt; {
  constructor(service: TabletBrandService) {
    super(service);
  }
}

// tablet-brand/tablet-brand.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([TabletBrand])],
  controllers: [TabletBrandController],
  providers: [TabletBrandService],
  exports: [TabletBrandService],
})
export class TabletBrandModule {}
</code></pre>

<pre><code>// laptop-brand/laptop-brand.service.ts
@Injectable()
export class LaptopBrandService extends BrandBaseService&lt;LaptopBrand&gt; {
  constructor(
    @InjectRepository(LaptopBrand)
    repo: Repository&lt;LaptopBrand&gt;
  ) {
    super(repo);
  }
}

// laptop-brand/laptop-brand.controller.ts
@Controller('laptop-brands')
export class LaptopBrandController extends BrandBaseController&lt;LaptopBrand&gt; {
  constructor(service: LaptopBrandService) {
    super(service);
  }
}

// laptop-brand/laptop-brand.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([LaptopBrand])],
  controllers: [LaptopBrandController],
  providers: [LaptopBrandService],
  exports: [LaptopBrandService],
})
export class LaptopBrandModule {}
</code></pre>

<hr>

<h2>5. Registrando os módulos filhos no AppModule</h2>

<pre><code>// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config }),
    CellphoneBrandModule,
    TabletBrandModule,
    LaptopBrandModule,
    // demais módulos...
  ],
})
export class AppModule {}
</code></pre>

<p>Note que você <strong>não registra</strong> o <code>BrandBaseService</code> nem o <code>BrandBaseController</code> em lugar nenhum diretamente — eles são classes abstratas e o Nest não conseguiria instanciá-los. Quem entra nos módulos são sempre os filhos concretos.</p>

<hr>

<h2>6. Rotas geradas automaticamente</h2>

<p>Com toda essa estrutura, as seguintes rotas ficam disponíveis automaticamente, sem você ter escrito nenhum handler de forma duplicada:</p>

<pre><code>GET    /cellphone-brands
GET    /cellphone-brands/:id
POST   /cellphone-brands
DELETE /cellphone-brands/:id
GET    /cellphone-brands/country/:country  ← exclusivo do filho

GET    /tablet-brands
GET    /tablet-brands/:id
POST   /tablet-brands
DELETE /tablet-brands/:id

GET    /laptop-brands
GET    /laptop-brands/:id
POST   /laptop-brands
DELETE /laptop-brands/:id
</code></pre>

<hr>

<h2>7. Como adicionar comportamento exclusivo no futuro</h2>

<p>Esse é o momento em que a herança brilha de verdade. Se amanhã o <code>LaptopBrand</code> precisar de um endpoint para buscar por voltagem, você não toca em nada que já existe:</p>

<pre><code>// laptop-brand.service.ts
@Injectable()
export class LaptopBrandService extends BrandBaseService&lt;LaptopBrand&gt; {
  constructor(
    @InjectRepository(LaptopBrand) repo: Repository&lt;LaptopBrand&gt;
  ) {
    super(repo);
  }

  // novo método exclusivo — zero impacto nos outros services
  findByVoltage(voltage: string): Promise&lt;LaptopBrand[]&gt; {
    return this.repo.findBy({ voltageType: voltage } as any);
  }
}

// laptop-brand.controller.ts
@Controller('laptop-brands')
export class LaptopBrandController extends BrandBaseController&lt;LaptopBrand&gt; {
  constructor(private laptopService: LaptopBrandService) {
    super(laptopService);
  }

  // novo endpoint exclusivo — os outros controllers nem sabem que isso existe
  @Get('voltage/:voltage')
  findByVoltage(@Param('voltage') voltage: string) {
    return this.laptopService.findByVoltage(voltage);
  }
}
</code></pre>

<hr>

<h2>Visão geral da hierarquia</h2>

<pre><code>BrandBaseService&lt;T&gt;          BrandBaseController&lt;T&gt;
        │                               │
  ┌─────┼─────┐                   ┌─────┼─────┐
  │     │     │                   │     │     │
Cell  Tablet Laptop            Cell  Tablet Laptop
Brand Brand  Brand             Brand Brand  Brand
Service Service Service       Ctrl  Ctrl   Ctrl
</code></pre>

<hr>

<h2>Checklist final</h2>

<ul>
  <li>☐ <code>BrandBaseService&lt;T&gt;</code> criado como <code>abstract class</code> com <code>protected repo</code></li>
  <li>☐ <code>BrandBaseController&lt;T&gt;</code> criado como <code>abstract class</code> sem <code>@Controller()</code></li>
  <li>☐ Cada service filho chama <code>super(repo)</code> no construtor</li>
  <li>☐ Cada controller filho tem <code>@Controller('prefixo')</code> e chama <code>super(service)</code></li>
  <li>☐ Cada módulo filho registra sua entidade com <code>TypeOrmModule.forFeature</code></li>
  <li>☐ Todos os módulos filhos importados no <code>AppModule</code></li>
  <li>☐ Métodos e endpoints exclusivos adicionados apenas nos filhos que precisam</li>
</ul>