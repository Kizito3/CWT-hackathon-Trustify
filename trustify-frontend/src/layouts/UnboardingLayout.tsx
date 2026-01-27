import { Outlet } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import OnBoard from "../assets/onboarding.svg";

export default function UnBoardingLayout() {
  return (
    <div className="h-screen">
      <div className="flex w-full">
        <div className="bg-[#2563EB] lg:block hidden h-screen relative w-full px-22">
          <div className="flex items-center gap-1  pt-13.75">
            <img src={Logo} alt="" />
            <h1 className="font-bold text-white text-[28px] ">Trustify</h1>
          </div>

          <div className="mt-20">
            <img src={OnBoard} alt="" />
          </div>

          <div className="">
            <div className="absolute bottom-10">
              <h2 className="text-white font-bold text-[40px] text-center">
                Trust, built on accountability.
              </h2>
              <p className="text-white text-base text-center w-128.25">
                Trustify helps teams establish transparency, enforce
                accountability, and maintain clear oversight in the management
                of shared resources and responsibilities.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:-ml-50 z-10 lg:px-50 px-5 bg-white rounded-l-[70px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
