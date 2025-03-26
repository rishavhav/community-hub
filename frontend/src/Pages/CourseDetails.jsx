import React from "react"

function CourseDetails() {
  return (
    <div className="bg-neutral-900 text-white min-h-screen">
      {/* Cover Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0" alt="Course Cover" className="w-full h-full object-cover" />
      </div>

      {/* Course Info */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-4">Mastering Self Confidence</h1>
        <p className="text-gray-300 mb-6">Lorem ipsum dolor sit amet. Aut adipisci velit non distinctio omnis eum sint quos ut repellat omnis rem fugiat quas cum modi nobis. In quod galisum aut iste dolores ea quasi rerum qui enim omnis. </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>🕒 12 hours</span>
          <span>📅 Last updated: March 2025</span>
          <span>👨‍🏫 Instructor: Oliviah Shaffer</span>
        </div>
      </div>

      {/* Course Content */}
      {/* Course Content */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-6">Course Content</h2>

        <div className="flex flex-col gap-8">
          {/* Video 1 */}
          <div className="max-w-md">
            <h4 className="mb-2">Topic: Lorem ipsum dolor sit amet</h4>
            <div className="relative w-full pt-[56.25%]">
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/kYlBOsYD6F4" allowFullScreen></iframe>
            </div>
          </div>

          {/* Video 2 */}
          <div className="max-w-md">
            <h4 className="mb-2">Topic: Lorem ipsum dolor sit amet</h4>
            <div className="relative w-full pt-[56.25%]">
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/kYlBOsYD6F4" allowFullScreen></iframe>
            </div>
          </div>

          {/* Video 3 */}
          <div className="max-w-md">
            <h4 className="mb-2">Topic: Lorem ipsum dolor sit amet</h4>
            <div className="relative w-full pt-[56.25%]">
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/kYlBOsYD6F4" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
