import React from "react";
import {
    Droppable,
} from "react-beautiful-dnd";

const List = ({ children, title, name }) => {
    return (
        <div className="flex flex-col w-6/12">
            <h2 className="text-2xl text-white font-bold mb-2 mx-5">{title}</h2>
            <div className="">
                <Droppable droppableId={name}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} className="h-screen">
                            <div className="p-5 min-h-max gap-y-3 flex flex-col h-screen text-[14px]">
                                {children}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

export default List;
