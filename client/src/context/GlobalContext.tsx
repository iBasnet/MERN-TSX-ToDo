import React, { useEffect, createContext, useReducer, ReactNode, Dispatch } from "react";

type Priority = "Low" | "Medium" | "High";

interface Task { // interface is the go-to for objects
    id: number;
    sentAt: Date;
    text: string;
    priority: string;
    isComplete: boolean;
}

interface State { // interface is the go-to for objects
    text: string;
    priority: Priority;
    isComplete: boolean;
    tasks: Task[];
    globalTasks: Task[];
    isLoading: boolean;
    editMode: { status: boolean, id: number | undefined };
}
type Action =
    | { type: "SET_TODOS"; payload: Task[] }
    | { type: "ADD_TASK"; payload: Task }
    | { type: "DELETE_TASK"; payload: { id: number } }
    | { type: "UPDATE_TASK"; payload: { id: number | undefined, updates: { text: string, priority: Priority } } }
    | { type: "SET_TEXT"; payload: string }
    | { type: "SET_PRIORITY"; payload: Priority }
    | { type: "SHOW_ALL" }
    | { type: "FILTER_PENDING" }
    | { type: "FILTER_COMPLETED" }
    | { type: "UPDATE_GLOBAL_TASKS" }
    | { type: "TOGGLE_COMPLETE", payload: { id: number } }
    | { type: "TOGGLE_EDIT_MODE" }

const initialState: State = {
    text: "",
    priority: "Medium",
    isComplete: false,
    tasks: [],
    globalTasks: [],
    isLoading: false,
    editMode: { status: false, id: undefined },
};

const reducer = (state: State, action: Action): State => {

    switch (action.type) {
        case "SET_TODOS":
            return {
                ...state,
                tasks: action.payload,
                isLoading: false,
            };
        case "ADD_TASK":
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
            };
        case "DELETE_TASK":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload.id),
            };

        case "UPDATE_TASK":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id
                        ? { ...task, ...action.payload.updates }
                        : task
                )
            }

        case "SET_TEXT":
            return {
                ...state,
                text: action.payload,
            };

        case "SET_PRIORITY":
            return {
                ...state,
                priority: action.payload,
            };

        case "TOGGLE_COMPLETE":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id
                        ? { ...task, isComplete: !task.isComplete }
                        : task
                )
            }

        // case "TOGGLE_EDIT_MODE":
        //     return {
        //         ...state,
        //         editMode: !state.editMode
        //     }

        case "SHOW_ALL":
            return {
                ...state,
                globalTasks: [...state.tasks]
            }

        case "FILTER_PENDING":
            return {
                ...state,
                globalTasks: state.tasks.filter((task) => task.isComplete !== true)
            }

        case "FILTER_COMPLETED":
            return {
                ...state,
                globalTasks: state.tasks.filter((task) => task.isComplete === true)
            }

        case "UPDATE_GLOBAL_TASKS":
            return {
                ...state,
                globalTasks: [...state.tasks]
            }

        default:
            return state;
    }
};

interface GlobalContextType {
    state: State;
    dispatch: Dispatch<Action>;
}

export const GlobalContext = createContext<GlobalContextType>({
    state: initialState,
    dispatch: () => { }, // no-operation default function
});

interface GlobalContextProviderProps {
    children: ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // side code
    useEffect(() => {
        dispatch({ type: 'UPDATE_GLOBAL_TASKS' })
    }, [state.tasks]);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};