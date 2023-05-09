import { useEffect } from 'react';
import { setIsLoggedIn, setUsername, setEmail } from '../../redux/user'
import { useDispatch } from 'react-redux'
import Hero from './components/Hero';

export default function Home() {
    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(setIsLoggedIn(true))
            dispatch(setUsername(`${localStorage.getItem('username')}`))
            dispatch(setEmail(`${localStorage.getItem('email')}`))
        }
    }, [])

    return (
        <main
            className='min-h-screen'
        >
            <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-md px-4 md:px-8">
                    <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
                        Awesome Task Manager
                    </h1>
                    <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                    Introducing the ultimate task manager, your one-stop solution for organizing your daily tasks! With our innovative task manager, you can easily create tasks and categorize them based on their importance and urgency. Not only that, but you can also assign specific due dates to your tasks, ensuring that you never miss a deadline.
                        <br />
                        <br />
                        Our task manager is designed to streamline your workflow and boost your productivity. By keeping all your tasks in one place and organizing them based on their category and due date, you'll have a clear understanding of what needs to be done{" "}
                        <a
                            href="#"
                            className="text-indigo-500 underline transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                        >
                            and when.
                        </a>{" "}
                    </p>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4">
                        This app was made for you!
                    </h2>
                    <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                        Whether you're a busy professional, a student with a heavy workload, or just someone who wants to get more organized, our task manager has got you covered. So why wait? Sign up today and take the first step towards achieving your goals!
                    </p>
                    <div className="relative mb-6 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:mb-8">
                        <img
                            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600&h=350"
                            loading="lazy"
                            alt="Photo by Minh Pham"
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

