import React from 'react';
import { Upload, Button, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchDataPost } from '../../util/util';

const UploadFile = () => {
    const handleSubmit = async (values: any) => {
        const formData = new FormData();

        // Vérification et ajout du fichier à formData
        if (values.uploadFile && values.uploadFile[0]) {
            formData.append('file', values.uploadFile[0].originFileObj);
        }

        try {
            const response = await fetchDataPost('http://localhost:8080/campaign/duplicate', formData);
            console.log('Réponse du serveur:', response);
            message.success('Fichier téléchargé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du fichier:', error);
            message.error('Échec de l\'upload');
        }
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item
                name="uploadFile"
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => e?.fileList || []}
                rules={[
                    {
                        required: true,
                        message: 'Veuillez télécharger un fichier',
                    },
                ]}
            >
                <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}  // Empêche l'upload direct via le composant AntD
                >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UploadFile;
