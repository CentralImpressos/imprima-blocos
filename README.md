# Imprima Blocos

Gerador de blocos gráficos da **Imprima Cooper**, desenvolvido para criar arquivos prontos para produção de comandas, pedidos, recibos, rifas e carnês a partir de um editor visual no navegador.

O projeto foi pensado como uma ferramenta interna/operacional de pré-impressão: o usuário configura o modelo, informa os dados da empresa e do documento, ajusta tipografia, tabela, rodapé e acabamentos e exporta um **PDF vetorial** proporcional ao formato físico escolhido.

> **Objetivo principal:** transformar a configuração de um bloco gráfico em um processo padronizado, visual e reproduzível, sem depender de montar cada arte manualmente em um software de edição gráfica.

## Escopo do projeto

O gerador trabalha com cinco tipos principais de bloco:

- **Comanda** — tabela de itens, acabamento superior e preenchimento de linhas.
- **Pedido** — tabela de quantidade, descrição e observação, com acabamento superior.
- **Recibo** — modelo horizontal com canhoto destacável.
- **Rifa** — modelo horizontal com numeração, prêmio e canhoto.
- **Carnê** — modelo horizontal com parcela, vencimento, valor, cliente e canhoto.

A interface é organizada em painéis de configuração e uma área central de pré-visualização física do documento.

## Formatos

Os formatos disponíveis no sistema são:

| Formato | Dimensão |
| --- | ---: |
| 14 × 20 cm | 140 × 200 mm |
| 10 × 14 cm | 100 × 140 mm |
| 28 × 20 cm | 280 × 200 mm |
| 20 × 9 cm | 200 × 90 mm |
| 20 × 7 cm | 200 × 70 mm |
| 9 × 20 cm | 90 × 200 mm |

A disponibilidade é filtrada de acordo com o tipo de bloco. Comandas e pedidos utilizam os formatos verticais definidos para esses produtos; recibos, rifas e carnês são tratados como modelos horizontais.

## Regras de acabamento

### Comanda

- Formato vertical.
- Grampo superior.
- Serrilha horizontal abaixo da região do grampo.
- Área superior reservada para o acabamento.
- Tabela de itens com possibilidade de duas colunas.
- Opção de **Preencher altura** para gerar linhas até a área útil inferior.
- Total e rodapé permanecem posicionados dentro da margem de segurança.

### Pedido

- Formato vertical.
- Grampo superior.
- Serrilha horizontal superior.
- Tabela com **QTD / DESCRIÇÃO / OBSERVAÇÃO**.
- Opção de preenchimento automático das linhas.
- Total e rodapé respeitam a área útil inferior.

### Recibo, Rifa e Carnê

- Orientação horizontal.
- Canhoto no lado esquerdo.
- Serrilha vertical entre canhoto e corpo principal.
- Grampo na lateral esquerda.
- Proporção padrão do canhoto: 22%, ajustável na configuração.

O sistema mantém espaçamento entre o conteúdo e a linha de serrilha para evitar que textos e elementos encostem no acabamento.

## Vias

O gerador permite trabalhar com múltiplas vias quando aplicável:

- **Comanda:** 1 via por padrão.
- **Pedido:** 2 vias por padrão.
- **Recibo:** 2 vias por padrão.
- **Rifa:** 1 via por padrão.
- **Carnê:** 1 via por padrão.

As opções disponíveis são 1, 2 ou 3 vias.

## Empresa e conteúdo

Os dados da empresa são separados do conteúdo do documento e podem incluir:

- Logo.
- Razão/nome da empresa e nome fantasia.
- Endereço, número, complemento e bairro.
- Cidade/UF e CEP.
- Telefone e WhatsApp.
- E-mail.
- Instagram, Facebook e site.
- Observações e mensagem de rodapé.

O **CNPJ não participa mais do layout da ferramenta**. A estrutura interna ainda pode manter o campo por compatibilidade com documentos antigos, mas ele não é utilizado na interface ou na composição visual atual.

O conteúdo específico de cada modelo é controlado pelos campos e templates correspondentes.

## Tabelas

Comandas e pedidos possuem editor de tabela próprio.

É possível configurar:

- Colunas e respectivos títulos.
- Largura percentual das colunas.
- Alinhamento por coluna.
- Altura das linhas.
- Tamanho da fonte da tabela.
- Espessura das bordas.
- Exibição das bordas.
- Uma ou duas colunas de tabela.
- Linhas de conteúdo.
- Duplicação, exclusão e movimentação das linhas.
- Rótulo do total.
- **Preencher altura**, que adiciona linhas vazias para ocupar o espaço disponível.

Quando o preenchimento de altura está desligado, o sistema deve respeitar somente as linhas existentes, deixando o espaço restante livre para o total e demais elementos do documento.

## Tipografia

A tipografia é controlada centralmente no painel **Elementos**.

O documento permite configurar:

- Fonte do nome da empresa.
- Tamanho do nome da empresa.
- Fonte dos títulos.
- Tamanho dos títulos.
- Tamanho dos totais.
- Fonte do corpo.
- Tamanho do corpo.
- Tamanho da tabela, quando houver tabela.

O projeto possui uma seleção de fontes apropriadas para uso gráfico, incluindo famílias como Inter, Montserrat, Poppins, Lato, Open Sans, Roboto, Oswald, Playfair Display, Merriweather e outras.

As fontes selecionadas são consideradas também na geração do PDF quando disponíveis para incorporação.

## Acabamento e produção

A área de produção permite controlar parâmetros técnicos sem alterar a proporção física do documento:

