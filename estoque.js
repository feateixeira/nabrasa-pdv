// Verifica se o usuário está logado e suas permissões
function checkAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    return currentUser;
}

// Verifica se o usuário é admin
function isAdmin(user) {
    return user && user.role === 'admin';
}

// Carrega os itens do estoque do localStorage
function loadEstoqueItems() {
    try {
        const items = JSON.parse(localStorage.getItem('estoqueItems'));
        // Garante que o retorno seja sempre um array
        if (!Array.isArray(items)) {
            console.warn('Estoque não é um array, inicializando vazio');
            return [];
        }
        return items;
    } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        return [];
    }
}

// Salva os itens do estoque no localStorage
function saveEstoqueItems(items) {
    localStorage.setItem('estoqueItems', JSON.stringify(items));
}

// Função para categorizar os itens
function categorizeItems(items) {
    const categories = {
        ingredients: [],
        drinks: [],
        sauces: []
    };

    items.forEach(item => {
        if (['Pão', 'Blend', 'Cheddar', 'Alface', 'Papel Embrulho', 'Embalagem Entrega'].includes(item.name)) {
            categories.ingredients.push(item);
        } else if (['Bacon', 'Mostarda&Mel', 'Alho', 'Ervas'].includes(item.name)) {
            categories.sauces.push(item);
        } else {
            categories.drinks.push(item);
        }
    });

    return categories;
}

// Atualiza a lista de itens na interface
function updateEstoqueList() {
    // Verifica se estamos na página de estoque
    const ingredientsList = document.getElementById('ingredientsList');
    const drinksList = document.getElementById('drinksList');
    const saucesList = document.getElementById('saucesList');

    // Se não encontrar os elementos, provavelmente não estamos na página de estoque
    if (!ingredientsList || !drinksList || !saucesList) {
        console.log('Não estamos na página de estoque');
        return;
    }

    const currentUser = checkAuth();
    const isAdminUser = isAdmin(currentUser);
    const items = loadEstoqueItems();
    const categories = categorizeItems(items);

    // Função auxiliar para criar um item do estoque
    function createEstoqueItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'estoque-item';
        
        const minStock = item.minStock || 10;
        const lowStock = item.quantity <= minStock;
        const criticalStock = item.quantity <= (minStock / 2);
        
        itemElement.innerHTML = `
            <div class="estoque-item-info">
                <div class="estoque-item-name">${item.name}</div>
                <div class="estoque-item-quantity ${lowStock ? 'low-stock' : ''}">
                    ${item.quantity} unidades
                    <span class="min-stock-label">(Mín: ${minStock})</span>
                    ${item.value ? `<span class="value-label">R$ ${item.value.toFixed(2)}/un</span>` : ''}
                    ${lowStock ? `<div class="estoque-alert ${criticalStock ? 'critical-stock' : ''}">
                        ${criticalStock ? 'CRÍTICO!' : 'Estoque Baixo!'}</div>` : ''}
                </div>
            </div>
            ${isAdminUser ? `
                <div class="estoque-item-actions">
                    <button class="btn-edit" onclick="openEditModal('${item.name}')">Editar</button>
                </div>
            ` : ''}
        `;
        
        return itemElement;
    }

    // Atualiza a lista de ingredientes
    ingredientsList.innerHTML = '';
    categories.ingredients.forEach(item => {
        ingredientsList.appendChild(createEstoqueItem(item));
    });

    // Atualiza a lista de bebidas
    drinksList.innerHTML = '';
    categories.drinks.forEach(item => {
        drinksList.appendChild(createEstoqueItem(item));
    });

    // Atualiza a lista de molhos
    saucesList.innerHTML = '';
    categories.sauces.forEach(item => {
        saucesList.appendChild(createEstoqueItem(item));
    });
}

// Função para verificar estoque baixo
function checkLowStock() {
    const items = loadEstoqueItems();
    if (!Array.isArray(items)) return;

    const lowStockItems = items.filter(item => {
        return item.quantity <= item.minStock;
    });

    if (lowStockItems.length > 0) {
        let message = 'Itens com estoque baixo:\n\n';
        lowStockItems.forEach(item => {
            const status = item.quantity === 0 ? 'ESTOQUE ZERADO' : 'Estoque Baixo';
            message += `${item.name}: ${item.quantity} unidades (${status})\n`;
        });

        Swal.fire({
            title: 'Alerta de Estoque',
            html: message.replace(/\n/g, '<br>'),
            icon: 'warning',
            position: 'top-end',
            showConfirmButton: true,
            timer: 10000
        });
    }
}

