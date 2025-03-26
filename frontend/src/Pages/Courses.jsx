import React from "react"
import CourseCard from "../Components/CourseCard"

function Courses() {
  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </div>
  )
}

export default Courses
