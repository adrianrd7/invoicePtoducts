import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  Switch,
  message,
  Space,
  Card,
  Tag,
  Popconfirm,
  Input
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import productUnitService from '../../services/productUnitService';
import productService from '../../services/productService';
import unitService from '../../services/unitsService';

const { Option } = Select;
const { Search } = Input;

const ProductUnits = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productUnits, setProductUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadProductUnits();
    loadProducts();
    loadUnits();
  }, []);

  const loadProductUnits = async (page = 1, searchFilters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...filters,
        ...searchFilters
      };

      const response = await productUnitService.getAll(params);
      setProductUnits(response.data);
      setPagination({
        ...pagination,
        current: response.pagination.page,
        total: response.pagination.total
      });
    } catch (error) {
      message.error('Error al cargar configuraciones de unidades');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts({ limit: 1000, active: true });
      setProducts(response.data || []);
    } catch (error) {
      message.error('Error al cargar productos');
    }
  };

  const loadUnits = async () => {
    try {
      const response = await unitService.getAll({ limit: 100, active: true });
      setUnits(response.data || []);
    } catch (error) {
      message.error('Error al cargar unidades');
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    loadProductUnits(1, { search: value });
  };

  const handleTableChange = (newPagination) => {
    loadProductUnits(newPagination.current);
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        product_id: record.product_id,
        unit_id: record.unit_id,
        quantity: record.quantity,
        is_base_unit: record.is_base_unit,
        is_sales_unit: record.is_sales_unit,
        is_purchase_unit: record.is_purchase_unit,
        price_modifier: record.price_modifier
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        await productUnitService.update(editingId, values);
        message.success('Configuración actualizada exitosamente');
      } else {
        await productUnitService.create(values);
        message.success('Configuración creada exitosamente');
      }
      handleCloseModal();
      loadProductUnits(pagination.current);
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await productUnitService.delete(id);
      message.success('Configuración eliminada exitosamente');
      loadProductUnits(pagination.current);
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Producto',
      dataIndex: ['product', 'name'],
      key: 'product_name',
      width: '25%'
    },
    {
      title: 'Unidad',
      dataIndex: ['unit', 'name'],
      key: 'unit_name',
      render: (name, record) => (
        <Space>
          <span>{name}</span>
          <Tag color="blue">{record.unit?.abbreviation}</Tag>
        </Space>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity || 1
    },
    {
      title: 'Precio Específico',
      dataIndex: 'price_modifier',
      key: 'price_modifier',
      render: (price) => price ? `$${parseFloat(price).toFixed(2)}` : '-'
    },
    {
      title: 'Unidad Base',
      dataIndex: 'is_base_unit',
      key: 'is_base_unit',
      render: (value) => value ? (
        <Tag icon={<CheckCircleOutlined />} color="success">Sí</Tag>
      ) : (
        <Tag icon={<CloseCircleOutlined />} color="default">No</Tag>
      )
    },
    {
      title: 'Venta',
      dataIndex: 'is_sales_unit',
      key: 'is_sales_unit',
      render: (value) => value ? (
        <Tag color="green">Sí</Tag>
      ) : (
        <Tag color="default">No</Tag>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar esta configuración?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Configuración de Unidades por Producto"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Nueva Configuración
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Search
            placeholder="Buscar por producto o unidad"
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Table
          columns={columns}
          dataSource={productUnits}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingId ? 'Editar Configuración' : 'Nueva Configuración'}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            quantity: 1,
            is_base_unit: false,
            is_sales_unit: true,
            is_purchase_unit: true
          }}
        >
          <Form.Item
            name="product_id"
            label="Producto"
            rules={[{ required: true, message: 'Seleccione un producto' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar producto"
              optionFilterProp="children"
              disabled={!!editingId}
            >
              {products.map(product => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="unit_id"
            label="Unidad"
            rules={[{ required: true, message: 'Seleccione una unidad' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar unidad"
              optionFilterProp="children"
              disabled={!!editingId}
            >
              {units.map(unit => (
                <Option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.abbreviation})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Cantidad en unidad base"
            rules={[{ required: true, message: 'Ingrese la cantidad' }]}
            tooltip="Ejemplo: 1 funda = 8 bizcochos"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              placeholder="1"
            />
          </Form.Item>

          <Form.Item
            name="price_modifier"
            label="Precio específico (opcional)"
            tooltip="Si no se define, se calculará automáticamente"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              prefix="$"
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="is_base_unit"
            label="¿Es la unidad base?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="is_sales_unit"
            label="¿Se puede vender en esta unidad?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductUnits;