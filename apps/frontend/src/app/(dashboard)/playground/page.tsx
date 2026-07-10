"use client";

import React, { useState, useEffect } from "react";
import { SpinningWheel } from "@/components/spinning-wheel";

// --- SVG Icons ---

// Small stacked "CR EA" logo
const LogoSmall = () => (
  <svg viewBox="0 0 31 34" fill="none" className="w-[30.47px] h-[33.08px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.7697 9.8199C20.7697 9.34949 21.1331 8.93782 21.5949 8.93282L23.6987 8.91011C24.9343 8.89678 25.9358 8.09011 26.0387 6.84366C26.1274 5.76886 25.7533 4.78595 24.7312 4.4022C24.3554 4.26116 23.9614 4.18053 23.547 4.18012L20.1122 4.17657C20.0372 4.17657 19.9658 4.33324 19.9658 4.41428L19.9412 15.4503C19.9393 16.2897 19.322 16.9472 18.5566 17.0953C18.1179 17.1801 17.7249 17.1653 17.2933 17.103C16.7397 17.0232 16.2479 16.6703 16.0281 16.1518C15.8968 15.8422 15.8397 15.5214 15.8397 15.1693L15.8431 5.29345L15.8456 2.36428C15.846 1.96595 15.8895 1.59574 16.0593 1.23449C16.3774 0.55824 17.031 0.0592821 17.8112 0.0569904L23.6562 0.0401155C24.2049 0.0384488 24.7043 0.130949 25.2308 0.240532C26.481 0.500949 27.6041 1.09907 28.5187 1.96345C30.791 4.11137 31.117 7.58866 29.2999 10.1366C28.4991 11.2597 27.4587 11.8393 27.4008 11.9495C27.3804 11.9884 27.4068 12.0978 27.4368 12.1418L30.0462 15.9601C30.317 16.3564 30.1193 16.8774 29.7079 17.0407C29.5641 17.0978 29.3999 17.1522 29.2495 17.1522H27.0277C26.8179 17.1522 26.6029 17.1112 26.4066 17.0637C25.9208 16.9466 25.5658 16.6524 25.2935 16.2424L23.5685 13.6439C23.2012 13.0905 22.5689 12.8405 21.9229 12.8451C21.6366 12.8472 21.3631 12.832 21.1208 12.6766C20.8922 12.5299 20.7687 12.2374 20.7689 11.9547L20.7697 9.82032V9.8199Z" fill="#111827"/>
    <path d="M20.3166 29.83C20.0503 29.8296 19.8751 30.0175 19.8749 30.25L19.8728 32.1365C19.8722 32.6413 19.5112 33.0669 18.9974 33.0665L16.923 33.065C16.5966 33.0648 16.2643 32.8811 16.0801 32.6179C15.9364 32.4125 15.852 32.1419 15.853 31.874L15.8785 24.9298C15.8853 23.0754 16.6241 21.2861 17.823 19.8975C19.1955 18.3079 21.191 17.4392 23.293 17.4884C25.592 17.5421 27.7445 18.7098 29.0276 20.6188C29.8418 21.8302 30.3114 23.2596 30.3114 24.7334V31.9788C30.3114 32.5434 29.871 33.0588 29.3264 33.0579L27.0247 33.0548C26.6064 33.0542 26.271 32.609 26.2685 32.2079L26.2568 30.2863C26.2553 30.0536 26.0882 29.8409 25.838 29.8404L20.3168 29.8298L20.3166 29.83ZM25.9895 26.1771C26.1076 26.1454 26.1851 26.08 26.186 25.9965L26.1955 24.8427C26.203 23.9215 25.8145 23.0296 25.1253 22.4202C24.5182 21.8834 23.7651 21.6454 22.966 21.674C21.3076 21.7332 19.9626 23.3242 19.9535 24.8425L19.9468 25.9565C19.946 26.0886 20.0464 26.1782 20.191 26.1782L25.9899 26.1769L25.9895 26.1771Z" fill="#111827"/>
    <g id="Group_2">
      <path d="M5.21866 27.1418C4.57158 27.1418 4.16449 27.5584 4.14699 28.1834C4.13199 28.7241 4.49762 29.2274 5.09158 29.2282L14.4382 29.2403C14.9303 29.2409 15.2876 29.6576 15.2855 30.1097L15.2749 32.2647C15.2726 32.7411 14.8585 33.0786 14.4214 33.0772L13.4782 33.0738H5.08991C4.2272 33.0738 3.44616 32.8966 2.68908 32.4959C1.05887 31.6334 0.0561609 29.8899 0.174703 28.0315C0.238661 27.029 0.679286 26.1255 1.31512 25.3693C1.36929 25.3049 1.38679 25.2186 1.3322 25.1551C0.161994 23.7905 -0.190506 22.1386 0.563661 20.4661C1.34449 18.7345 3.06616 17.589 4.97387 17.5895L8.2697 17.5901L14.4251 17.5957C14.9716 17.5961 15.3964 17.9634 15.3962 18.5186L15.3957 20.5018C15.3957 20.9878 15.0153 21.4163 14.5066 21.4172L8.67595 21.4263L5.05095 21.4388C4.4997 21.4407 4.14283 21.9147 4.1522 22.4363C4.16116 22.9276 4.48366 23.3624 5.00304 23.3699L6.49554 23.3911L12.5564 23.3978C13.0424 23.3984 13.4293 23.7857 13.4291 24.2618L13.4282 26.2705C13.428 26.7843 13.023 27.1434 12.518 27.1434L5.21845 27.1422L5.21866 27.1418Z" fill="#111827"/>
      <path d="M8.73099 12.987C9.76578 12.915 10.6731 12.4858 11.4312 11.8216C11.692 11.5933 11.9664 11.3781 12.3372 11.4052C12.6847 11.4306 12.947 11.6431 13.1897 11.8789L14.6358 13.2833C15.0654 13.7006 15.0735 14.4291 14.5927 14.8393L13.8324 15.4877C12.2731 16.6666 10.4029 17.2152 8.45203 17.2043C6.81745 17.1952 5.26766 16.7293 3.90661 15.8439C1.63724 14.3677 0.203907 11.9439 0.0230732 9.23453C-0.00671848 8.78766 -0.00984352 8.39558 0.0266148 7.94037C0.396823 3.30995 4.37911 -0.23359 9.02057 0.0120352C11.187 0.126827 12.8656 0.99391 14.4472 2.43099C14.722 2.68079 14.9633 2.96829 14.962 3.36516C14.9612 3.66516 14.7852 3.94891 14.5666 4.14912L12.9839 5.59828C12.7672 5.79662 12.4327 5.88808 12.1566 5.84599C11.796 5.79099 11.5416 5.57578 11.2887 5.34828C9.65766 3.88266 7.22203 3.84204 5.57641 5.31433C3.88224 6.82974 3.67016 9.5837 5.11328 11.4054C5.98057 12.5002 7.30828 13.086 8.73099 12.9868V12.987Z" fill="#111827"/>
    </g>
  </svg>
);

// Large stacked "CR EA" logo for Onboarding splash screen
const LogoLarge = () => (
  <svg viewBox="0 0 118 121" fill="none" className="w-[118px] h-[121px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M80.4325 35.9223C80.4325 34.2015 81.8395 32.6956 83.6281 32.6773L91.775 32.5942C96.56 32.5454 100.438 29.5945 100.837 25.0349C101.18 21.1032 99.7315 17.5075 95.7734 16.1037C94.318 15.5878 92.7924 15.2929 91.1877 15.2913L77.8863 15.2784C77.5958 15.2784 77.3191 15.8515 77.3191 16.148L77.2239 56.519C77.2167 59.5895 74.8262 61.9947 71.8621 62.5366C70.163 62.8468 68.6414 62.7926 66.9697 62.5648C64.8261 62.2729 62.9213 60.9819 62.0701 59.085C61.5619 57.9525 61.3408 56.7789 61.3408 55.4909L61.3537 19.364L61.3634 8.64883C61.365 7.19168 61.5336 5.83742 62.1912 4.51593C63.4231 2.04213 65.954 0.216885 68.9754 0.208502L91.6104 0.146772C93.7355 0.140675 95.6694 0.479051 97.7081 0.879918C102.55 1.83255 106.899 4.02056 110.441 7.18254C119.24 15.0398 120.503 27.7602 113.466 37.0807C110.365 41.1892 106.336 43.3094 106.112 43.7126C106.032 43.8551 106.135 44.2552 106.251 44.416L116.356 58.3839C117.405 59.8334 116.639 61.7394 115.046 62.3369C114.489 62.5457 113.853 62.7446 113.271 62.7446H104.667C103.854 62.7446 103.022 62.5945 102.262 62.4207C100.38 61.9924 99.0054 60.9163 97.9509 59.4165L91.2708 49.9108C89.8484 47.8866 87.3998 46.9721 84.898 46.9889C83.7895 46.9965 82.7302 46.9408 81.7919 46.3723C80.9069 45.8358 80.4285 44.7658 80.4293 43.7316L80.4325 35.9238V35.9223Z" fill="#111827"/>
    <path d="M78.6769 109.122C77.6459 109.12 76.9673 109.807 76.9665 110.658L76.9585 117.559C76.9561 119.405 75.5579 120.962 73.5684 120.961L65.5353 120.956C64.271 120.955 62.9842 120.283 62.271 119.32C61.7143 118.569 61.3876 117.579 61.3916 116.599L61.4901 91.196C61.5167 84.4125 64.3775 77.8668 69.0206 72.7874C74.3356 66.9725 82.063 63.7945 90.2034 63.9744C99.1062 64.171 107.442 68.4426 112.411 75.4258C115.564 79.8574 117.382 85.0862 117.382 90.4774V116.982C117.382 119.047 115.677 120.933 113.568 120.93L104.654 120.918C103.034 120.916 101.736 119.287 101.726 117.82L101.681 110.791C101.675 109.939 101.028 109.161 100.059 109.16L78.6777 109.121L78.6769 109.122ZM100.646 95.7588C101.103 95.6429 101.403 95.4036 101.406 95.098L101.443 90.8775C101.473 87.5074 99.9679 84.2449 97.299 82.0157C94.9481 80.0518 92.0316 79.1814 88.9368 79.2858C82.5148 79.5023 77.3062 85.3225 77.2707 90.8767L77.2449 94.9517C77.2417 95.4349 77.6305 95.7626 78.1904 95.7626L100.647 95.758L100.646 95.7588Z" fill="#111827"/>
    <g id="Group_2">
      <path d="M20.2088 99.2876C17.703 99.2876 16.1265 100.812 16.0587 103.098C16.0007 105.076 17.4166 106.917 19.7167 106.92L55.9121 106.964C57.8177 106.967 59.2014 108.491 59.1933 110.145L59.1522 118.028C59.1433 119.771 57.5394 121.005 55.8468 121L52.1945 120.988H19.7102C16.3694 120.988 13.3447 120.339 10.4129 118.874C4.09983 115.719 0.216789 109.341 0.675847 102.543C0.923529 98.8753 2.62987 95.57 5.09217 92.8036C5.30193 92.5681 5.3697 92.2526 5.15832 92.0201C0.626634 87.0283 -0.73844 80.9856 2.18211 74.8674C5.20592 68.5328 11.8732 64.3427 19.2609 64.3442L32.0241 64.3465L55.8613 64.3671C57.9775 64.3686 59.6225 65.7122 59.6217 67.7432L59.6201 74.9977C59.6201 76.7757 58.1469 78.3434 56.1767 78.3464L33.5974 78.38L19.5594 78.4257C17.4246 78.4325 16.0426 80.1663 16.0789 82.0746C16.1136 83.8717 17.3625 85.4622 19.3738 85.4896L25.1536 85.5674L48.6245 85.5918C50.5067 85.5941 52.0049 87.0108 52.0041 88.7522L52.0008 96.1005C52 97.9798 50.4317 99.2937 48.476 99.2937L20.208 99.2891L20.2088 99.2876Z" fill="#111827"/>
      <path d="M33.8112 47.508C37.8185 47.2443 41.332 45.6744 44.2679 43.2448C45.278 42.4095 46.3405 41.6222 47.7766 41.7213C49.1223 41.8143 50.138 42.5916 51.0779 43.4544L56.6778 48.5917C58.3414 50.1182 58.3728 52.7833 56.5108 54.2839L53.5668 56.6556C47.5281 60.9683 40.2856 62.9749 32.7309 62.9353C26.4009 62.9018 20.3993 61.1977 15.1286 57.9588C6.34029 52.5585 0.789638 43.6921 0.089352 33.7809C-0.0260177 32.1462 -0.0381195 30.7119 0.103067 29.0467C1.53672 12.1082 16.9583 -0.854497 34.9326 0.0440262C43.3223 0.463947 49.8226 3.63583 55.9476 8.89284C57.0118 9.80661 57.946 10.8583 57.9412 12.3101C57.938 13.4076 57.2562 14.4455 56.4099 15.1779L50.2808 20.4791C49.4418 21.2047 48.1461 21.5392 47.0771 21.3853C45.6805 21.1841 44.6955 20.3968 43.716 19.5646C37.3997 14.2032 27.9677 14.0546 21.5949 19.4404C15.0342 24.9839 14.2129 35.0582 19.8014 41.7221C23.1601 45.727 28.3017 47.87 33.8112 47.5072V47.508Z" fill="#111827"/>
    </g>
  </svg>
);

// Chevron circle icon for step 05 dropdown
const ChevronCircle = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12L13 9H7L10 12ZM10.0058 18C8.90472 18 7.86806 17.7917 6.89583 17.375C5.92361 16.9583 5.07292 16.3854 4.34375 15.6562C3.61458 14.9271 3.04167 14.0767 2.625 13.105C2.20833 12.1333 2 11.0951 2 9.99042C2 8.88569 2.20833 7.85069 2.625 6.88542C3.04167 5.92014 3.61458 5.07292 4.34375 4.34375C5.07292 3.61458 5.92333 3.04167 6.895 2.625C7.86667 2.20833 8.90486 2 10.0096 2C11.1143 2 12.1493 2.20833 13.1146 2.625C14.0799 3.04167 14.9271 3.61458 15.6562 4.34375C16.3854 5.07292 16.9583 5.92167 17.375 6.89C17.7917 7.85847 18 8.89319 18 9.99417C18 11.0953 17.7917 12.1319 17.375 13.1042C16.9583 14.0764 16.3854 14.9271 15.6562 15.6562C14.9271 16.3854 14.0783 16.9583 13.11 17.375C12.1415 17.7917 11.1068 18 10.0058 18ZM10 16.5C11.8056 16.5 13.3403 15.8681 14.6042 14.6042C15.8681 13.3403 16.5 11.8056 16.5 10C16.5 8.19444 15.8681 6.65972 14.6042 5.39583C13.3403 4.13194 11.8056 3.5 10 3.5C8.19444 3.5 6.65972 4.13194 5.39583 5.39583C4.13194 6.65972 3.5 8.19444 3.5 10C3.5 11.8056 4.13194 13.3403 5.39583 14.6042C6.65972 15.8681 8.19444 16.5 10 16.5Z" fill="currentColor"/>
  </svg>
);

