import { Avatar, Dropdown, Navbar } from "flowbite-react"
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Link from "next/link"

export function Menu() {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
    const username = useSelector((state: RootState) => state.user.username)
    const email = useSelector((state: RootState) => state.user.email)

    return (
        <>
            <Navbar
                fluid={true}
                rounded={true}
                className="border-b-2 mb-10"
            >
                <Navbar.Brand>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        ATM
                    </span>
                </Navbar.Brand>

                    <div className="flex md:order-2">
                    {isLoggedIn && (
                    <Dropdown
                        arrowIcon={false}
                        inline={true}
                        label={<Avatar placeholderInitials={username.charAt(0).toUpperCase()} />}
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                {username}
                            </span>
                            <span className="block truncate text-sm font-medium">
                                {email}
                            </span>
                        </Dropdown.Header>
                        <Link href="/profile">
                            <Dropdown.Item>
                                Profile
                            </Dropdown.Item>
                        </Link>
                        <Link href="/workplace">
                            <Dropdown.Item>
                            Workplace
                            </Dropdown.Item>
                        </Link>
                        <Link href="/myTasks">
                            <Dropdown.Item>
                                My tasks
                            </Dropdown.Item>
                        </Link>
                        <Link href="/newTask">
                            <Dropdown.Item>
                                New Task
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Link href="/logout">
                            <Dropdown.Item>
                                Logout
                            </Dropdown.Item>
                        </Link>
                    </Dropdown>
                    )}
                    <Navbar.Toggle />
                </div>


                <Navbar.Collapse>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                </Navbar.Collapse>
            </Navbar>

        </>
    )
}