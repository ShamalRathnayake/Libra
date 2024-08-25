import { Modal } from 'antd';
import React from 'react';

const ConfirmationModal = ({
  isModelActive,
  title,
  handleConfirm,
  handleCancel,
  confirmText,
  cancelText,
  content,
  type,
}) => {
  return (
    <Modal
      open={isModelActive}
      title={title}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText={confirmText || 'OK'}
      cancelText={cancelText || 'Cancel'}
      centered
      maskClosable={false}
      okType={type || 'primary'}
    >
      {content && <p>{content}</p>}
    </Modal>
  );
};

export default ConfirmationModal;