export default function PlaygroundPage() {
  // Main playground tab view
  const [activeTab, setActiveTab] = useState<"login" | "onboarding" | "spinning_wheel">("spinning_wheel");

  // --- Step 00 Login State ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Onboarding Flow State (Steps 1 to 7) ---
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState("");
  const [isDivDropdownOpen, setIsDivDropdownOpen] = useState(false);
  const [waNumber, setWaNumber] = useState("");

  // Transition state between steps
  const [transitionState, setTransitionState] = useState<"entering" | "normal" | "exiting">("normal");

  const divisionsList = ["Engineering", "Product", "Design", "Marketing", "Operations"];

  // Step transition helper
  const changeStep = (nextStep: number) => {
    setTransitionState("exiting");
    setTimeout(() => {
      setOnboardingStep(nextStep);
      setTransitionState("entering");
      setTimeout(() => {
        setTransitionState("normal");
      }, 50);
    }, 400); // 400ms match exit transition duration
  };

  // Handle Automatic Transitions for Splash screens
  useEffect(() => {
    if (activeTab !== "onboarding") return;

    let timer: NodeJS.Timeout;
    if (onboardingStep === 1) {
      // Step 1: Wait 2.8s total (1.5s logo fade in + 1s hold + 0.3s transition)
      timer = setTimeout(() => {
        changeStep(2);
      }, 2800);
    } else if (onboardingStep === 2) {
      // Step 2: Welcome, wait 2.5s, then transition to Step 3
      timer = setTimeout(() => {
        changeStep(3);
      }, 2500);
    } else if (onboardingStep === 3) {
      // Step 3: Preparing Workspace, wait 3s, then transition to Step 4
      timer = setTimeout(() => {
        changeStep(4);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [onboardingStep, activeTab]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mencoba masuk dengan username: ${username}`);
  };

  const resetOnboarding = () => {
    setFullName("");
    setDivision("");
    setWaNumber("");
    changeStep(1);
  };

  const transitionClass = 
    transitionState === "exiting" 
      ? "opacity-0 translate-y-[-10px] scale-[0.98] transition-all duration-300 ease-in-out" 
      : transitionState === "entering"
      ? "opacity-0 translate-y-[10px] scale-[0.98]"
      : "opacity-100 translate-y-0 scale-100 transition-all duration-300 ease-out";

  return (
    <div className="flex-1 flex flex-col items-center bg-gray-50 py-10 px-4 min-h-[90vh]">
      
      {/* Playground Header / Tabs */}
      <div className="w-full max-w-[650px] mb-8 bg-white border border-gray-200 rounded-xl p-2 flex gap-2 shadow-sm z-20">
        <button
          onClick={() => setActiveTab("onboarding")}
          className={`flex-1 py-2 px-4 rounded-lg font-sans font-medium text-sm transition-all cursor-pointer ${
            activeTab === "onboarding"
              ? "bg-[#286bff] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          01-07 Onboarding
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 px-4 rounded-lg font-sans font-medium text-sm transition-all cursor-pointer ${
            activeTab === "login"
              ? "bg-[#286bff] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          00 Login
        </button>
        <button
          onClick={() => setActiveTab("spinning_wheel")}
          className={`flex-1 py-2 px-4 rounded-lg font-sans font-medium text-sm transition-all cursor-pointer ${
            activeTab === "spinning_wheel"
              ? "bg-[#286bff] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Spinning Wheel
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {activeTab === "spinning_wheel" ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <h2 className="font-sans font-semibold text-2xl text-gray-800 mb-2">Spinning Wheel Component</h2>
              <p className="text-gray-500 font-sans">Hover over the slices, and click the center button to spin!</p>
            </div>
            
            <div className="size-[400px]">
              <SpinningWheel />
            </div>
          </div>
        ) : activeTab === "login" ? (
          /* ==============================================================
             STEP 00: LOGIN CARD
             ============================================================== */
          <div 
            className="bg-white border border-[#edeef0] rounded-[16px] shadow-[0px_8px_12px_rgba(0,0,0,0.15)] flex flex-col items-start w-full max-w-[488px] overflow-hidden transition-all duration-300"
            data-node-id="87:131"
          >
            {/* Card Header */}
            <div className="border-b border-[#edeef0] flex items-center justify-between px-8 py-4 w-full shrink-0" data-node-id="87:71">
              <p className="font-sans font-semibold text-[16px] text-[#525660]" data-node-id="87:66">
                Masuk
              </p>
              <button 
                type="button"
                className="text-[#525660] hover:bg-gray-100 p-1 rounded-full transition-colors duration-150 w-6 h-6 flex items-center justify-center cursor-pointer" 
                data-node-id="87:68"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0625 15L5 13.9375L8.9375 10L5 6.0625L6.0625 5L10 8.9375L13.9375 5L15 6.0625L11.0625 10L15 13.9375L13.9375 15L10 11.0625L6.0625 15Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            {/* Card Body */}
            <form onSubmit={handleLoginSubmit} className="flex flex-col items-center justify-center px-8 md:px-16 py-11 w-full" data-node-id="87:65">
              <div className="flex flex-col gap-8 items-start w-full" data-node-id="87:64">
                
                {/* Logo and Welcome Text */}
                <div className="flex flex-col gap-2 items-start justify-center w-full" data-node-id="83:135">
                  <div className="flex items-start justify-center w-10 h-10" data-node-id="87:161">
                    <LogoSmall />
                  </div>
                  <p className="font-sans font-semibold text-[32px] text-[#111827]" data-node-id="84:45">
                    Masuk
                  </p>
                </div>

                {/* Form Inputs & Submit */}
                <div className="flex flex-col gap-12 items-center w-full" data-node-id="87:63">
                  <div className="flex flex-col gap-4 items-start w-full" data-node-id="87:55">
                    {/* Username Field */}
                    <div className="flex flex-col gap-2 items-start w-full" data-node-id="86:46">
                      <label htmlFor="username" className="font-sans font-semibold text-[14px] text-[#525660]" data-node-id="86:44">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan username"
                        className="border border-[#edeef0] flex h-[52px] items-center px-4 rounded-[8px] w-full text-[16px] text-gray-900 placeholder-[#b9bdc7] focus:outline-none focus:border-[#286bff] focus:ring-1 focus:ring-[#286bff] transition-all"
                        data-node-id="85:31"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2 items-start w-full" data-node-id="87:47">
                      <label htmlFor="password" className="font-sans font-semibold text-[14px] text-[#525660]" data-node-id="87:48">
                        Kata Sandi
                      </label>
                      <div className="border border-[#edeef0] flex h-[52px] items-center justify-between px-4 rounded-[8px] w-full relative focus-within:border-[#286bff] focus-within:ring-1 focus-within:ring-[#286bff] transition-all" data-node-id="87:49">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi"
                          className="w-full h-full text-[16px] text-gray-900 placeholder-[#b9bdc7] bg-transparent focus:outline-none"
                          data-node-id="87:50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#6B7280] hover:text-gray-900 transition-colors p-1 rounded focus:outline-none cursor-pointer"
                          data-node-id="87:51"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.71809 9.71082C1.64864 9.89792 1.64864 10.1037 1.71809 10.2908C2.3945 11.9309 3.54268 13.3333 5.01706 14.3201C6.49144 15.3069 8.22562 15.8336 9.99975 15.8336C11.7739 15.8336 13.5081 15.3069 14.9824 14.3201C16.4568 13.3333 17.605 11.9309 18.2814 10.2908C18.3509 10.1037 18.3509 9.89792 18.2814 9.71082C17.605 8.0707 16.4568 6.66835 14.9824 5.68157C13.5081 4.69478 11.7739 4.168 9.99975 4.168C8.22562 4.168 6.49144 4.69478 5.01706 5.68157C3.54268 6.66835 2.3945 8.0707 1.71809 9.71082Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            {showPassword && (
                              <path d="M3 3L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button & Subtext */}
                  <div className="flex flex-col gap-2 items-center w-full" data-node-id="87:56">
                    <button
                      type="submit"
                      className="bg-[#286bff] hover:bg-[#1a5bf0] active:bg-[#0c4ce0] text-white font-sans font-semibold text-[20px] rounded-[10px] w-full h-[56px] flex items-center justify-center shadow-[0px_4px_4px_rgba(59,130,246,0.2)] transition-all cursor-pointer"
                      data-node-id="87:57"
                    >
                      Masuk
                    </button>
                    <p className="font-sans font-normal text-[12px] text-[#8a91a1] text-center tracking-[0.6px] leading-[1.5] w-full" data-node-id="87:59">
                      Gunakan akun <span className="font-medium text-[#525660]">Pasti Sukses</span> yang sudah aktif.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Card Footer */}
            <div className="bg-white border-t border-[#edeef0] flex items-center px-4 py-2 w-full shrink-0" data-node-id="87:76">
              <p className="font-sans font-normal text-[12px] text-[#8a91a1] tracking-[0.6px] leading-[1.5]" data-node-id="87:73">
                Butuh bantuan? Buka <a href="#" className="text-[#286bff] hover:underline">Help Center</a>
              </p>
            </div>
          </div>
        ) : (
          /* ==============================================================
             STEPS 01 - 07: ONBOARDING FLOW
             ============================================================== */
          <div className="flex flex-col items-center w-full">
            <div 
              className="bg-white border border-[#edeef0] rounded-[16px] shadow-[0px_8px_12px_rgba(0,0,0,0.15)] flex flex-col items-start w-full max-w-[488px] h-[612px] overflow-hidden relative transition-all duration-300"
              id={`node-97_${411 + onboardingStep}`}
            >
              {/* Card Header */}
              <div className="bg-white border-[#edeef0] border-b border-solid flex items-center px-8 py-4 w-full shrink-0" id="node-97_header">
                <p className="font-sans font-semibold leading-[20px] text-[#525660] text-[16px]">
                  Onboarding
                </p>
              </div>

              {/* Card Body - Content changes based on onboardingStep */}
              <div className="bg-white flex-1 flex flex-col items-center justify-center px-8 md:px-16 py-11 w-full overflow-y-auto">
                <div className={`w-full h-full flex flex-col items-center justify-center ${transitionClass}`}>
                  
                  {/* STEP 1: SPLASH */}
                  {onboardingStep === 1 && (
                    <div className="flex flex-col items-center justify-center" id="node-97_177">
                      <div className="flex items-center justify-center size-[128px] animate-logo-fade-in" id="node-97_178">
                        <LogoLarge />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: WELCOME */}
                  {onboardingStep === 2 && (
                    <div className="flex flex-col items-center justify-center text-center" id="node-97_281">
                      <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight w-full" id="node-97_256">
                        Selamat datang di Creative Universe
                      </h2>
                    </div>
                  )}

                  {/* STEP 3: PREPARING WORKSPACE */}
                  {onboardingStep === 3 && (
                    <div className="flex flex-col items-center justify-center text-center w-full" id="node-97_296">
                      <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight w-full mb-6" id="node-97_297">
                        Kami menyiapkan ruang kerjamu
                      </h2>
                      
                      {/* Visual Loading Indicator */}
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="w-3 h-3 bg-[#286bff] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-3 h-3 bg-[#286bff] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-3 h-3 bg-[#286bff] rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: FULL NAME */}
                  {onboardingStep === 4 && (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex flex-col gap-4 items-start w-full mb-8">
                        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
                          <LogoSmall />
                        </div>
                        <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight">
                          Lengkapi identitasmu
                        </h2>
                      </div>

                      <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col gap-2 items-start w-full">
                          <label htmlFor="fullname" className="font-sans font-semibold text-[14px] text-[#525660]">
                            Nama Lengkap
                          </label>
                          <input
                            id="fullname"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="border border-[#edeef0] flex h-[52px] items-center px-4 rounded-[8px] w-full text-[16px] text-gray-900 placeholder-[#b9bdc7] focus:outline-none focus:border-[#286bff] focus:ring-1 focus:ring-[#286bff] transition-all"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => onboardingStep === 4 && fullName && changeStep(5)}
                          disabled={!fullName}
                          className={`bg-[#286bff] text-white font-sans font-semibold text-[20px] rounded-[10px] w-full h-[56px] flex items-center justify-center shadow-[0px_4px_4px_rgba(59,130,246,0.2)] transition-all ${
                            fullName ? "hover:bg-[#1a5bf0] active:bg-[#0c4ce0] cursor-pointer" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Lanjut
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: DIVISION */}
                  {onboardingStep === 5 && (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex flex-col gap-4 items-start w-full mb-8">
                        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
                          <LogoSmall />
                        </div>
                        <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight">
                          Pilih divisi kerja
                        </h2>
                      </div>

                      <div className="flex flex-col gap-8 w-full relative">
                        <div className="flex flex-col gap-2 items-start w-full">
                          <label className="font-sans font-semibold text-[14px] text-[#525660]">
                            Divisi
                          </label>
                          <div 
                            onClick={() => setIsDivDropdownOpen(!isDivDropdownOpen)}
                            className="border border-[#edeef0] flex h-[52px] items-center justify-between px-4 rounded-[8px] w-full cursor-pointer bg-white relative transition-all hover:border-gray-300"
                          >
                            <p className={`text-[16px] ${division ? "text-gray-900" : "text-[#b9bdc7]"}`}>
                              {division || "Pilih divisi"}
                            </p>
                            <ChevronCircle />
                          </div>

                          {/* Custom dropdown menu */}
                          {isDivDropdownOpen && (
                            <div className="absolute top-[84px] left-0 w-full bg-white border border-[#edeef0] rounded-[8px] shadow-lg z-50 overflow-hidden animate-fade-in">
                              {divisionsList.map((div) => (
                                <div
                                  key={div}
                                  onClick={() => {
                                    setDivision(div);
                                    setIsDivDropdownOpen(false);
                                  }}
                                  className="px-4 py-3 hover:bg-gray-50 text-gray-800 text-[16px] cursor-pointer transition-colors"
                                >
                                  {div}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onboardingStep === 5 && division && changeStep(6)}
                          disabled={!division}
                          className={`bg-[#286bff] text-white font-sans font-semibold text-[20px] rounded-[10px] w-full h-[56px] flex items-center justify-center shadow-[0px_4px_4px_rgba(59,130,246,0.2)] transition-all ${
                            division ? "hover:bg-[#1a5bf0] active:bg-[#0c4ce0] cursor-pointer" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Lanjut
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: WHATSAPP NUMBER */}
                  {onboardingStep === 6 && (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex flex-col gap-4 items-start w-full mb-8">
                        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
                          <LogoSmall />
                        </div>
                        <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight">
                          Nomor WhatsApp
                        </h2>
                      </div>

                      <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col gap-2 items-start w-full">
                          <label htmlFor="wa-number" className="font-sans font-semibold text-[14px] text-[#525660]">
                            Nomor WhatsApp
                          </label>
                          <div className="border border-[#edeef0] flex h-[52px] items-center px-4 rounded-[8px] w-full focus-within:border-[#286bff] focus-within:ring-1 focus-within:ring-[#286bff] transition-all bg-white">
                            <span className="text-gray-900 font-sans font-medium mr-2">+62</span>
                            <input
                              id="wa-number"
                              type="tel"
                              required
                              value={waNumber}
                              onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9-]/g, ""))}
                              placeholder="812-xxxx-xxxx"
                              className="w-full h-full text-[16px] text-gray-900 placeholder-[#b9bdc7] bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onboardingStep === 6 && waNumber && changeStep(7)}
                          disabled={!waNumber}
                          className={`bg-[#286bff] text-white font-sans font-semibold text-[20px] rounded-[10px] w-full h-[56px] flex items-center justify-center shadow-[0px_4px_4px_rgba(59,130,246,0.2)] transition-all ${
                            waNumber ? "hover:bg-[#1a5bf0] active:bg-[#0c4ce0] cursor-pointer" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Selesai
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 7: READY */}
                  {onboardingStep === 7 && (
                    <div className="flex flex-col items-center justify-center text-center w-full">
                      <h2 className="font-sans font-semibold text-[#111827] text-[32px] leading-tight w-full">
                        Siap masuk ke universe
                      </h2>
                    </div>
                  )}

                </div>
              </div>

              {/* Card Footer - Dynamic text based on step */}
              <div className="bg-white border-t border-[#edeef0] flex items-center px-6 py-4 w-full shrink-0 min-h-[52px]" id="node-97_footer">
                <p className="font-sans font-normal text-[12px] text-[#8a91a1] tracking-[0.6px] leading-[1.5] w-full">
                  {onboardingStep <= 3 && "Butuh bantuan? Buka Help Center"}
                  {(onboardingStep === 4 || onboardingStep === 5 || onboardingStep === 6) && "Bantu kami mengenali kamu"}
                  {onboardingStep === 7 && "Butuh bantuan? Buka Help Center"}
                </p>
              </div>
            </div>

            {/* Quick Demo Controls Panel (Helper for the Playground) */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4 w-full max-w-[488px] shadow-sm flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Demo Controls (Lompat Langkah)</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => changeStep(stepNum)}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      onboardingStep === stepNum
                        ? "bg-[#286bff] text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Step {stepNum}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes logoFadeIn {
          0% { opacity: 0; transform: scale(0.9) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-logo-fade-in {
          animation: logoFadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
