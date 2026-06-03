'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Robotics",
    image: "/robotics2.png",
    description1:
      "Robotics design, automation systems, robotic arm development, ROS integration, and autonomous solutions.",
  },
  {
    title: "Embedded System",
    image: "/embeddedsyatem2.jpg",
    description1:
      "Embedded firmware development, microcontroller programming, RTOS solutions, PCB integration, and hardware prototyping.",
  },
  {
    title: "IoT",
    image: "/iot2.png",
    description1:
      "IoT device development, cloud connectivity, sensor integration, smart automation, and real-time monitoring systems.",
  },
  {
    title: "AI / ML Projects",
    image: "/aiml2.png",
    description1:
      "Machine learning models, computer vision, predictive analytics, NLP applications, and AI-powered automation.",
  },
  {
    title: "Software Projects",
    image: "/software2.png",
    description1:
      "Web applications, mobile apps, SaaS platforms, APIs, enterprise software, and full-stack development.",
  },
];

const BrowserCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);

  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        listRef.current!.children,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        detailRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: detailRef.current,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
   <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 font-id">
  <div className="max-w-[1600px] mx-auto">

    {/* HEADER */}
    <div
      ref={headerRef}
      className="
        flex
        flex-col
        lg:flex-row

        lg:items-start
        lg:justify-between

        gap-8
        mb-12
      "
    >
      {/* LEFT */}
      <div>
        <p
          className="
            text-[42px]
            sm:text-[54px]
            lg:text-[64px]

            font-black
            leading-[1.0]
            text-black
          "
        >
          Browse by
        </p>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-[3px] w-10 sm:w-16 bg-black" />

          <p
            className="
              text-[42px]
              sm:text-[54px]
              lg:text-[64px]

              font-black
              leading-[1.0]
              text-black
            "
          >
            Category
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <p
        className="
          text-[18px]
          sm:text-[24px]
          lg:text-[30px]

          font-medium
          text-black

          text-left
          lg:text-right

          font-inter
          lg:mt-4
          leading-relaxed
        "
      >
        Find projects and talent across key
        <br className="hidden sm:block" />
        engineering disciplines
      </p>
    </div>

    {/* MAIN LAYOUT */}
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-[520px_1fr]

        gap-10
        items-start
      "
    >
      {/* LEFT CATEGORIES */}
      <div
        ref={listRef}
        className="
          flex
          flex-col
          gap-3
        "
      >
        {categories.map((cat, i) => {
          const active = selectedCategory.title === cat.title;

          return (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat)}
              className={`
                flex
                items-center

                gap-3
                sm:gap-5

                px-4
                sm:px-6

                py-4
                sm:py-5

                border
                transition-all
                duration-300

                rounded-none
                cursor-pointer
                text-left

                ${
                  active
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }
              `}
            >
              <span
                className="
                  text-[22px]
                  sm:text-[30px]

                  font-bold
                  font-spacegrotesk
                  shrink-0
                "
              >
                {i + 1}.
              </span>

              <span
                className="
                  text-[20px]
                  sm:text-[30px]

                  font-medium
                  font-id

                  leading-tight
                "
              >
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* RIGHT CONTENT */}
      <div ref={detailRef} className="min-w-0">

        {/* TITLE */}
        <h3
          className="
            text-[34px]
            sm:text-[42px]
            lg:text-[50px]

            font-bold
            text-black

            text-left
            lg:text-right

            mb-4
            leading-tight
          "
        >
          {selectedCategory.title}
        </h3>

        {/* IMAGE */}
        <div
          className="
            w-full
            overflow-hidden
            rounded-sm
            mb-6
          "
        >
          <Image
            src={selectedCategory.image}
            alt={selectedCategory.title}
            width={900}
            height={400}
            priority
            className="
              w-full

              h-[220px]
              sm:h-[300px]
              lg:h-[420px]

              object-cover
            "
          />
        </div>

        {/* DESCRIPTION 1 */}
        <p
          className="
            text-[14px]
            sm:text-[15px]
            lg:text-[16px]

            text-gray-600

            text-left
            lg:text-right

            mb-4
            font-inter
            leading-relaxed
          "
        >
          {selectedCategory.description1}
        </p>

        {/* DESCRIPTION 2 */}
        {/* <p
          className="
            text-[14px]
            sm:text-[15px]
            lg:text-[16px]

            text-gray-600

            text-left
            lg:text-right

            font-inter
            leading-relaxed
          "
        >
          {selectedCategory.description2}
        </p> */}
      </div>
    </div>
  </div>
</section>
  );
};

export default BrowserCategory;