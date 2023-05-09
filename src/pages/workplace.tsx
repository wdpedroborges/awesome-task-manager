import { useMutation, useQuery } from "react-query"
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from "react"
import { Alert, Badge, ListGroup, Tabs } from "flowbite-react"
import { setIsLoggedIn, setUsername, setEmail } from '../../redux/user'
import { useDispatch } from 'react-redux'

const alreadyInArray = (array: any[], element: any) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true
        }
    }

    return false
}

const checkHowManyUndone = (elements: any[]) => {
    let count = 0
    elements.forEach(element => {
        if (!element.completed) {
            count++
        }
    })

    return count
}

const getDayOfWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    switch (dayOfWeek) {
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
        default:
            return "Sunday"
    }
}

export default function Workplace() {
    const router = useRouter()
    const [message, setMessage] = useState({ content: '', show: false, error: false })
    const [currentTaskId, setCurrentTaskId] = useState('')
    const [finishedAmount, setFinishedAmount] = useState(0)
    const [finished, setFinished] = useState(false)
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
        'workplace',
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

    const tasksByCategory = useMemo(() => {
        // ? This array contains all the strings of categories, just to keep control of the ones that already were considered
        let metaCategories: any = []
        let categories: any = []

        if (myTasks?.data?.tasks.length > 0) {
            myTasks.data.tasks.forEach((task: any) => {
                if (!alreadyInArray(metaCategories, task.category)) {
                    categories.push({ category: task.category, elements: [] })
                    metaCategories.push(task.category)
                }
            })
    
            myTasks.data.tasks.forEach((task: any) => {
                categories.forEach((category: any) => {
                    if (task.category === category.category) {
                        if (task.type === getDayOfWeek() || task.type === 'Everyday') {
                            category.elements.push(task)
                        }
                    }
                })
            })
     }
        return categories
    }, [myTasks])

    if (myTasks.isLoading) {
        return <div>Loading...</div>
    }

    if (myTasks.isError) {
        return <div>{ `${myTasks.error}` }</div>
    }

    const handleComplete = async (id: string, completed: boolean, type: string) => {
        const response = await fetch(`/api/task?id=${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ completed, type })
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
        <div className="flex flex-col justify-center items-center px-10">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Work
                </span>
                place
            </h1>
            <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 mb-10">You have {myTasks.data.tasks ? myTasks.data.tasks.length : ''} tasks.</p>
            {message.show ?
                (message.error ? (
                    <Alert
                        color="failure"
                        className="my-5"
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
                        className="my-5"
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
            <Tabs.Group
                aria-label="Default tabs"
                style="default"
                className="w-[75%]"
            >
                {   
                    tasksByCategory.length > 0 ? (tasksByCategory.map((task: any, index: number) => {
                        return (
                            <Tabs.Item
                                active={true}
                                title={`${task.category} (${checkHowManyUndone(task.elements)})`}
                                key={index}
                            >
                                <ListGroup>
                                    {task.elements.map((element: any, index: number) => {
                                        return (
                                            <ListGroup.Item
                                                key={index}
                                            >
                                                
                                                {element.completed? (
                                                    <div className="flex" onClick={() => handleComplete(element._id, element.completed, element.type)}>
                                                    <Badge color="success" className="mr-3">Done</Badge>
                                                    <span className="font-bold text-blue-700">
                                                        
                                                        {element.content}
                                                    </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex" onClick={() => handleComplete(element._id, element.completed, element.type)}>
                                                    <Badge color="failure" className="mr-3">Not done</Badge>
                                                    <span className="font-bold text-blue-700">
                                                        
                                                        {element.content}
                                                    </span>
                                                    </div>
                                                )}
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Tabs.Item>
                        )
                    })) : ''
                }
            </Tabs.Group>
        </div>
    )
}
