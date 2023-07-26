import { useEffect, useState } from 'react'

import { api } from '@/utils/client/api'

export const TodoList = () => {
  const {
    data: todos = [],
    refetch: todoRefetch,
    isLoading: todoLoading,
  } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })
  const [selectedTab, setSelectedTab] = useState('all')
  const [idItem, setIdItem] = useState()
  const updateTodo = api.todoStatus.update.useMutation()
  const deleteTodo = api.todo.delete.useMutation()
  useEffect(() => {
    todoRefetch()
  }, [updateTodo, deleteTodo])
  const filteredTodos =
    selectedTab === 'all'
      ? todos
      : todos.filter((todo) => todo.status === selectedTab)
  return (
    <div className="">
      <div className="flex items-center justify-start gap-2 pb-10">
        <button
          className={`rounded-full px-6 py-3 text-sm font-bold leading-5 ${
            selectedTab === 'all'
              ? 'border border-solid border-gray-700 bg-gray-700 text-white'
              : 'border border-solid border-gray-200 bg-white text-gray-900'
          }`}
          onClick={() => setSelectedTab('all')}
        >
          All
        </button>
        <button
          className={`rounded-full px-6 py-3 text-sm font-bold leading-5 ${
            selectedTab === 'pending'
              ? 'border border-solid border-gray-700 bg-gray-700 text-white'
              : 'border border-solid border-gray-200 bg-white text-gray-900'
          }`}
          onClick={() => setSelectedTab('pending')}
        >
          Pending
        </button>
        <button
          className={`rounded-full px-6 py-3 text-sm font-bold leading-5 ${
            selectedTab === 'completed'
              ? 'border border-solid border-gray-700 bg-gray-700 text-white'
              : 'border border-solid border-gray-200 bg-white text-gray-900'
          }`}
          onClick={() => setSelectedTab('completed')}
        >
          Completed
        </button>
      </div>

      <ul className="grid h-full max-h-[300px] grid-cols-1 gap-y-3 overflow-y-auto">
        {todoLoading ? (
          <div className="flex h-[100px] items-center justify-center">
            Loading.....
          </div>
        ) : filteredTodos?.length === 0 ? (
          <div className="flex h-[80px] items-center justify-center text-sm text-gray-400">
            Danh sách trống
          </div>
        ) : (
          filteredTodos.map((todo, index) =>
            todo.id === idItem &&
            (updateTodo.isLoading || deleteTodo.isLoading) ? (
              <div
                key={index}
                className="flex h-[62px] items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm hover:border-gray-300"
              >
                {updateTodo.isLoading && 'loadding...'}
                {deleteTodo.isLoading && 'Đang xóa...'}
              </div>
            ) : (
              <li key={todo.id}>
                <div className="flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm hover:border-gray-300">
                  <input
                    type="checkbox"
                    checked={todo.status === 'completed' ? true : false}
                    onChange={async () => {
                      setIdItem(todo.id)
                      await updateTodo.mutate({
                        todoId: todo.id,
                        status:
                          todo.status === 'completed' ? 'pending' : 'completed',
                      })
                    }}
                    className="h-6 w-6 rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                  />

                  <label
                    className={`block pl-3 font-medium ${
                      todo.status === 'completed' ? 'line-through' : ''
                    }`}
                  >
                    {todo.body}
                  </label>

                  <button
                    type="button"
                    onClick={async () => {
                      await deleteTodo.mutate({ id: todo.id })
                    }}
                    className="bg-red-500 rounded-md ml-auto p-2 text-gray-900 hover:text-[#FF0000]"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            )
          )
        )}
      </ul>
    </div>
  )
}

const XMarkIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
