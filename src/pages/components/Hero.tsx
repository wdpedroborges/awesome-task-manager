import Link from "next/link";

export default function Hero() {
    return (
        <>
            <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <header className="mb-8 flex items-center justify-between py-4 md:mb-12 md:py-8 xl:mb-16">
                {/* buttons - start */}
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                    </svg>
                    Menu
                </button>
                {/* buttons - end */}
                </header>
                <section className="flex flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row">
                {/* content - start */}
                <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-5/12 xl:py-24">
                    <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">
                    Very proud to introduce
                    </p>
                    <h1 className="text-black-800 mb-8 text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl">
                    A smart way to keep control of your tasks
                    </h1>
                    <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
                    Define your tasks by category and choose the day in which you want to do it!
                    </p>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                    <Link
                        href="/register"
                        className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                    >
                        Register now
                    </Link>
                    <Link
                        href="/login"
                        className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                    >
                        Login
                    </Link>
                    </div>
                </div>
                {/* content - end */}
                {/* image - start */}
                <div className="h-48 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto xl:w-5/12">
                    <img
                    src="https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&q=75&fit=crop&w=1000"
                    loading="lazy"
                    alt="Photo by Fakurian Design"
                    className="h-full w-full object-cover object-center"
                    />
                </div>
                {/* image - end */}
                </section>
            </div>
            </div>
        </>
    )
}