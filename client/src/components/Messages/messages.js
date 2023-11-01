import { message } from "antd";

export const Success = (messages) => {
    message.success({
        content: messages,
        duration: 2000
    });
}
export const Error = (messages) => {
    message.error({
        content: messages,
        duration: 2000
    });
}
export const Warning = (messages) => {
    message.warning({
        content: messages,
        duration: 2000
    });
}
