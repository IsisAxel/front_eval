import { Table, Button, Modal, Input, Form, notification } from "antd";
import { useState } from "react";
import { fetchDataPost } from "../../util/util";

const Campaign = ({ data, setData }: { data: any[], setData: (data: any[]) => void }) => {
  console.log(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [form] = Form.useForm();

  const showEditModal = (campaign : any) => {
    setCurrentCampaign(campaign);
    form.setFieldsValue({ targetRevenueAmount: campaign.targetRevenueAmount });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedCampaign : any = { ...(currentCampaign || {}), targetRevenueAmount: values.targetRevenueAmount };
      if (updatedCampaign.statusName === "Draft") {
        updatedCampaign.status = 0;
      } else if(updatedCampaign.statusName === "Cancelled"){
        updatedCampaign.status = 1;
      } else if(updatedCampaign.statusName === "Confirmed"){
        updatedCampaign.status = 2;
      }else if(updatedCampaign.statusName === "OnProgress"){
        updatedCampaign.status = 3;
      }else if(updatedCampaign.statusName === "OnHold"){
        updatedCampaign.status = 4;
      }else if(updatedCampaign.statusName === "Finished"){
        updatedCampaign.status = 5;
      }else if(updatedCampaign.statusName === "Archived"){
        updatedCampaign.status = 6;
      }
      const campaignForApi = {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        description: updatedCampaign.description,
        targetRevenueAmount: updatedCampaign.targetRevenueAmount,
        campaignDateStart: new Date(updatedCampaign.campaignDateStart).toISOString(), // Convertit en format ISO string
        campaignDateFinish: new Date(updatedCampaign.campaignDateFinish).toISOString(), // Convertit en format ISO string
        salesTeamId: updatedCampaign.salesTeamId,
        status: updatedCampaign.status, // ou une valeur par défaut si 'status' est null
        updatedById: localStorage.getItem('userId'), // Exemple d'une valeur que vous pourriez passer
      };
      fetchDataPost("http://localhost:8080/campaign/update",campaignForApi)
      .then(() => {
        setData(data.map(item => (item.id === updatedCampaign.id ? updatedCampaign : item)));
        notification.success({
          message: "Succès",
          description: "Modification réussie",
          placement: "topRight",
        });
      }).catch(() => {
        notification.error({
          message: "Error",
          description: "An error has occured",
          placement: "topRight",
        });
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update campaign", error);
    }
  };

  const handleDelete = (id : any) => {
    fetchDataPost("http://localhost:8080/campaign/delete",{id , deletedByID: localStorage.getItem('userId')})
    .then(() => {
      setData(data.filter(item => item.id !== id));
      notification.success({
        message: "Succès",
        description: "Modification réussie",
        placement: "topRight",
      });
    }).catch(() => {
      notification.error({
        message: "Error",
        description: "An error has occured",
        placement: "topRight",
      });
    });
  };

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
      render: (date : string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Finish Date",
      dataIndex: "campaignDateFinish",
      key: "campaignDateFinish",
      render: (date : string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Target Revenue",
      dataIndex: "targetRevenueAmount",
      key: "targetRevenueAmount",
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
      render: (date : string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_ : any, record : any) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} rowKey="id" />
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