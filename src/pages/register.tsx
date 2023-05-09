import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react"
import Link from "next/link"
import router from "next/router"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState({ content: '', show: false, error: false })

    useEffect(() => {
        if (localStorage.getItem('token'))
            router.push('/profile')
    }, [])

    const registerMutation = useMutation(
        async () => {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })
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

                setUsername('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
            }

            return data
        }
    )

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            setMessage({
                show: true,
                content: 'Please, fill all the inputs.',
                error: true
            })
        } else if (password !== confirmPassword) {
            setMessage({
                show: true,
                content: "Passwords don't match.",
                error: true
            })
        } else {
            registerMutation.mutate()
        }
    }

    return (
        <>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Regis</span>ter.
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-1/2 sm:w-screen my-[10%] mx-auto px-3">
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
                        htmlFor="username2"
                        value="Your username"
                    />
                </div>
                <TextInput
                    id="username2"
                    type="text"
                    required={true}
                    shadow={true}
                    onChange={(e) => setUsername(e.target.value)} value={username}
                />
                <div className="mb-2 block">
                    <Label
                        htmlFor="email2"
                        value="Your email"
                    />
                </div>
                <TextInput
                    id="email2"
                    type="email"
                    placeholder="name@company.com"
                    required={true}
                    shadow={true}
                    onChange={(e) => setEmail(e.target.value)} value={email}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="password2"
                        value="Your password"
                    />
                </div>
                <TextInput
                    id="password2"
                    type="password"
                    required={true}
                    shadow={true}
                    onChange={(e) => setPassword(e.target.value)} value={password}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="repeat-password"
                        value="Repeat password"
                    />
                </div>
                <TextInput
                    id="repeat-password"
                    type="password"
                    required={true}
                    shadow={true}
                    onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}
                />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="agree">
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      I already have an account
                    </Link>
                </Label>
            </div>
            {/* <div className="flex items-center gap-2">
                <Checkbox id="agree" />
                <Label htmlFor="agree">
                    I agree with the
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                       {' '}terms and conditions
                    </a>
                </Label>
            </div> */}
            <Button type="submit">
                Register new account
            </Button>
        </form>
        </>
    )
}
