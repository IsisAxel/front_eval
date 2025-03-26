import { Table, Button, Modal, Input, Form, notification, Select, DatePicker } from "antd";
import { useState } from "react";
import { fetchDataPost } from "../../util/util";
import dayjs from "dayjs";


const Budget = ({ data, setData }: { data: any[]; setData: (data: any[]) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ campaign: "", startBudgetDate: null, endBudgetDate: null, minAmount: "", maxAmount: "" });

  const showEditModal = (budget: any) => {
    setCurrentBudget(budget);
    form.setFieldsValue({ amount: budget.amount });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedBudget = { ...currentBudget, amount: values.amount };

      // Gestion du status
      const statusMap: Record<string, number> = {
        Draft: 0,
        Cancelled: 1,
        Confirmed: 2,
        OnProgress: 3,
        OnHold: 4,
        Finished: 5,
        Archived: 6,
      };
      updatedBudget.status = statusMap[updatedBudget.statusName] ?? updatedBudget.status;

      const budgetForApi = {
        id: updatedBudget.id,
        title: updatedBudget.title,
        description: updatedBudget.description,
        budgetDate: new Date(updatedBudget.budgetDate).toISOString(),
        status: updatedBudget.status,
        amount: updatedBudget.amount,
        campaignId: updatedBudget.campaignId,
        updatedById: localStorage.getItem("userId"),
      };

      await fetchDataPost("http://localhost:8080/budget/update", budgetForApi);
      setData(data.map(item => (item.id === updatedBudget.id ? updatedBudget : item)));

      notification.success({
        message: "Succès",
        description: "Modification réussie",
        placement: "topRight",
      });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error has occurred",
        placement: "topRight",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchDataPost("http://localhost:8080/budget/delete", { id, deletedByID: localStorage.getItem("userId") });
      setData(data.filter(item => item.id !== id));

      notification.success({
        message: "Succès",
        description: "Suppression réussie",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error has occurred",
        placement: "topRight",
      });
    }
  };

  const filteredData = data.filter(item => {
    const budgetDate = dayjs(item.budgetDate);
    const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : null;
    const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : null;
  
    return (
      (!filters.campaign || item.campaignName.toLowerCase().includes(filters.campaign.toLowerCase())) &&
      (!filters.startBudgetDate || budgetDate.isAfter(dayjs(filters.startBudgetDate).subtract(1, "day"), "day")) &&
      (!filters.endBudgetDate || budgetDate.isBefore(dayjs(filters.endBudgetDate).add(1, "day"), "day")) &&
      (minAmount === null || parseFloat(item.amount) >= minAmount) &&
      (maxAmount === null || parseFloat(item.amount) <= maxAmount)
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
      title: "Budget Date",
      dataIndex: "budgetDate",
      key: "budgetDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Campaign",
      dataIndex: "campaignName",
      key: "campaignName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
          placeholder="Filter by campaign name"
          value={filters.campaign}
          onChange={e => setFilters({ ...filters, campaign: e.target.value })}
          style={{ width: 200 }}
        />
        <DatePicker
          placeholder="Min budget date"
          value={filters.startBudgetDate}
          onChange={date => setFilters({ ...filters, startBudgetDate: date })}
          style={{ width: 200 }}
        />
        <DatePicker
          placeholder="Max budget date"
          value={filters.endBudgetDate}
          onChange={date => setFilters({ ...filters, endBudgetDate: date })}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Min amount"
          value={filters.minAmount}
          onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
          style={{ width: 150 }}
          type="number"
        />
        <Input
          placeholder="Max amount"
          value={filters.maxAmount}
          onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
          style={{ width: 150 }}
          type="number"
        />
      </div>

      <Table dataSource={filteredData} columns={columns} rowKey="id" />

      {/* Modal d'édition */}
      <Modal
        title="Edit Budget Amount"
        open={isModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter budget amount" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Budget;
