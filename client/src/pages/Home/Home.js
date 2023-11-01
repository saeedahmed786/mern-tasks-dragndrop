import Card from "../../components/Card/Card";
import List from "../../components/List/List";
import {
  DragDropContext,
  Draggable
} from "react-beautiful-dnd";
import { useQuery } from '@apollo/client';
import { GET_TODOS, UPDATE_TODO_CATEGORY } from "../../queries";
import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/client';
import AddModal from "../../components/AddModal/AddModal";
import AddMembers from "../../components/AddMembers/AddMembers";

const Incorporate = () => {
  const history = useHistory();
  const [updateTodosCategory] = useMutation(UPDATE_TODO_CATEGORY, {
    context: {
      headers: {
        authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
      },
    }
  });

  const { loading, error, data, refetch } = useQuery(GET_TODOS, {
    context: {
      headers: {
        authorization: `${localStorage.getItem("token")}`, // Replace with your actual token
      },
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    history.push("/login")
  }
  console.log(loading, error, data.todos)

  const onDragEnd = async (result) => {
    console.log(result);
    if (!result.destination) {
      console.log(result);
      return;
    } else {
      let category;
      if (result?.destination?.droppableId === "todo") {
        category = "todo"
      } else if (result?.destination?.droppableId === "doing") {
        category = "doing"
      } else if (result?.destination?.droppableId === "done") {
        category = "done"
      }
      const { data } = await updateTodosCategory({ variables: { id: result.draggableId, title: "wdewd", category: category } });
      console.log(data);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center justify-end">
        <AddMembers updateData={() => refetch()} />
        <AddModal updateData={() => refetch()} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex">
          <List title="To do" onDragEnd={onDragEnd} name="todo">
            {data.todos?.filter(f => f.category === "todo").map((item, index) => (
              <Draggable key={item.id} draggableId={item.id + ""} index={index}>
                {(
                  provided,
                  snapshot
                ) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card item={item} updateData={refetch} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </List>
          <List title="Doing" onDragEnd={onDragEnd} name="doing">
            {data.todos?.filter(f => f.category === "doing").map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card item={item} updateData={refetch} />
                  </div>
                )}
              </Draggable>
            ))}
          </List>
          <List title="Done" onDragEnd={onDragEnd} name="done">
            {data.todos?.filter(f => f.category === "done").map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card item={item} updateData={refetch} />
                  </div>
                )}
              </Draggable>
            ))}
          </List>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Incorporate;