import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import EditModal from "../EditModal/EditModal";
import { useMutation } from '@apollo/client';
import { DELETE_TODO } from "../../queries";
import { Error } from "../Messages/messages";
import moment from "moment";
import AddComments from "../AddComments/AddComments";

const Card = ({ item, updateData }) => {
    const [deleteTodo] = useMutation(DELETE_TODO, {
        context: {
            headers: {
                authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
            },
        }
    });

    const deleteFunction = async (id) => {
        const { data } = await deleteTodo({ variables: { id } });
        if (data) {
            updateData();
        } else {
            Error("Error in deleting")
        }
    }
    console.log(item);
    return (
        <div className="w-full cursor-pointer">
            <main className="py-7 px-5 shadow-lg rounded-[12px] w-full bg-white max-w-[300px]">
                <div className="flex justify-between gap-5 items-start">
                    <div>
                        <h1 className="text-[14px]">{item?.title}</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                        <AddComments updateData={updateData} item={item} />
                        <EditModal updateData={updateData} data={item} />
                        <DeleteOutlined onClick={() => deleteFunction(item.id)} />
                    </div>
                </div>
                {
                    item?.comments?.length > 0 &&
                    <div>
                        <h6 className="mb-0 text-xs">Comments:</h6>
                        {
                            item?.comments?.map(comment => {
                                return (
                                    <div className="mb-2 opacity-50" style={{ overflow: "hidden", wordWrap: "break-word" }}>{comment}</div>
                                )
                            })
                        }
                    </div>
                }
                <div className="flex justify-between flex-wrap gap-1 mb-[-19px]">
                    <span className="opacity-50 text-[12px]">Created by: {item?.members?.length > 0 && item?.members[0]}</span>
                    <span className="opacity-50 text-[12px]">{moment(item?.date).format("DD/MM/YYYY")}</span>
                </div>
            </main >
        </div >
    );
};

export default Card;
