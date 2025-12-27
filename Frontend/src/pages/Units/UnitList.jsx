import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import unitService from '../../services/unitsService';
import UnitForm from './UnitForm';

const { Search } = Input;
const { Option } = Select;

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    active: '',
  });

  const [formVisible, setFormVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const loadUnits = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...filters,
      };

      const response = await unitService.getAll(params);

      setUnits(response.data);
      setPagination({
        ...pagination,
        current: response.pagination.page,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error('Error al cargar unidades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await unitService.delete(id);
      message.success('Unidad eliminada exitosamente');
      loadUnits(pagination.current);
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Error al eliminar unidad'
      );
    }
  };

  const handleAdd = () => {
    setEditingUnit(null);
    setFormVisible(true);
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setEditingUnit(null);
  };

  const handleFormSuccess = () => {
    loadUnits(pagination.current);
  };

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    loadUnits(1);
  }, [filters]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Abreviación',
      dataIndex: 'abbreviation',
      key: 'abbreviation',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => {
        const typeMap = {
          weight: { text: 'Peso', color: 'green' },
          volume: { text: 'Volumen', color: 'blue' },
          length: { text: 'Longitud', color: 'orange' },
          unit: { text: 'Unidad', color: 'purple' },
          package: { text: 'Empaque', color: 'cyan' },
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Peso', value: 'weight' },
        { text: 'Volumen', value: 'volume' },
        { text: 'Longitud', value: 'length' },
        { text: 'Unidad', value: 'unit' },
        { text: 'Empaque', value: 'package' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: (active) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar esta unidad?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Unidades de Medida"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Nueva Unidad
          </Button>
        }
      >
        {/* Filtros y búsqueda */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Buscar por nombre o abreviación"
              allowClear
              onSearch={(value) =>
                setFilters({ ...filters, search: value })
              }
              onChange={(e) => {
                if (e.target.value === '') {
                  setFilters({ ...filters, search: '' });
                }
              }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={6} md={5}>
            <Select
              placeholder="Tipo"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) =>
                setFilters({ ...filters, type: value || '' })
              }
            >
              <Option value="unit">Unidad</Option>
              <Option value="package">Empaque</Option>
              <Option value="weight">Peso</Option>
              <Option value="volume">Volumen</Option>
              <Option value="length">Longitud</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} md={5}>
            <Select
              placeholder="Estado"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) =>
                setFilters({ ...filters, active: value ?? '' })
              }
            >
              <Option value="true">Activo</Option>
              <Option value="false">Inactivo</Option>
            </Select>
          </Col>
        </Row>

        {/* Tabla */}
        <Table
          columns={columns}
          dataSource={units}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} unidades`,
          }}
          onChange={(newPagination) => {
            loadUnits(newPagination.current);
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <UnitForm
        visible={formVisible}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingUnit={editingUnit}
      />
    </>
  );
};

export default UnitList;