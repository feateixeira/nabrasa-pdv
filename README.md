# Sistema de Pedidos Na Brasa

Sistema de pedidos para o restaurante Na Brasa, desenvolvido como aplicativo desktop usando Electron.

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (Node Package Manager)

## Instalação para Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Inicie o aplicativo em modo de desenvolvimento:
```bash
npm start
```

## Gerando o Executável

Para gerar o executável do Windows:

```bash
npm run build
```

O executável será gerado na pasta `dist`.

## Funcionalidades

- Cadastro de pedidos
- Seleção de itens e adicionais
- Impressão de pedidos
- Geração de relatório XML
- Limpeza automática dos pedidos às 23:10
- Interface responsiva

## Configuração da Impressora

O sistema está configurado para usar uma impressora térmica Epson TM-T20X com as seguintes configurações:

- Largura: 80mm
- Margens: 0mm
- Cores: Colorido
- Resolução: 203 DPI

## Suporte

Para suporte ou dúvidas, entre em contato com o desenvolvedor. 