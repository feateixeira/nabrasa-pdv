// Variáveis globais para armazenar o pedido
let orderItems = [];
let selectedExtras = [];
let selectedBurgerButton = null;
let deliveryAdded = false;
let orderTotal = 0;
let tempBurger = null; // Armazena o hambúrguer temporariamente

// Dados das bebidas
const drinks = {
    lata: [
        { name: 'Coca-Cola Zero lata', price: 5 },
        { name: 'Coca-Cola lata', price: 5 },
        { name: 'Guaraná Zero lata', price: 5 },
        { name: 'Guaraná lata', price: 5 }
    ],
    '600ml': [
        { name: 'Coca-Cola 600ml', price: 7.5 },
        { name: 'Coca-Cola Zero 600ml', price: 7.5 },
        { name: 'Guaraná 600ml', price: 7.5 },
        { name: 'Guaraná Zero 600ml', price: 7.5 },
        { name: 'Sprit 600ml', price: 7.5 }
    ],
    '1lt': [
        { name: 'Suco Dell Vale Uva 1lt', price: 8 },
        { name: 'Suco Dell Vale Caju 1lt', price: 8 },
        { name: 'Suco Dell Vale Laranja 1lt', price: 8 }
    ],
    '2l': [
        { name: 'Coca-Cola 2l', price: 12 },
        { name: 'Guaraná 2l', price: 12 },
        { name: 'Sprit 2l', price: 12 }
    ],
    agua: [
        { name: 'Água com gás', price: 4 },
        { name: 'Água sem gás', price: 2.5 }
    ],
    suco: [
        { name: 'Maracujá 300ml', price: 7 },
        { name: 'Acerola 300ml', price: 7 },
        { name: 'Abacaxi c/ Hortelã 300ml', price: 7 },
        { name: 'Morango 300ml', price: 7 },
        { name: 'Maracujá 500ml', price: 10 },
        { name: 'Acerola 500ml', price: 10 },
        { name: 'Abacaxi c/ Hortelã 500ml', price: 10 },
        { name: 'Morango 500ml', price: 10 }
    ],
    creme: [
        { name: 'Maracujá 300ml', price: 8 },
        { name: 'Morango 300ml', price: 8 },
        { name: 'Maracujá 500ml', price: 12 },
        { name: 'Morango 500ml', price: 12 }
    ]
};

// Função para inicializar o estoque com os itens padrão
function initializeEstoque() {
    const defaultItems = [
        // Ingredientes dos hambúrgueres
        { name: 'Pão', quantity: 100 },
        { name: 'Blend', quantity: 200 },
        { name: 'Cheddar', quantity: 200 },
        { name: 'Alface', quantity: 50 },
        { name: 'Papel Embrulho', quantity: 200 },
        { name: 'Embalagem Entrega', quantity: 100 },

        // Bebidas
        { name: 'Coca-Cola Zero lata', quantity: 50 },
        { name: 'Coca-Cola lata', quantity: 50 },
        { name: 'Guaraná Zero lata', quantity: 50 },
        { name: 'Guaraná lata', quantity: 50 },
        { name: 'Coca-Cola 600ml', quantity: 50 },
        { name: 'Coca-Cola Zero 600ml', quantity: 50 },
        { name: 'Guaraná 600ml', quantity: 50 },
        { name: 'Guaraná Zero 600ml', quantity: 50 },
        { name: 'Sprit 600ml', quantity: 50 },
        { name: 'Suco Dell Vale Uva 1lt', quantity: 30 },
        { name: 'Suco Dell Vale Caju 1lt', quantity: 30 },
        { name: 'Suco Dell Vale Laranja 1lt', quantity: 30 },
        { name: 'Coca-Cola 2l', quantity: 30 },
        { name: 'Guaraná 2l', quantity: 30 },
        { name: 'Sprit 2l', quantity: 30 },
        { name: 'Água com gás', quantity: 50 },
        { name: 'Água sem gás', quantity: 50 },

        // Molhos
        { name: 'Bacon', quantity: 100 },
        { name: 'Mostarda&Mel', quantity: 100 },
        { name: 'Alho', quantity: 100 },
        { name: 'Ervas', quantity: 100 }
    ];

    // Verifica se já existem itens no estoque
    const currentItems = loadEstoqueItems();
    if (currentItems.length === 0) {
        // Se não existirem itens, inicializa com os itens padrão
        saveEstoqueItems(defaultItems);
        console.log('Estoque inicializado com os itens padrão');
    }
}

