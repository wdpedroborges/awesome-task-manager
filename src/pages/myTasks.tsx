import { useMutation, useQuery } from "react-query"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { Alert, Badge, Button, ListGroup, Modal } from "flowbite-react"
import React from "react"
import { setIsLoggedIn, setUsername, setEmail } from './redux/user'
import { useDispatch } from 'react-redux'

export default function MyTasks() {
    const router = useRouter()
    const [message, setMessage] = useState({ content: '', show: false, error: false })
    const [taskToBeDeleted, setTaskToBeDeleted] = useState('')
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch<any>();

    const handleLogout = (query = '') => {
        localStorage.removeItem('token')

        if (query !== '') {
            router.push(`/login?status=${query}`)
        } else {
            router.push('/login')
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            handleLogout()
        } else {
            dispatch(setIsLoggedIn(true))
            dispatch(setUsername(`${localStorage.getItem('username')}`))
            dispatch(setEmail(`${localStorage.getItem('email')}`))
        }
    }, [])

    const myTasks = useQuery(
        'myTasks',
        async () => {
          const token = localStorage.getItem('token')
          const response = await fetch('/api/task', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          })

          if (!response.ok)
            handleLogout('expired')

          const data = await response.json()

          if (data.error) {
            console.log('error')
            handleLogout()
          }
            

          return data
        }
    )

    if (myTasks.isLoading) {
        return <div>Loading...</div>
    }

    if (myTasks.isError) {
        return <div>{ `${myTasks.error}` }</div>
    }

    const handleDelete = async (id: string) => {
        const response = await fetch(`/api/task?id=${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
  
          if (data.error) {
              setMessage({
                  content: data.message,
                  error: true,
                  show: true
              })
          } else {
              setMessage({
                  content: data.message,
                  error: false,
                  show: true
              })
              myTasks.refetch()
          }

          setTimeout(() => {
            setMessage({
                content: '',
                error: false,
                show: false
            })            
          }, 2000)
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <React.Fragment>
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <Modal.Header>
                    Please, confirm that you want to delete the task
                    </Modal.Header>
                    <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this task?
                        </p>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => {
                        handleDelete(taskToBeDeleted)
                        setShowModal(false)
                    }}>
                        Yes
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => setShowModal(false)}
                    >
                        Nevermind
                    </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>

            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Your
                </span>
                {' '}Tasks
            </h1>
            <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 mb-10">You have {myTasks.data.tasks ? myTasks.data.tasks.length : ''} tasks.</p>
            {message.show ?
                (message.error ? (
                    <Alert
                        color="failure"
                    >
                        <span>
                            <span className="font-medium">
                                Oops!
                            </span>
                            {' ' + message.content}
                        </span>
                    </Alert>
                ) : (
                    <Alert
                        color="success"
                    >
                        <span>
                            <span className="font-medium">
                                Done!
                            </span>
                            {' ' + message.content}
                        </span>
                    </Alert>
                )) : ''
            }
            {myTasks?.data?.tasks.length > 0 &&
                <div className="sm:w-screen lg:w-1/2 my-0 mx-auto mt-10">
                <ListGroup>
                    {
                        myTasks.data.tasks? (myTasks.data.tasks.map((task: any, index: number) => {
                            return (
                                <ListGroup.Item
                                    key={index}
                                    className="sm:w-full flex justify-around items-center"
                                >
                                    <Badge className="mr-5" color="info">{task.category}</Badge>
                                    <Badge color="info">{task.type}</Badge>

                                    <span className="flex-1">{task.content}</span>

                                    <span onClick={() => {
                                        setTaskToBeDeleted(task._id)
                                        setShowModal(true)
                                    }} className="w-5 text-red-400">
                                        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                                        </svg>                             
                                    </span>

                                </ListGroup.Item>
                            )
                        })) : ''
                    }
                </ListGroup>
            </div>            
            }
        </div>
    )
}
