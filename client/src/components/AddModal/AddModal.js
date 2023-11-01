import React, { useState } from 'react';
import { Button, DatePicker, Input, Modal, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { ADD_TODO } from '../../queries';

const AddModal = ({ updateData }) => {
    const [AddTodo] = useMutation(ADD_TODO, {
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("todo");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

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
            const { data } = await AddTodo({ variables: { title, category, date } });
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
            <div className='text-end m-4'>
                <Button type="primary" onClick={showModal}>
                    Add Task
                </Button>
            </div>
            <Modal title="Add Task" open={isModalOpen} footer={false} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div>
                        <Input required placeholder='Enter title' className='w-full' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='my-4'>
                        <Select
                            aria-required
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
export default AddModal;