// Função para abrir o modal de molhos ao carregar a página
window.onload = function () {
    initializeEstoque();
    openSauceModal();
    setInterval(clearOldOrders, 60000); // Verifica se é 23:10 a cada minuto
    startOrderCleanupCheck(); // Inicia a verificação periódica
};

// Função para limpar a lista de itens extras
function clearAdditionalItems() {
    const additionalItemsList = document.querySelector('.additional-items-list');
    if (additionalItemsList) {
        additionalItemsList.innerHTML = ''; // Remove todos os itens extras da lista
    }
}

// Função para abrir o modal de pedidos
function openOrdersModal() {
    const modal = document.createElement('div');
    modal.id = 'ordersModal';
    modal.className = 'modal-item';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content-one">
            <span class="close" onclick="closeModal('ordersModal')">&times;</span>
            <h2>Fechamento de Caixa</h2>
            <div class="modal-buttons">
                <button class="btn btn-action download" onclick="downloadOrdersXML()">Baixar XML do Dia</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Função para fechar o modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Função para abrir o modal de molhos
function openSauceModal() {
    clearAdditionalItems(); // Limpa a lista de itens extras
    document.getElementById('sauceModal').classList.add('active');
    document.getElementById('drinksModal').classList.remove('active');
}

// Função para abrir o modal de bebidas
function openDrinksModal(drinkType) {
    const drinksModalBody = document.getElementById('drinksModalBody');
    drinksModalBody.innerHTML = '';

    if (drinks[drinkType]) {
        drinks[drinkType].forEach(drink => {
            const drinkButton = document.createElement('button');
            drinkButton.className = 'btn btn-orange m-1';
            drinkButton.textContent = `${drink.name} - R$${drink.price.toFixed(2)}`;
            drinkButton.onclick = () => addDrinkToOrder(drink.name, drink.price);
            drinksModalBody.appendChild(drinkButton);
        });
    }

    document.getElementById('sauceModal').classList.remove('active');
    document.getElementById('drinksModal').classList.add('active');
}

// Função para adicionar um item ao pedido
function addItemToOrder(name, price, quantity = 1, extras = [], obs = '') {
    const existingItem = orderItems.find(item =>
        item.name === name &&
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        item.obs === obs
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const item = { name, price, quantity, extras, obs };
        orderItems.push(item);
    }

    updateOrderSummary();
}

// Função para atualizar a quantidade de um item no pedido
function updateOrderItemQuantity(index, change) {
    if (orderItems[index]) {
        orderItems[index].quantity += change;
        if (orderItems[index].quantity <= 0) {
            orderItems.splice(index, 1);
        }
        updateOrderSummary();
    }
}

// Função para atualizar o resumo do pedido
function updateOrderSummary() {
    const orderList = document.getElementById('orderList');
    const orderTotalElement = document.getElementById('orderTotal');
    orderList.innerHTML = '';
    let total = 0;

    orderItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        let itemText = `${item.quantity}x ${item.name}`;

        // Adiciona molhos de forma mais compacta
        const sauces = item.extras.filter(extra =>
            ['Bacon', 'Mostarda&Mel', 'Alho', 'Ervas', 'Sem Molho'].some(sauce => extra.includes(sauce))
        );

        if (sauces.length > 0) {
            itemText += ` (${sauces.join('/')})`;
        }

        // Adiciona extras de forma mais compacta
        const extras = item.extras.filter(extra =>
            !['Bacon', 'Mostarda&Mel', 'Alho', 'Ervas', 'Sem Molho'].some(sauce => extra.includes(sauce))
        );

        if (extras.length > 0) {
            const cleanExtras = extras.map(extra => extra.replace(/^\d+x\s*/, ''));
            itemText += ` (Adicionais: ${cleanExtras.join('/')})`;
        }

        if (item.obs) {
            itemText += ` (${item.obs})`;
        }

        itemText += ` - R$${(item.price * item.quantity).toFixed(2)}`;
        
        // Criar container para o item e seus controles
        const itemContainer = document.createElement('div');
        itemContainer.className = 'order-item-container';
        
        // Criar div para o texto do item
        const itemTextDiv = document.createElement('div');
        itemTextDiv.className = 'order-item-text';
        itemTextDiv.textContent = itemText;
        
        // Criar div para os botões de controle
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'order-item-controls';
        
        // Botão de diminuir quantidade
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = () => updateOrderItemQuantity(index, -1);
        
        // Botão de aumentar quantidade
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => updateOrderItemQuantity(index, 1);
        
        // Adicionar botões ao container de controles
        controlsDiv.appendChild(decreaseBtn);
        controlsDiv.appendChild(increaseBtn);
        
        // Adicionar texto e controles ao container do item
        itemContainer.appendChild(itemTextDiv);
        itemContainer.appendChild(controlsDiv);
        
        // Adicionar o container à lista
        listItem.appendChild(itemContainer);
        orderList.appendChild(listItem);
        
        total += item.price * item.quantity;
    });

    // Aplica o desconto
    const discountInput = document.getElementById('discount');
    const discount = parseFloat(discountInput.value) || 0;
    total = Math.max(0, total - discount);

    // Adiciona a taxa de entrega se existir
    if (deliveryAdded) {
        total += 4.00;
    }

    // Atualiza o total na tela e na variável global
    orderTotal = total;
    orderTotalElement.textContent = `Total: R$${total.toFixed(2)}`;
}

