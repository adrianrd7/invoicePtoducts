import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Row,
  Col,
  Alert,
} from 'antd';
import unitService from '../../services/unitsService';

const { Option } = Select;

const UnitForm = ({ visible, onClose, onSuccess, editingUnit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (editingUnit) {
        form.setFieldsValue({
          name: editingUnit.name,
          abbreviation: editingUnit.abbreviation,
          type: editingUnit.type,
          active: editingUnit.active,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingUnit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const unitData = {
        name: values.name.trim(),
        abbreviation: values.abbreviation.trim().toUpperCase(),
        type: values.type,
        active: values.active !== undefined ? values.active : true,
      };

      if (editingUnit) {
        await unitService.update(editingUnit.id, unitData);
        message.success('Unidad actualizada exitosamente');
      } else {
        await unitService.create(unitData);
        message.success('Unidad creada exitosamente');
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      if (error.errorFields) {
        message.error('Por favor complete todos los campos requeridos');
      } else {
        message.error(
          error.response?.data?.message || 'Error al guardar la unidad'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingUnit ? 'Editar Unidad' : 'Nueva Unidad'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={editingUnit ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          active: true,
          type: 'unit',
        }}
      >
        <Alert
          message="Información"
          description="Las unidades se utilizan para definir cómo se venden los productos. La conversión específica se configura en 'Configuración de Unidades por Producto'."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[
                { required: true, message: 'El nombre es requerido' },
                {
                  min: 2,
                  max: 50,
                  message: 'El nombre debe tener entre 2 y 50 caracteres',
                },
              ]}
            >
              <Input placeholder="Ej: Unidad, Funda, Caja, Docena" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Abreviación"
              name="abbreviation"
              rules={[
                { required: true, message: 'La abreviación es requerida' },
                {
                  min: 1,
                  max: 10,
                  message: 'La abreviación debe tener entre 1 y 10 caracteres',
                },
              ]}
              tooltip="Se convertirá automáticamente a mayúsculas"
            >
              <Input
                placeholder="Ej: U, FND, CJA, DOC"
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[{ required: true, message: 'El tipo es requerido' }]}
          tooltip="El tipo de unidad (solo para organización)"
        >
          <Select placeholder="Seleccione el tipo de unidad">
            <Option value="unit">
              <span style={{ fontWeight: 'bold' }}>Unidad</span> - Para contar
              elementos individuales
            </Option>
            <Option value="package">
              <span style={{ fontWeight: 'bold' }}>Empaque</span> - Para
              presentaciones (funda, caja, paquete)
            </Option>
            <Option value="weight">
              <span style={{ fontWeight: 'bold' }}>Peso</span> - Para medidas
              de masa (kg, g, lb)
            </Option>
            <Option value="volume">
              <span style={{ fontWeight: 'bold' }}>Volumen</span> - Para medidas
              de capacidad (L, ml, gal)
            </Option>
            <Option value="length">
              <span style={{ fontWeight: 'bold' }}>Longitud</span> - Para
              medidas de distancia (m, cm, in)
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Estado" name="active" valuePropName="checked">
          <Switch
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
            defaultChecked
          />
        </Form.Item>

        {/* Ejemplos según el tipo */}
        <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type}>
          {({ getFieldValue }) => {
            const type = getFieldValue('type');
            const examples = {
              unit: {
                title: 'Ejemplos de Unidades',
                items: [
                  'Unidad (u) - Para vender de 1 en 1',
                  'Docena (doc) - 12 unidades (se configura en ProductUnit)',
                  'Ciento (cto) - 100 unidades (se configura en ProductUnit)',
                ],
              },
              package: {
                title: 'Ejemplos de Empaques',
                items: [
                  'Funda (fnd) - 8 empanadas (se configura en ProductUnit)',
                  'Caja (cja) - 12 bizcochos (se configura en ProductUnit)',
                  'Paquete (pqt) - La cantidad se define por producto',
                ],
              },
              weight: {
                title: 'Ejemplos de Peso',
                items: [
                  'Kilogramo (kg)',
                  'Gramo (g)',
                  'Libra (lb)',
                  'Nota: Conversión se configura en ProductUnit',
                ],
              },
              volume: {
                title: 'Ejemplos de Volumen',
                items: [
                  'Litro (L)',
                  'Mililitro (ml)',
                  'Galón (gal)',
                  'Nota: Conversión se configura en ProductUnit',
                ],
              },
              length: {
                title: 'Ejemplos de Longitud',
                items: [
                  'Metro (m)',
                  'Centímetro (cm)',
                  'Pulgada (in)',
                  'Nota: Conversión se configura en ProductUnit',
                ],
              },
            };

            if (type && examples[type]) {
              return (
                <Alert
                  message={examples[type].title}
                  description={
                    <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                      {examples[type].items.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  }
                  type="info"
                  showIcon
                />
              );
            }
            return null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UnitForm;