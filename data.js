// Dados iniciais do estoque
const initialEstoqueData = [
    // Ingredientes
    { name: 'Pão', quantity: 100, minStock: 20, value: 1.50 },
    { name: 'Blend', quantity: 150, minStock: 30, value: 3.00 },
    { name: 'Cheddar', quantity: 200, minStock: 40, value: 0.50 },
    { name: 'Alface', quantity: 80, minStock: 15, value: 0.30 },
    { name: 'Papel Embrulho', quantity: 300, minStock: 50, value: 0.20 },
    { name: 'Embalagem Entrega', quantity: 200, minStock: 40, value: 1.00 },
    
    // Molhos
    { name: 'Bacon', quantity: 50, minStock: 10, value: 2.00 },
    { name: 'Mostarda&Mel', quantity: 50, minStock: 10, value: 2.00 },
    { name: 'Alho', quantity: 50, minStock: 10, value: 2.00 },
    { name: 'Ervas', quantity: 50, minStock: 10, value: 2.00 },
    
    // Bebidas
    { name: 'Coca-Cola Lata', quantity: 100, minStock: 20, value: 3.50 },
    { name: 'Coca-Cola 600ml', quantity: 80, minStock: 15, value: 5.00 },
    { name: 'Coca-Cola 2L', quantity: 50, minStock: 10, value: 8.00 },
    { name: 'Guaraná Lata', quantity: 100, minStock: 20, value: 3.50 },
    { name: 'Água 500ml', quantity: 120, minStock: 24, value: 2.00 },
    { name: 'SucoKids Uva 200ml', quantity: 50, minStock: 10, value: 3.50 },
    { name: 'SucoKids Maracujá 200ml', quantity: 50, minStock: 10, value: 3.50 }
];

// Inicializa o estoque se ainda não existir
if (!localStorage.getItem('estoqueItems')) {
    localStorage.setItem('estoqueItems', JSON.stringify(initialEstoqueData));
} 