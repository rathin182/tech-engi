"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

const faqs = [
  {
    question: "How does Tech-ENGI connect clients with engineers?",
    answer: "Clients submit project requirements, and Tech-ENGI matches them with verified engineers based on expertise, budget, and timeline for seamless collaboration and successful project delivery.",
  },
  {
    question: "Can students get help with final year engineering projects?",
    answer:
      "Yes, students can get expert guidance for project planning, development, testing, documentation, and implementation across various engineering domains.",
  },
  {
    question: "What engineering domains are available on Tech-ENGI?",
    answer: "Tech-ENGI supports Robotics, Embedded Systems, IoT, AI/ML, Software Development, Electronics, Automation, PCB Design, Firmware Development, and Product Prototyping.",
  },
  {
    question: "How long does project delivery usually take?",
    answer: "Delivery depends on project complexity. Small projects may take days, while larger development projects can take weeks with regular progress updates.",
  },
  {
    question: "Can startups hire engineers for product development?",
    answer: "Yes, startups can hire engineers for MVP development, prototyping, product design, software development, testing, and scaling innovative products",
  },
];

const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const testimonialRef = useScrollAnimation('fadeUp')
  const faqRef = useScrollAnimation('fadeUp')

  return (
    <div className="w-full h-full font-id overflow-hidden">

  {/* ── SECTION 1: TESTIMONIAL ── */}
  <section
    ref={testimonialRef}
    className="relative bg-white overflow-hidden border-b border-gray-200"
  >
    {/* ORANGE CIRCLE */}
    <div
      className="
        absolute

        w-[700px]
        h-[700px]

        sm:w-[900px]
        sm:h-[900px]

        lg:w-[1275px]
        lg:h-[1275px]

        rounded-full
        bg-[#FFAE58]

        -top-40
        -left-60

        sm:-top-52
        sm:-left-80

        lg:-top-60
        lg:-left-200

        p-[120px]
        sm:p-[160px]
        lg:p-[200px]
      "
    >
      <div className="w-full h-full rounded-full bg-white" />
    </div>

    <div
      className="
        relative
        z-10

        max-w-[1600px]
        mx-auto

        px-4
        sm:px-8
        lg:px-20

        py-12
        lg:py-16
      "
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row

          gap-12
          xl:gap-10

          items-center
          xl:items-start
        "
      >
        {/* LEFT SIDE */}
        <div
          className="
            relative

            flex
            flex-col

            items-center
            xl:items-start
          "
        >
          {/* PERSON IMAGE */}
          <div
            className="
              relative

              w-[280px]
              sm:w-[360px]
              lg:w-[434px]

              shrink-0
            "
          >
            <Image
              src="/white-guy.jpg"
              alt="Cecilia Pouros"
              width={434}
              height={631}
              priority
              className="
                w-full

                h-[420px]
                sm:h-[520px]
                lg:h-[631px]

                object-cover
                object-top
              "
            />
          </div>

          {/* TESTIMONIAL CARD */}
          <div
            className="
              relative
              xl:absolute

              xl:left-40
              xl:top-40

              w-full
              max-w-[569px]

              border
              border-gray-300

              font-inter
              bg-white
              shadow-lg

              p-5
              sm:p-6

              mt-6
              xl:mt-8
            "
          >
            <h3
              className="
                text-[28px]
                sm:text-[40px]

                font-bold
                text-black
              "
            >
              Cecilia Pouros
            </h3>

            <p className="text-[14px] text-gray-400 mb-4">
              Regional Markets Executive
            </p>

            <p
              className="
                text-[16px]
                sm:text-[20px]

                text-black
                leading-relaxed
              "
            >
              Amet minim mollit non deserunt ullamco est sit aliqua
              dolor do amet sint. Velit officia consequat duis enim
              velit mollit.
            </p>
          </div>

          {/* STARS */}
          <div
            className="
              relative
              xl:absolute

              xl:left-80
              xl:bottom-10

              flex
              items-center
              gap-2
              sm:gap-4

              bg-white
              border
              border-gray-200

              px-4
              sm:px-6

              py-3
              sm:py-4

              shadow-lg
              mt-6
            "
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="
                  text-[#F7871B]

                  text-[20px]
                  sm:text-[28px]
                "
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            flex-1

            text-center
            xl:text-right
          "
        >
          <h2
            className="
              leading-tight
              text-black

              text-[42px]
              sm:text-[58px]
              lg:text-[72px]

              font-[700]
            "
          >
            What others{" "}
            <span className="text-orange-400">think</span>
            <br />
            about us?
          </h2>

          {/* QUOTE */}
          <div
            className="
              mt-4
              xl:mt-6

              mx-auto
              xl:ml-auto
              xl:mr-0

              w-fit

              text-[70px]
              sm:text-[100px]

              leading-none
              font-black
              text-gray-100
              select-none
            "
            style={{ fontFamily: "Georgia, serif" }}
          >
            "
          </div>

          {/* ARROWS */}
          <div
            className="
              flex
              items-center
              justify-center
              xl:justify-end

              mt-10
              xl:mt-40
            "
          >
            <button
              className="
                w-14
                h-14

                sm:w-20
                sm:h-20

                border-2
                border-gray-300

                text-gray-500

                flex
                items-center
                justify-center

                hover:bg-gray-50
              "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="
                w-14
                h-14

                sm:w-20
                sm:h-20

                border-2
                border-gray-300

                text-black

                flex
                items-center
                justify-center

                hover:bg-gray-50
              "
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ── SECTION 2: FAQ ── */}
  <section ref={faqRef} className="bg-white font-inter">
    <div className="max-w-[1600px] mx-auto">

      {/* TOP */}
      <div
        className="
          flex
          flex-col
          lg:flex-row

          items-center
          lg:items-start

          justify-between

          gap-10

          bg-orange-300/10

          px-4
          sm:px-8
          lg:px-20

          pt-10
        "
      >
        {/* HEADING */}
        <div className="flex">
          <h2
            className="
              text-[36px]
              sm:text-[48px]
              lg:text-[60px]

              font-medium
              text-black
              leading-tight

              text-center
              lg:text-left
            "
          >
            Things,{" "}
            <span
              className="
                inline-flex
                items-center
                justify-center

                w-10
                h-10

                sm:w-12
                sm:h-12

                rounded-full
                bg-[#FFAE58]

                text-white

                text-[18px]
                sm:text-[20px]

                font-bold
              "
            >
              ?
            </span>{" "}
            you
            <br />
            probably wonder.
          </h2>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/girl.png"
            alt="Emoji"
            width={218}
            height={218}
            className="
              w-[140px]
              sm:w-[180px]
              lg:w-[218px]

              h-auto
              object-cover
              object-bottom
            "
          />
        </div>
      </div>

      {/* FAQ LIST */}
      <div
        className="
          mt-8

          max-w-[1200px]
          mx-auto

          px-4
          sm:px-8
          lg:px-20

          space-y-4

          pb-12
        "
      >
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200">
            <button
              className="
                w-full

                flex
                items-center
                justify-between

                gap-5

                py-5
                sm:py-6

                px-4
                sm:px-5

                text-left
              "
              onClick={() =>
                setOpenIndex(openIndex === i ? null : i)
              }
            >
              <span
                className={`
                  text-[15px]
                  sm:text-[16px]

                  ${
                    openIndex === i
                      ? "font-semibold text-black"
                      : "text-gray-600"
                  }
                `}
              >
                {faq.question}
              </span>

              <ChevronDown
                size={16}
                className={`
                  flex-shrink-0
                  text-gray-400
                  transition-transform

                  ${openIndex === i ? "rotate-180" : ""}
                `}
              />
            </button>

            {openIndex === i && faq.answer && (
              <p
                className="
                  pb-4

                  px-4
                  sm:px-5

                  text-[13px]
                  text-gray-500

                  leading-relaxed
                "
              >
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
</div>
  );
};

export default AboutUs;
