import { Metadata } from "next";
import HeaderSection from "@/components/header-section";
import Image from "next/image";
import { IoEyeOutline, IoLocateOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "About",
  description: "About page",
};

export default function About() {
  return (
    <div>
      <HeaderSection title="About" subTitle="Lorem ipsum dolor sit amet." />
      <div className="max-w-screen-xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Image
            src={"/about-image.jpg"}
            alt="about"
            width={650}
            height={579}
          />
          <div>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 ">
              Who we are
            </h1>
            <p className="text-gray-700 py-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
              corrupti, ipsam doloremque quisquam laborum optio eius cum
              assumenda nostrum aperiam!
            </p>
            <ul className="list-item space-y-6 pt-8">
              <li className="flex gap-5  ">
                <div className="flex-none mt-1">
                  <IoEyeOutline className="size-7 " />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Vision:</h4>
                  <p className="text-gray-600 ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquid numquam quas voluptatum nobis aut molestiae?
                  </p>
                </div>
              </li>
              <li className="flex gap-5  ">
                <div className="flex-none mt-1">
                  <IoLocateOutline className="size-7 " />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Mission:</h4>
                  <p className="text-gray-600 ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aliquid numquam quas voluptatum nobis aut molestiae?
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
