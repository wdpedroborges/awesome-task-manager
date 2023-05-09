import { Alert, Button, Label, Select, TextInput } from "flowbite-react"
import router from "next/router"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { setIsLoggedIn, setUsername, setEmail } from './redux/user'
import { useDispatch } from 'react-redux'

export default function NewTask() {
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [type, setType] = useState('Everyday')
    const [message, setMessage] = useState({ content: '', show: false, error: false })
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

    const registerMutation = useMutation(
        async () => {
          const response = await fetch('/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content, category, type }),
          })

          if (!response.ok)
            handleLogout('expired')

          const data = await response.json()

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
            
            setContent('')
            setCategory('')
            setType('Everyday')
          }

          return data
        }
    )

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(content, category, type)
        if (content === '' || category === '' || type === '') {
            setMessage({
                show: true,
                content: 'Please, fill all the inputs.',
                error: true
            })            
        } else {
            registerMutation.mutate()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-1/2 sm:w-screen my-[10%] mx-auto px-5">
            {registerMutation.isLoading && <p>Loading...</p>}
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
                                Well done!
                            </span>
                            {' ' + message.content}
                        </span>
                    </Alert>
                )) : ''
            }
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="content1"
                        value="Content"
                    />
                </div>
                <TextInput
                    id="content1"
                    type="text"
                    required={true}
                    shadow={true}
                    placeholder="This is the content of your task. Ex: 'buy milk'"
                    onChange={(e) => setContent(e.target.value)} value={content}
                />
                <div className="mb-2 block">
                    <Label
                        htmlFor="category1"
                        value="Category"
                    />
                </div>
                <TextInput
                    id="category1"
                    type="text"
                    placeholder="This is the category of your task. Ex: 'buy stuff'"
                    required={true}
                    shadow={true}
                    onChange={(e) => setCategory(e.target.value)} value={category}
                />
                <div id="select">
                <div className="mb-2 block">
                    <Label
                    htmlFor="type"
                    value="Type"
                    />
                </div>
                <Select
                    id="type1"
                    required={true}
                    onChange={(e) => {
                        console.log(e)
                        console.log(e.target.value)

                        setType(e.target.value)
                    }}
                >
                    <option value="Everyday">
                        Everyday
                    </option>
                    <option>
                        Sunday
                    </option>
                    <option>
                        Monday
                    </option>
                    <option>
                        Tuesday
                    </option>
                    <option>
                        Wednesday
                    </option>
                    <option>
                        Thursday
                    </option>
                    <option>
                        Friday
                    </option>
                    <option>
                        Saturday
                    </option>
                </Select>
                </div>
            </div>
            <Button type="submit">
                Create new task
            </Button>
        </form>
    )
}