// Iniciar verificação periódica de estoque
let lastCheckTime = 0;
const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutos em milissegundos

function startStockCheck() {
    setInterval(() => {
        const now = Date.now();
        if (now - lastCheckTime >= CHECK_INTERVAL) {
            checkLowStock();
            lastCheckTime = now;
        }
    }, 60000); // Verifica a cada minuto se já passou 30 minutos

    // Primeira verificação imediata
    checkLowStock();
    lastCheckTime = Date.now();
}

// Função para abrir o modal de edição
function openEditModal(itemName) {
    const currentUser = checkAuth();
    if (!isAdmin(currentUser)) {
        Swal.fire({
            icon: 'error',
            title: 'Acesso Negado',
            text: 'Apenas administradores podem editar itens do estoque',
            confirmButtonColor: '#ff8c42'
        });
        return;
    }
    
    const items = loadEstoqueItems();
    const item = items.find(i => i.name === itemName);
    
    if (!item) {
        console.error('Item não encontrado:', itemName);
        return;
    }
    
    // Cria o modal dinamicamente se ele não existir
    let editModal = document.getElementById('editModal');
    if (!editModal) {
        editModal = document.createElement('div');
        editModal.id = 'editModal';
        editModal.className = 'modal';
        editModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Item</h2>
                    <span class="close" onclick="closeEditModal()">&times;</span>
                </div>
                <form id="editForm" onsubmit="return handleEditSubmit(event)">
                    <input type="hidden" id="editItemName">
                    <div class="form-group">
                        <label for="editItemQuantity">Quantidade em Estoque:</label>
                        <input type="number" id="editItemQuantity" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editItemMinStock">Estoque Mínimo:</label>
                        <input type="number" id="editItemMinStock" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editItemValue">Valor Unitário (R$):</label>
                        <input type="number" id="editItemValue" min="0" step="0.01" required>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(editModal);
    }
    
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemQuantity').value = item.quantity;
    document.getElementById('editItemMinStock').value = item.minStock || 10;
    document.getElementById('editItemValue').value = item.value || 0;
    
    editModal.classList.add('active');
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.classList.remove('active');
    }
}

// Função para salvar as alterações do item
function handleEditSubmit(event) {
    event.preventDefault();
    const currentUser = checkAuth();
    
    if (!isAdmin(currentUser)) {
        Swal.fire({
            icon: 'error',
            title: 'Acesso Negado',
            text: 'Apenas administradores podem editar itens do estoque',
            confirmButtonColor: '#ff8c42'
        });
        return false;
    }
    
    const itemName = document.getElementById('editItemName').value;
    const quantity = parseInt(document.getElementById('editItemQuantity').value);
    const minStock = parseInt(document.getElementById('editItemMinStock').value);
    const value = parseFloat(document.getElementById('editItemValue').value);
    
    const items = loadEstoqueItems();
    const itemIndex = items.findIndex(i => i.name === itemName);
    
    if (itemIndex === -1) {
        console.error('Item não encontrado:', itemName);
        return false;
    }
    
    items[itemIndex] = {
        ...items[itemIndex],
        quantity,
        minStock,
        value
    };
    
    saveEstoqueItems(items);
    updateEstoqueList();
    closeEditModal();
    
    Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Item atualizado com sucesso!',
        confirmButtonColor: '#ff8c42'
    });
    
    return false;
}

// Função para atualizar o estoque após uma venda
function updateEstoqueAfterSale(items) {
    const estoqueItems = loadEstoqueItems();
    
    items.forEach(orderItem => {
        const itemName = orderItem.name;
        const quantity = orderItem.quantity;
        
        const estoqueItem = estoqueItems.find(i => i.name === itemName);
        if (estoqueItem) {
            estoqueItem.quantity = Math.max(0, estoqueItem.quantity - quantity);
        }
    });
    
    saveEstoqueItems(estoqueItems);
    updateEstoqueList();
    checkLowStock();
}

// Função para atualizar a quantidade de um item
function updateItemQuantity(itemName, quantity) {
    if (!itemName || typeof quantity !== 'number') {
        console.error('Parâmetros inválidos:', { itemName, quantity });
        return;
    }

    const items = loadEstoqueItems();
    const item = items.find(i => i.name === itemName);
    
    if (!item) {
        console.error('Item não encontrado:', itemName);
        return;
    }
    
    item.quantity = Math.max(0, item.quantity + quantity);
    saveEstoqueItems(items);
    updateEstoqueList();
    checkLowStock();
}

// Inicializa a página quando carregar
document.addEventListener('DOMContentLoaded', () => {
    updateEstoqueList();
    startStockCheck();
}); 