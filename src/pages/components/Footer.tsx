import { Footer } from "flowbite-react"

export function SimpleFooter() {
    return (
        <>
            <Footer container={true}>
                <div className="w-full text-center">
                    <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                        <div className="flex">
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

                            <span>ATM</span>
                        </div>
                        <Footer.LinkGroup>
                            <Footer.Link href="/">
                                Home
                            </Footer.Link>
                            <Footer.Link href="/about">
                                About
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <Footer.Divider />
                    <Footer.Copyright
                        href="#"
                        by="Awesome Task Manager"
                        year={new Date().getFullYear()}
                    />
                </div>
            </Footer>
        </>
    )
}