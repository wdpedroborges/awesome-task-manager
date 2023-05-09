import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { useRouter } from 'next/router'
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react"
import Link from "next/link"
import { setIsLoggedIn, setUsername, setEmail } from '../../redux/user'
import { useDispatch } from 'react-redux'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState({ content: '', show: false, error: false })
    const router = useRouter()
    const { status } = router.query
    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (localStorage.getItem('token')) {
          router.push('/profile')
        }
    }, [])

    const loginMutation = useMutation(
        async () => {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })
          const data = await response.json()

          if (data.error) {
            setMessage({
                content: data.message,
                error: true,
                show: true
            })
          } else {
            // do something after login confirmed
            console.log(data.username, data.email)
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            localStorage.setItem('email', data.email)

            router.push('/profile')
          }

          return data
        }
    )

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (username !== '' && password !== '') {
            loginMutation.mutate()
        } else {
            setMessage({
                show: true,
                content: 'Please, fill all the inputs.',
                error: true
            })
        }
    }

    return (
        <>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Log</span>in.
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-1/2 sm:w-screen my-[10%] mx-auto px-5">
            {loginMutation.isLoading && <p>Loading...</p>}
            {status === 'expired' && (
                <Alert color="info">
                <span>
                    <span className="font-medium">
                    Oops!
                    </span>
                    {' '}You're session expired. Please, login again.
                </span>
                </Alert>
            )}
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
                    htmlFor="username1"
                    value="Username"
                    className="cursor-pointer"
                />
                </div>
                <TextInput
                id="username1"
                placeholder="Your username"
                required={true}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="password1"
                    value="Password"
                    className="cursor-pointer"
                />
                </div>
                <TextInput
                id="password1"
                type="password"
                placeholder="Your password"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="agree">
                    <Link
                        href="/register"
                        className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      I still don't have an account
                    </Link>
                </Label>
            </div>
            {/* <div className="flex items-center gap-2">
                <Checkbox id="remember" className="cursor-pointer"/>
                <Label htmlFor="remember" className="cursor-pointer">
                Remember me
                </Label>
            </div> */}
            <Button type="submit">
                Login
            </Button>
        </form>
        </>
    )
}
