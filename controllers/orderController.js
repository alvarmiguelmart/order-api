const Order = require('../models/Order');

// Função para transformar os dados
const transformData = (data) => {
    return {
        orderId: data.numeroPedido,
        value: data.valorTotal,
        creationDate: data.dataCriacao,
        items: data.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
};

// Criar pedido
const createOrder = async (req, res) => {
    try {
        const transformedData = transformData(req.body);

        const orderExists = await Order.findOne({ orderId: transformedData.orderId });
        if (orderExists) {
            return res.status(400).json({ message: 'Pedido já existe' });
        }

        const order = await Order.create(transformedData);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
    }
};

// Buscar pedido por ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
    }
};

// Listar todos pedidos
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error: error.message });
    }
};

// Atualizar pedido
const updateOrder = async (req, res) => {
    try {
        const transformedData = transformData(req.body);

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            transformedData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
    }
};

// Deletar pedido
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar pedido', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrder,
    deleteOrder
};