// Função para adicionar uma bebida ao pedido
function addDrinkToOrder(name, price) {
    addItemToOrder(name, price);
    openSauceModal();
}

// Função para confirmar a seleção de molhos e itens extras
function confirmSauceSelection() {
    if (!tempBurger) return;

    const selectedSauces = [];
    let extraItemsCost = 0;

    // Coleta os molhos selecionados
    document.querySelectorAll('#sauceOptions .btn.active').forEach(button => {
        selectedSauces.push(button.textContent);
    });

    // Calcula o custo dos itens extras
    for (const key in selectedExtras) {
        const item = selectedExtras[key];
        extraItemsCost += item.price * item.quantity;
    }

    const burgerObs = document.getElementById('burgerObs').value;
    tempBurger.obs = burgerObs;

    const maxFreeSauces = tempBurger.maxFreeSauces || (tempBurger.price >= 28 ? 2 : 1);
    const extraSauces = Math.max(selectedSauces.length - maxFreeSauces, 0);
    const extraSauceCost = extraSauces * 2;

    // Separa molhos e adicionais
    tempBurger.extras = [
        ...selectedSauces, // Adiciona os molhos primeiro
        ...Object.values(selectedExtras).map(item => item.name) // Adiciona apenas o nome dos adicionais
    ];

    tempBurger.price += extraSauceCost + extraItemsCost;
    addItemToOrder(tempBurger.name, tempBurger.price, tempBurger.quantity, tempBurger.extras, tempBurger.obs);

    tempBurger = null;
    selectedExtras = {};

    if (selectedBurgerButton) {
        selectedBurgerButton.classList.remove('selected');
        selectedBurgerButton = null;
    }

    resetSelection();
}

// Função para alternar a seleção de molhos
function toggleSauceSelection(button, sauceName) {
    const maxFreeSauces = tempBurger ? (tempBurger.maxFreeSauces || (tempBurger.price >= 28 ? 2 : 1)) : 1;
    const selectedSauces = document.querySelectorAll('#sauceOptions .btn.active').length;

    if (button.classList.contains('active')) {
        button.classList.remove('active');
    } else {
        button.classList.add('active');

        if (selectedSauces > maxFreeSauces) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'info',
                title: `Molho adicional: R$2,00`,
                background: '#ff8c42',
                color: '#fff'
            });
        }
    }
}

// Função para resetar a seleção de molhos e itens extras
function resetSelection() {
    document.querySelectorAll('#sauceOptions .btn.active').forEach(button => {
        button.classList.remove('active');
    });

    document.querySelectorAll('.additional-items .btn.active').forEach(button => {
        button.classList.remove('active');
    });

    selectedExtras = {};
    updateSelectedExtrasDisplay();
    document.getElementById('burgerObs').value = '';
}

// Função para adicionar itens extras
function addAdditionalItem(button, name, price) {
    button.classList.toggle('active');

    if (selectedExtras[name]) {
        selectedExtras[name].quantity++;
    } else {
        selectedExtras[name] = { name, price, quantity: 1 };
    }

    updateSelectedExtrasDisplay();
}

