import { Table, Button, Modal, Input, Form, notification, DatePicker } from "antd";
import { useState } from "react";
import { fetchDataPost } from "../../util/util";
import dayjs from "dayjs";

const Campaign = ({ data, setData }: { data: any[]; setData: (data: any[]) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ title: "", minRevenue: "" , maxRevenue: "" });

  const showEditModal = (campaign: any) => {
    setCurrentCampaign(campaign);
    form.setFieldsValue({ targetRevenueAmount: campaign.targetRevenueAmount });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedCampaign = { ...currentCampaign, targetRevenueAmount: values.targetRevenueAmount };

      const statusMap: Record<string, number> = {
        Draft: 0,
        Cancelled: 1,
        Confirmed: 2,
        OnProgress: 3,
        OnHold: 4,
        Finished: 5,
        Archived: 6,
      };
      updatedCampaign.status = statusMap[updatedCampaign.statusName] ?? updatedCampaign.status;

      const campaignForApi = {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        description: updatedCampaign.description,
        targetRevenueAmount: updatedCampaign.targetRevenueAmount,
        campaignDateStart: new Date(updatedCampaign.campaignDateStart).toISOString(),
        campaignDateFinish: new Date(updatedCampaign.campaignDateFinish).toISOString(),
        salesTeamId: updatedCampaign.salesTeamId,
        status: updatedCampaign.status,
        updatedById: localStorage.getItem("userId"),
      };

      await fetchDataPost("http://localhost:8080/campaign/update", campaignForApi);
      setData(data.map(item => (item.id === updatedCampaign.id ? updatedCampaign : item)));

      notification.success({
        message: "Succès",
        description: "Modification réussie",
        placement: "topRight",
      });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Une erreur s'est produite",
        placement: "topRight",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchDataPost("http://localhost:8080/campaign/delete", { id, deletedByID: localStorage.getItem("userId") });
      setData(data.filter(item => item.id !== id));

      notification.success({
        message: "Succès",
        description: "Suppression réussie",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Une erreur s'est produite",
        placement: "topRight",
      });
    }
  };

  const filteredData = data.filter(item => {
    const minRevenue = filters.minRevenue ? parseFloat(filters.minRevenue) : null;
    const maxRevenue = filters.maxRevenue ? parseFloat(filters.maxRevenue) : null;

    return (
      (!filters.title || item.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (minRevenue === null || parseFloat(item.targetRevenueAmount) >= minRevenue) &&
      (maxRevenue === null || parseFloat(item.targetRevenueAmount) <= maxRevenue)
    );
  });

  const columns = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Start Date",
      dataIndex: "campaignDateStart",
      key: "campaignDateStart",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Finish Date",
      dataIndex: "campaignDateFinish",
      key: "campaignDateFinish",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Target Revenue",
      dataIndex: "targetRevenueAmount",
      key: "targetRevenueAmount",
      render: (item: number) => item.toLocaleString('fr-FR'),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "Created At Utc",
      dataIndex: "createdAtUtc",
      key: "createdAtUtc",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Filtres */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Input
          placeholder="Filter by title"
          value={filters.title}
          onChange={e => setFilters({ ...filters, title: e.target.value })}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Min revenue"
          value={filters.minRevenue}
          onChange={e => setFilters({ ...filters, minRevenue: e.target.value })}
          style={{ width: 150 }}
          type="number"
        />
        <Input
          placeholder="Max revenue"
          value={filters.maxRevenue}
          onChange={e => setFilters({ ...filters, maxRevenue: e.target.value })}
          style={{ width: 150 }}
          type="number"
        />
      </div>

      <Table dataSource={filteredData} columns={columns} rowKey="id" />

      {/* Modal d'édition */}
      <Modal
        title="Edit Target Revenue"
        open={isModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Target Revenue Amount"
            name="targetRevenueAmount"
            rules={[{ required: true, message: "Please enter target revenue amount" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Campaign;
