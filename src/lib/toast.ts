import toast from "react-hot-toast";

export const toastSuccess = (message: string) => {
    toast.success(message, {
        icon: '👏',
        style: {
            borderRadius: '20px',
            background: '#ffffff00',
            border: '1px solid #ffffff30',
            backdropFilter: 'blur(10px)',
            color: '#fff',
        },
    });
}
export const toastError = (message: string) => {
    toast.error(message, {
        icon: '❌',
        style: {
            borderRadius: '20px',
            background: '#ff031017',
            border: '1px solid #ff03107d',
            backdropFilter: 'blur(10px)',
            color: '#fff',
        },
    });
}