// Função para atualizar a exibição dos itens extras selecionados
function updateSelectedExtrasDisplay() {
    const additionalItemsList = document.querySelector('.additional-items-list');
    additionalItemsList.innerHTML = '';

    for (const key in selectedExtras) {
        const item = selectedExtras[key];
        const itemElement = document.createElement('div');
        itemElement.className = 'selected-extra-item';
        itemElement.textContent = `${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}`;
        additionalItemsList.appendChild(itemElement);
    }
}

// Função para adicionar um hambúrguer temporariamente
function addBurgerToOrder(name, price, button) {
    document.querySelectorAll('.menu-buttons .btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    button.classList.add('selected');
    selectedBurgerButton = button;

    if (name === 'Na Brasa Nuttela' || name === 'Na Brasa Doce Leite' || name === 'Na Brasa Suino') {
        const item = { name, price, quantity: 1, extras: [], obs: '' };
        addItemToOrder(item.name, item.price, item.quantity, item.extras, item.obs);
        tempBurger = null;
        if (selectedBurgerButton) {
            selectedBurgerButton.classList.remove('selected');
            selectedBurgerButton = null;
        }
    } else if (name.includes('Frango no Pote')) {
        tempBurger = { name, price, quantity: 1, extras: [], obs: '', maxFreeSauces: 2 };
        openSauceModal();
    } else if (name.includes('Frango')) {
        const maxFreeSauces = name.includes('Triplo') ? 2 : 1;
        tempBurger = { name, price, quantity: 1, extras: [], obs: '', maxFreeSauces };
        openSauceModal();
    } else {
        tempBurger = { name, price, quantity: 1, extras: [], obs: '' };
        openSauceModal();
    }
}

// Função para salvar o pedido no localStorage
function saveOrderToLocalStorage(order) {
    // Recupera os pedidos salvos ou inicializa um array vazio
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Adiciona o novo pedido ao array
    savedOrders.push(order);

    // Salva o array atualizado no localStorage
    localStorage.setItem('orders', JSON.stringify(savedOrders));
}

// Função para excluir pedidos do dia anterior às 23:10
function clearOldOrders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour === 23 && currentMinute === 10) {
        localStorage.removeItem('orders');
    }
}