- Sangria, com padrão de 2 mm.
- Margem de segurança, com padrão de 5 mm.
- Exibição da sangria.
- Exibição da margem segura.
- Marcas de corte.
- Exibição da serrilha.
- Exibição do grampo.
- Cantos externos arredondados.

A margem segura é utilizada como referência para posicionamento do conteúdo. Elementos estruturais como serrilha e grampo são tratados separadamente para que os acabamentos não ocupem indevidamente a área útil.

## Pré-visualização

A área central apresenta uma representação proporcional do formato físico escolhido.

Modos disponíveis:

- **Ajustar** — enquadra a folha na área disponível.
- **Largura** — prioriza o encaixe horizontal.
- Zoom com controles de aproximação e afastamento.

O objetivo é permitir que problemas de proporção, espaçamento, acabamento e ocupação da área útil sejam percebidos antes da exportação.

## PDF vetorial

A exportação é feita com [`pdf-lib`](https://pdf-lib.js.org/) e mantém os elementos gráficos do documento como objetos vetoriais sempre que possível.

O PDF considera:

- Dimensões físicas em milímetros.
- Sangria configurada.
- Quantidade de vias.
- Quantidade de folhas/cópias configurada na produção.
- Tipografia selecionada.
- Logo da empresa.
- Conteúdo, tabelas e acabamentos.
- Elementos de produção configurados pelo usuário.

O arquivo gerado deve ser entendido como o resultado final da composição gráfica e não como uma captura de tela da pré-visualização.

## Organização da interface

A aplicação possui uma estrutura de três áreas principais:

### Barra lateral esquerda

- Tipo de bloco.
- Configuração do formato e acabamentos.
- Projetos.

### Área central

- Pré-visualização física do bloco.
- Controles de ajuste e zoom.

### Barra lateral direita

As configurações são separadas por abas:

- **Empresa** — informações e identidade da empresa.
- **Elementos** — conteúdo e tipografia do documento.
- **Tabela** — configuração das tabelas, quando aplicável.
- **Rodapé** — informações e mensagem do rodapé.
- **Produção** — parâmetros técnicos de impressão/acabamento.
- **Resumo** — conferência e exportação.

## Arquitetura

O projeto utiliza uma arquitetura baseada em templates para separar a lógica de cada tipo de bloco da interface.

Estrutura conceitual:

```text
src/
├── components/       # Interface e editores
├── data/             # Tipos, formatos, fontes e opções padrão
├── hooks/            # Estado do estúdio
├── lib/              # Utilitários
├── pdf/              # Geração e renderização do PDF
├── routes/           # Rotas da aplicação
├── templates/        # Templates e regras de composição dos blocos
└── types/            # Tipos TypeScript do documento e layout
```

Os templates recebem um contexto de layout em milímetros e produzem elementos de documento que podem ser renderizados tanto na pré-visualização quanto na saída PDF. Isso é importante para manter a representação visual e o arquivo final alinhados.

## Tecnologias

- React 19
- TypeScript
- Vite
- TanStack Start / TanStack Router
- Tailwind CSS
- pdf-lib
- fontkit para incorporação de fontes no PDF
- Lucide React
- Zod
- ESLint
- Prettier

## Desenvolvimento local

Requisitos:

- Node.js
- npm

Instalação:

```bash
git clone https://github.com/CentralImpressos/imprima-blocos.git
cd imprima-blocos
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Executar o build em modo de desenvolvimento:

```bash
npm run build:dev
```

Pré-visualizar o build:

```bash
npm run preview
```

Verificar o código:

```bash
npm run lint
```

Formatar o projeto:

```bash
npm run format
```

## Princípios do projeto

### 1. Medidas reais primeiro

O documento é construído em milímetros. A interface apenas visualiza e manipula essa geometria; ela não deve determinar o tamanho final por pixels de tela.

### 2. Pré-visualização e PDF devem compartilhar o mesmo layout

O mesmo conjunto de elementos de composição deve alimentar a visualização e a exportação sempre que possível. Isso reduz diferenças entre o que o operador vê e o que é enviado para produção.

### 3. Acabamentos são parte da geometria

Grampo, serrilha, canhoto, sangria e margem de segurança não são apenas elementos decorativos. Eles alteram as áreas disponíveis e precisam ser considerados pelo cálculo de layout.

### 4. Conteúdo não deve escapar da área segura

Campos longos, informações de contato, rodapé, títulos e outros elementos devem se adaptar ao espaço disponível em vez de simplesmente ultrapassar a margem segura.

### 5. Templates genéricos

Os modelos devem representar produtos de uso geral. Não devem carregar dados de clientes específicos ou exemplos que pareçam fazer parte obrigatória do produto final.

### 6. Identidade separada do produto

O logo e os dados da empresa pertencem ao documento configurado pelo usuário. A ferramenta pode utilizar a identidade da Imprima Cooper na interface, mas não deve inserir a marca da Imprima Cooper automaticamente na arte do cliente.

### 7. Produção gráfica acima de efeitos de interface

A prioridade é gerar arquivos tecnicamente utilizáveis na produção gráfica: proporção correta, vetores, margens, sangria, acabamentos e posicionamento consistente.

## Próximos objetivos

A evolução do projeto deve continuar priorizando:

- Refinamento dos templates de cada produto.
- Maior controle sobre os elementos de composição.
- Persistência e gerenciamento de projetos.
- Mais modelos de blocos conforme a necessidade comercial.
- Melhorias no cálculo automático de espaço disponível.
- Validação mais rigorosa de conteúdo contra margens e acabamentos.
- Evolução das ferramentas de produção e conferência antes da exportação.

## Repositório

**CentralImpressos/imprima-blocos**  
https://github.com/CentralImpressos/imprima-blocos

---

**Imprima Cooper — Gerador de Blocos Gráficos**
