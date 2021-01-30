import { Button, Input, message, Row, Spin } from 'antd';
import Axios from 'axios';
import React, { useState } from 'react';
import { API_BASE_URL, EDIT_COMMENT_ENDPOINT } from '../service/api';
import { EditCommentRequest } from './interfaces/interface';

interface IEditCommentProps {
  editData: EditCommentRequest;
  cancelFunc: () => void;
  token: string;
  refetch?: () => void;
}

const EditComment = (props: IEditCommentProps) => {
  const { editData, cancelFunc, token, refetch } = props;
  const [inputVal, setInputVal] = useState<string>(editData.content);
  const [loading, setLoading] = useState<boolean>(false);

  const updateComment = () => {
    setLoading(true);
    editData.content = inputVal;
    Axios({
      url: `${API_BASE_URL}${EDIT_COMMENT_ENDPOINT}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: editData,
    })
      .then((res) => {
        setLoading(false);
        console.log('@EDIT_COMMENT.RES', res.data);
        message.success('Comment updated successfully ');
        refetch && refetch();
        cancelFunc();
      })
      .catch((e) => {
        setLoading(false);
        console.log('@EDIT_COMMENT.ERR', e);
        message.error('Could not update your comment at the moment');
      });
  };

  const handleInputChange = (e: any) => {
    setInputVal(e.target.value);
  };
  return (
    <Spin spinning={loading}>
      <div className="edit__comment__container">
        <Row className="edit_comment__input">
          <Input.TextArea
            defaultValue={inputVal}
            onChange={handleInputChange}
          />
        </Row>
        <Row align="middle" justify="end">
          <Button size="small" style={{ marginRight: 8 }} onClick={cancelFunc}>
            Cancel
          </Button>
          <Button
            size="small"
            type="primary"
            disabled={editData.content === inputVal}
            onClick={updateComment}
          >
            Update
          </Button>
        </Row>
      </div>
    </Spin>
  );
};

export default EditComment;