// Função para exibir os pedidos do dia
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    savedOrders.forEach((order, index) => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';

        const burgers = order.items.filter(item => item.name.includes('Hambúrguer'));
        const fries = order.items.filter(item => item.name.includes('Batata'));
        const drinks = order.items.filter(item => item.name.includes('Bebida'));

        const orderDetails = `
            <h3>Pedido ${index + 1}</h3>
            <p><strong>Data:</strong> ${order.date} ${order.time}</p>
            <p><strong>Endereço:</strong> ${order.address}</p>
            <p><strong>Complemento:</strong> ${order.complement}</p>
            <p><strong>Método de Pagamento:</strong> ${order.paymentMethod}</p>
            <p><strong>Observações:</strong> ${order.obs}</p>
            <p><strong>Hambúrgueres:</strong></p>
            <ul>
                ${burgers.map(item => `<li>${item.quantity}x ${item.name} - R$${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Batatas:</strong></p>
            <ul>
                ${fries.map(item => `<li>${item.quantity}x ${item.name} - R$${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Bebidas:</strong></p>
            <ul>
                ${drinks.map(item => `<li>${item.quantity}x ${item.name} - R$${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Total:</strong> R$${order.total.toFixed(2)}</p>
        `;

        orderElement.innerHTML = orderDetails;
        ordersList.appendChild(orderElement);
    });
}

// Função para adicionar a taxa de entrega
function addExtraCharge() {
    // Verifica se já tem entrega adicionada
    if (deliveryAdded) {
        return; // Se já tem entrega, não faz nada
    }

    // Adiciona R$ 4,00 ao valor total
    const entregaValue = 4.00;
    orderTotal += entregaValue;

    // Atualiza o total do pedido
    const orderTotalElement = document.getElementById('orderTotal');
    if (orderTotalElement) {
        orderTotalElement.textContent = `Total: R$${orderTotal.toFixed(2)}`;
    }

    // Desabilita o botão para evitar múltiplas adições
    const addChargeButton = document.getElementById('addChargeButton');
    if (addChargeButton) {
        addChargeButton.disabled = true;
        addChargeButton.textContent = 'Entrega Adicionada';
        addChargeButton.style.backgroundColor = '#28a745';
    }

    // Adiciona indicador visual da entrega
    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary) {
        const deliveryIndicator = document.createElement('div');
        deliveryIndicator.className = 'delivery-added';
        deliveryIndicator.textContent = `Taxa de Entrega add: R$${entregaValue.toFixed(2)}`;
        
        // Insere antes do total
        const orderTotal = orderSummary.querySelector('#orderTotal');
        if (orderTotal) {
            orderTotal.parentNode.insertBefore(deliveryIndicator, orderTotal);
        } else {
            orderSummary.appendChild(deliveryIndicator);
        }
    }

    // Marca que a taxa de entrega foi adicionada
    deliveryAdded = true;
}

// Função para imprimir o pedido e salvar no localStorage
function printOrder() {
    const addressElem = document.getElementById("address");
    const addressInput = addressElem ? addressElem.value.trim() : "";

    const paymentMethodElem = document.getElementById("paymentMethod");
    const paymentMethod = paymentMethodElem ? paymentMethodElem.value : "Não especificado";

    const obsElem = document.getElementById("obs");
    const obs = obsElem ? obsElem.value.trim() : "";

    const complementElem = document.getElementById("complement");
    const complement = complementElem ? complementElem.value.trim() : "";

    const paymentObservationsElem = document.getElementById("paymentObservations");
    const paymentObservations = paymentObservationsElem ? paymentObservationsElem.value.trim() : "";

    const discountElem = document.getElementById("discount");
    const discount = discountElem ? parseFloat(discountElem.value) || 0 : 0;
    discountElem.value = ""; // Limpa o campo de desconto imediatamente após capturar o valor

    if (!addressInput) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'Preencha o nome/endereço',
            background: '#ff8c42',
            color: '#fff'
        });
        return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR");
    const formattedTime = currentDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

    // Cria o objeto do pedido
    const order = {
        date: formattedDate,
        time: formattedTime,
        items: orderItems,
        total: orderTotal,
        address: addressInput,
        paymentMethod: paymentMethod,
        paymentObservations: paymentObservations,
        obs: obs,
        complement: complement,
        discount: discount
    };

    // Salva o pedido no localStorage
    saveOrderToLocalStorage(order);

    // Atualiza o estoque
    updateEstoqueAfterSale(orderItems);

    // Gera o conteúdo para impressão
    const img = "<img src='./assets/Brasa.png'>";
    const complementText = complement ? `(${complement})` : '';
    const paymentObservationsText = paymentObservations ? `${paymentObservations}` : '';
    const discountText = discount > 0 ? `Desconto: R$${discount.toFixed(2)}` : '';

    // Cria uma lista limpa dos itens (sem os botões de controle)
    const cleanOrderList = orderItems.map(item => {
        let itemText = `${item.quantity}x ${item.name}`;

        // Separa molhos e adicionais
        const sauces = item.extras.filter(extra =>
            ['Bacon', 'Mostarda&Mel', 'Alho', 'Ervas', 'Sem Molho'].some(sauce => 
                extra === sauce
            )
        );

        const additionals = item.extras.filter(extra =>
            !['Bacon', 'Mostarda&Mel', 'Alho', 'Ervas', 'Sem Molho'].some(sauce => 
                extra === sauce
            )
        );

        // Adiciona os molhos
        if (sauces.length > 0) {
            itemText += ` (Molho: ${sauces.join('/')})`;
        }

        // Adiciona os adicionais
        if (additionals.length > 0) {
            itemText += ` (Adicionais: ${additionals.join('/')})`;
        }

        if (item.obs) {
            itemText += ` (Obs: ${item.obs})`;
        }

        itemText += ` - R$${(item.price * item.quantity).toFixed(2)}`;
        return `<li>${itemText}</li>`;
    }).join('');

    // Calcula o subtotal (total sem a taxa de entrega)
    const subtotal = deliveryAdded ? orderTotal - 4.00 : orderTotal;

    const printableOrder = document.getElementById("printableOrder");
    if (printableOrder) {
        printableOrder.innerHTML = `
            <h3>${formattedDate} - ${formattedTime}</h3>
            <h2>${addressInput}</h2>
            <h2 class="comp">${complementText}</h2>
            <ul>${cleanOrderList}</ul>
            ${obs ? `<ul>${obs}</ul>` : ''}
            ${discountText ? `<p>${discountText}</p>` : ''}
            <p>Subtotal: R$${subtotal.toFixed(2)}</p>
            ${deliveryAdded ? `<p>delivery: R$4,00</p>` : ''}
            <p>Total: R$${orderTotal.toFixed(2)} <br> <br> (${paymentMethod})</p>
            ${paymentObservationsText ? `<h5>${paymentObservationsText}</h5>` : ''}
            <h4>OBRIGADO PELA PREFERÊNCIA!</h4>
            <div class="img-nabrasa">${img}</div>
        `;

        printableOrder.style.display = "block";
        
        // Usa o IPC do Electron para impressão
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('print-order');
        } else {
            window.print();
        }
        
        printableOrder.style.display = "none";
    }

    // Limpa o pedido após a impressão
    clearOrder();
}

// Função para verificar e limpar pedidos antigos
function checkAndClearOldOrders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Verifica se é 23:10:00
    if (currentHour === 23 && currentMinute === 10 && currentSecond === 0) {
        // Faz o download do XML antes de limpar
        downloadOrdersXML();
        
        // Limpa os pedidos do localStorage
        localStorage.removeItem('orders');
        
        // Notifica o usuário
        Swal.fire({
            icon: 'info',
            title: 'Pedidos do dia salvos',
            text: 'Os pedidos do dia foram salvos em XML e o sistema foi limpo para o próximo dia.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff8c42',
        });
    }
}

// Função para iniciar a verificação periódica
function startOrderCleanupCheck() {
    // Verifica a cada segundo
    setInterval(checkAndClearOldOrders, 1000);
}

// Função para baixar os pedidos em formato XML
function downloadOrdersXML() {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Cria o conteúdo XML
    const xmlString = `
        <pedidos>
            ${savedOrders.map(order => `
                <pedido>
                    <data>${order.date} ${order.time}</data>
                    <endereco>${order.address}</endereco>
                    <complemento>${order.complement}</complemento>
                    <metodoPagamento>${order.paymentMethod}</metodoPagamento>
                    <observacoes>${order.obs}</observacoes>
                    <itens>
                        ${order.items.map(item => `
                            <item>
                                <nome>${item.name}</nome>
                                <quantidade>${item.quantity}</quantidade>
                                <preco>${item.price.toFixed(2)}</preco>
                            </item>
                        `).join('')}
                    </itens>
                    <total>${order.total.toFixed(2)}</total>
                </pedido>
            `).join('')}
        </pedidos>
    `;

    // Cria um Blob com o conteúdo XML
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    // Usa o IPC do Electron para download
    if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('download-file', {
            url: url,
            filename: 'pedidos_do_dia.xml'
        });
    } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pedidos_do_dia.xml';
        a.click();
    }

    // Libera o objeto URL
    URL.revokeObjectURL(url);

    // Fecha o modal após o download
    closeModal('ordersModal');
}

// Função para limpar o pedido e os inputs
function clearOrder() {
    orderItems = [];
    orderTotal = 0;
    deliveryAdded = false; // Reseta a variável global de entrega

    // Limpa os inputs
    const elements = {
        orderList: document.getElementById("orderList"),
        orderTotal: document.getElementById("orderTotal"),
        address: document.getElementById("address"),
        obs: document.getElementById("obs"),
        paymentObservations: document.getElementById("paymentObservations"),
        complement: document.getElementById("complement"),
        paymentMethod: document.getElementById("paymentMethod"),
        discount: document.getElementById("discount")
    };

    // Limpa cada elemento se ele existir
    if (elements.orderList) elements.orderList.innerHTML = "";
    if (elements.orderTotal) elements.orderTotal.innerText = "Total: R$0,00";
    if (elements.address) elements.address.value = "";
    if (elements.obs) elements.obs.value = "";
    if (elements.paymentObservations) elements.paymentObservations.value = "";
    if (elements.complement) elements.complement.value = "";
    if (elements.paymentMethod) elements.paymentMethod.value = "Pix";
    if (elements.discount) elements.discount.value = "";
    
    // Remove o indicador de entrega se existir
    const deliveryIndicator = document.querySelector('.delivery-added');
    if (deliveryIndicator) {
        deliveryIndicator.remove();
    }
    
    // Reseta o botão de entrega completamente
    const addChargeButton = document.getElementById("addChargeButton");
    if (addChargeButton) {
        // Reseta completamente o botão
        addChargeButton.disabled = false;
        addChargeButton.textContent = 'Adicionar Entrega';
        addChargeButton.style.backgroundColor = '#ff8c42';
        addChargeButton.style.color = 'white';
        addChargeButton.style.borderColor = '#ff8c42';
        addChargeButton.style.cursor = 'pointer';
        
        // Remove todos os event listeners e adiciona um novo
        const newButton = addChargeButton.cloneNode(true);
        addChargeButton.parentNode.replaceChild(newButton, addChargeButton);
        newButton.addEventListener('click', addExtraCharge);
    }

    // Atualiza o resumo do pedido
    updateOrderSummary();
}

// Funções de estoque
function loadEstoqueItems() {
    return JSON.parse(localStorage.getItem('estoqueItems')) || [];
}

function saveEstoqueItems(items) {
    localStorage.setItem('estoqueItems', JSON.stringify(items));
}

function updateItemQuantity(items, itemName, quantity) {
    // Garante que items seja um array válido
    if (!Array.isArray(items) || items.length === 0) {
        console.error('Items inválidos:', items);
        return;
    }

    // Garante que itemName seja uma string válida
    if (!itemName || typeof itemName !== 'string') {
        console.error('Nome do item inválido:', itemName);
        return;
    }

    // Garante que quantity seja um número válido
    quantity = Number(quantity);
    if (isNaN(quantity)) {
        console.error('Quantidade inválida:', quantity);
        return;
    }

    // Procura o item de forma mais robusta
    const item = items.find(i => i && typeof i === 'object' && i.name && 
        i.name.toLowerCase() === itemName.toLowerCase());

    if (item) {
        const newQuantity = Math.max(0, item.quantity - quantity);
        item.quantity = newQuantity;
    } else {
        console.warn(`Item não encontrado no estoque: ${itemName}`);
    }
}

function updateEstoqueAfterSale(items) {
    const estoqueItems = loadEstoqueItems();
    
    items.forEach(item => {
        // Regras para subtrair itens do estoque baseado no pedido
        if (item.name.includes('Na Brasa')) {
            // Subtrai ingredientes do hambúrguer
            const numBlends = item.name.includes('Duplo') ? 2 : 
                            item.name.includes('Triplo') ? 3 : 1;
            
            // Atualiza quantidade de pães
            updateItemQuantity(estoqueItems, 'Pão', 1 * item.quantity);
            // Atualiza quantidade de blend
            updateItemQuantity(estoqueItems, 'Blend', numBlends * item.quantity);
            // Atualiza quantidade de cheddar
            updateItemQuantity(estoqueItems, 'Cheddar', numBlends * item.quantity);
            // Atualiza quantidade de alface
            updateItemQuantity(estoqueItems, 'Alface', 0.33 * item.quantity);
            // Atualiza quantidade de papel para embrulho
            updateItemQuantity(estoqueItems, 'Papel Embrulho', 1 * item.quantity);
        }
        
        // Verifica se é uma bebida
        if (item.name.includes('Água') || item.name.includes('Coca-Cola') || 
            item.name.includes('Guaraná') || item.name.includes('Suco')) {
            updateItemQuantity(estoqueItems, item.name, item.quantity);
        }
    });
    
    // Se tiver entrega, subtrai uma embalagem
    if (document.querySelector('.delivery-added')) {
        updateItemQuantity(estoqueItems, 'Embalagem Entrega', 1);
    }
    
    saveEstoqueItems(estoqueItems);
}

function updateTotal() {
    let total = 0;
    
    // Calcula o total dos itens
    orderItems.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // Aplica o desconto
    const discountInput = document.getElementById('discount');
    const discount = parseFloat(discountInput.value) || 0;
    
    // Subtrai o desconto do total
    total = Math.max(0, total - discount);
    
    // Atualiza o total na tela
    document.getElementById('orderTotal').textContent = `Total: R$${total.toFixed(2)}`;
    
    // Atualiza a variável global orderTotal
    orderTotal = total;
}

function renderOrderItem(name, price, quantity) {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.dataset.price = price;
    li.dataset.quantity = quantity;
    
    li.innerHTML = `
        <div class="order-item-info">
            <span>${name}</span>
            <span class="order-item-price">R$${(price * quantity).toFixed(2)}</span>
        </div>
        <div class="order-item-controls">
            <div class="order-item-quantity">
                <button class="btn-quantity" onclick="decreaseQuantity(this)">-</button>
                <span>${quantity}</span>
                <button class="btn-quantity" onclick="increaseQuantity(this)">+</button>
            </div>
            <button class="btn-remove" onclick="removeItem(this)">×</button>
        </div>
    `;
    
    return li;
}
