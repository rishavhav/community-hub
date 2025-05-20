import React from "react"
import { useNavigate } from "react-router-dom"

function CourseCard() {
  const navigate = useNavigate()

  const handleLearnClick = () => {
    navigate("/course-details")
  }

  return (
    <div className="w-full max-w-md mx-auto px-2">
      <div className="flex flex-col sm:flex-row rounded-lg bg-white shadow-md dark:bg-neutral-900 overflow-hidden">
        <img className="w-full sm:w-40 h-50 sm:h-auto object-cover" src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg" alt="course" />
        <div className="flex flex-col justify-between p-4">
          <div>
            <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">Course Name</h5>
            <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-300 mb-4">Last updated 3 mins ago</p>
            <button onClick={handleLearnClick} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Learn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
