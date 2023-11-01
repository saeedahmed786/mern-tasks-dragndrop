import React, { useState } from 'react';
import { DatePicker, Input, Modal, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_TODO } from '../../queries';
import { EditOutlined } from '@ant-design/icons';

const EditModal = ({ updateData, data }) => {
    let ID = data.id
    const [updateTodo] = useMutation(UPDATE_TODO, {
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState(data?.title);
    const [category, setCategory] = useState(data?.category);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const { data } = await updateTodo({ variables: { id: ID, title, category, date } });
            console.log('Success', data);
            updateData();
            setLoading(false);
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
        }
    };


    return (
        <div>
            <div className='text-end mt-[-5px]'>
                <EditOutlined onClick={showModal} />
            </div>
            <Modal title="Edit Task" open={isModalOpen} footer={false} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div>
                        <Input placeholder='Enter title' value={title} className='w-full' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='my-4'>
                        <Select
                            defaultValue="todo"
                            style={{
                                width: "100%",
                            }}
                            onChange={(val) => setCategory(val)}
                            options={[
                                {
                                    value: 'todo',
                                    label: 'Todo',
                                },
                                {
                                    value: 'doing',
                                    label: 'Doing',
                                },
                                {
                                    value: 'done',
                                    label: 'Done',
                                },
                            ]}
                        />
                    </div>
                    <div className='my-4'>
                        <DatePicker className='w-full' aria-required onChange={(a, b) => setDate(b)} />
                    </div>
                    <div>
                        <button type='submit' className='w-full bg-blue-700 text-white p-2'>Submit</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default EditModal;