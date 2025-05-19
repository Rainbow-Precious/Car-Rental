import React from "react";

export default function WhyChooseSection() {
  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Why Choose Mystar CBT?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <img
            src="/testimonial1.jpg"
            alt="Sarah Wilkins"
            className="w-20 h-20 mx-auto rounded-full mb-3"
          />
          <p className="italic text-gray-300">
            “Mystar CBT has made the exam process so much easier.”
          </p>
          <p className="font-semibold mt-2">Sarah Wilkins</p>
        </div>
        <div>
          <img
            src="/testimonial2.jpg"
            alt="Jonathan Hayes"
            className="w-20 h-20 mx-auto rounded-full mb-3"
          />
          <p className="italic text-gray-300">
            “User-friendly platform that improved our exam administration.”
          </p>
          <p className="font-semibold mt-2">Jonathan Hayes</p>
        </div>
        <div>
          <img
            src="/testimonial3.jpg"
            alt="Emily Chen"
            className="w-20 h-20 mx-auto rounded-full mb-3"
          />
          <p className="italic text-gray-300">
            “Flexible for creating exams tailored to our curriculum.”
          </p>
          <p className="font-semibold mt-2">Emily Chen</p>
        </div>
      </div>
    </section>
  );
}
