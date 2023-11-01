import React, { useState } from 'react';
import { Button, DatePicker, Input, Modal, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_TODO_COMMENTS } from '../../queries';
import TextArea from 'antd/lib/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';

const AddComments = ({ updateData, item }) => {
    const [updateTodoComments] = useMutation(UPDATE_TODO_COMMENTS, {
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let updatedComments = item?.comments?.length > 0 ? item?.comments.concat(comments) : [comments];
        try {
            const { data } = await updateTodoComments({ variables: { id: item.id, comments: updatedComments } });
            setLoading(false);
            if (data) {
                updateData();
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
        }
    };


    return (
        <div>
            <div className='mt-[-6px]'>
                <PlusOutlined onClick={showModal} />
            </div>
            <Modal title="Add Comment" open={isModalOpen} footer={false} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div>
                        <TextArea required placeholder='Enter comments' className='w-full' onChange={(e) => setComments(e.target.value)} />
                    </div>
                    <div className='mt-4'>
                        <button type='submit' className='w-full bg-blue-700 text-white p-2'>Submit</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default AddComments;