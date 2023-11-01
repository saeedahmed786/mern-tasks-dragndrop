import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER, SEARCH_MEMBER, UPDATE_TODO_MEMBERS } from '../../queries';
import { isAuthenticated } from '../Auth/auth';

const AddMembers = ({ updateData, item }) => {
    const [UpdateTodosMembers] = useMutation(UPDATE_TODO_MEMBERS, {
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });
    const gettingUsers = useQuery(GET_USER, {
        // variables: { member },
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });

    console.log(gettingUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [member, setMember] = useState("");
    const [loading, setLoading] = useState(false);

    const { error, data } = useQuery(SEARCH_MEMBER, {
        variables: { member },
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        // let updatedMembers;
        // if (gettingUsers?.data?.getUser[0]?.members?.length > 0 && gettingUsers?.data?.getUser[0]?.members?.includes(member)) {
        //     updatedMembers = gettingUsers?.data?.getUser[0]?.members;
        // } else {
        //     updatedMembers = gettingUsers?.data?.getUser[0]?.members?.length > 0 ? gettingUsers?.data?.getUser[0]?.members.concat(member) : [member];
        // }
        // console.log(member)
        // console.log(gettingUsers?.data?.getUser[0]?.members)
        try {
            const { data } = await UpdateTodosMembers({ variables: { member, userId: isAuthenticated().id } });
            setLoading(false);
            if (data) {
                updateData();
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
        }
    };

    const searchHandler = async (value) => {
        setMember(value);
        try {
            // const { data } = await searchMember({ variables: { member } });
            console.log('Success', data);
        } catch (error) {
            console.error('Login error:', error);
        }
    }
    console.log(isAuthenticated())

    return (
        <div>
            <div className='text-end m-4'>
                <Button type="primary" onClick={showModal}>
                    Add Member
                </Button>
            </div>
            <Modal title="Add Member" open={isModalOpen} footer={false} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div className='relative'>
                        <Input required placeholder='Enter member email' value={member} className='w-full' onChange={(e) => searchHandler(e.target.value)} />
                        {
                            member && data?.searchMember?.length > 0 &&
                            <div className='h-[200px] overflow-y-auto bg-white'>
                                <div className='absolute top-[41px] w-full'>
                                    {
                                        data?.searchMember?.filter(f => f.id !== isAuthenticated().id)?.map(d => {
                                            return (
                                                <button type='button' className='text-left px-2 my-2 bg-[#D3D3D3] w-full py-2 block' onClick={() => setMember(d.email)}>
                                                    {d.email}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className='mt-4'>
                        <button type='submit' className='w-full bg-blue-700 text-white p-2'>Submit</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default AddMembers;