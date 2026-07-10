"use client";

import { useState } from "react";
import {
  SideMenuAvatar,
  SideMenuButton,
  SideMenuCollaps,
  SideMenuExpand,
  SideMenuIconApp,
  type SideMenuAvatarVariant,
  type SideMenuIconAppState,
  type SideMenuIconAppType,
  type SideMenuMenuModel,
  type SideMenuMenuStatus,
} from "@/components/sidemenu";

import {
  TaskCardDate,
  TaskCardNextButton,
  TaskCardTitleTask,
  TaskCardLoadingBar,
  TaskCardDetailStatus,
  TaskCardDetail,
  TaskCardButtonStatus,
  type TaskCardDateState,
  type TaskCardNextButtonState,
  type TaskCardLoadingBarPercentage,
  type TaskCardDetailStatusState,
  type TaskCardDetailVariant,
  type TaskCardButtonStatusState,
  type TaskCardButtonStatusType,
} from "@/components/taskcard";

import { TaskCard, type TaskCardState } from "@/components/task-card";

export default function ComponentsPage() {
  const [cardState, setCardState] = useState<TaskCardState>("0");
  const [cardTimestamps, setCardTimestamps] = useState<Record<string, string>>({});

  const sideMenuItems = [
    "sidemenu/button",
    "sidemenu/avatar",
    "sidemenu/iconapp",
    "sidemenu/collaps",
    "sidemenu/expand",
  ];
  const buttonStates: SideMenuMenuStatus[] = [
    "Highlight",
    "Active",
    "Hover",
    "Default",
  ];
  const buttonModels: Array<{
    label: string;
    value: SideMenuMenuModel;
  }> = [
    { label: "Default", value: "Icon" },
    { label: "Icon + Text", value: "Icon + Text" },
    { label: "Icon + Text + Badge", value: "Icon + Text + Badge" },
  ];
  const avatarVariants: SideMenuAvatarVariant[] = ["Avatar", "Avatar Detail"];
  const iconAppStates: SideMenuIconAppState[] = ["Light", "Dark"];
  const iconAppTypes: SideMenuIconAppType[] = ["Icon", "Icon + Text"];
  const previewPrimaryItems = [
    { label: "Tugas Hari Ini", icon: "assignment_add" },
    { label: "Tugas Belum Selesai", icon: "bar_chart_4_bars" },
    { label: "Tugas Bulan Ini", icon: "bar_chart_4_bars" },
    { label: "Rekap Performa", icon: "bar_chart_4_bars" },
  ];
  const previewSecondaryItems = [
    { label: "Notifikasi", icon: "notifications" },
    { label: "Pesan", icon: "mail" },
    { label: "Pengaturan", icon: "settings" },
  ];

  const taskCardItems = [
    "taskcard/date",
    "taskcard/next-button",
    "taskcard/title-task",
    "taskcard/loading-bar",
    "taskcard/detail-status",
    "taskcard/detail",
    "taskcard/button-status",
    "taskcard/full-card",
  ];

  const tcDateStates: TaskCardDateState[] = ["Default", "Done"];
  const tcNextButtonStates: TaskCardNextButtonState[] = ["On", "Off", "Done", "Delete"];
  const tcLoadingBarPercentages: TaskCardLoadingBarPercentage[] = ["0", "25", "50", "75", "100"];
  const tcDetailStatusStates: TaskCardDetailStatusState[] = ["3D Gambar Kerja", "Draft Final"];
  const tcDetailVariants: TaskCardDetailVariant[] = ["Vendor", "Date", "Count Down", "Variant4"];
  const tcButtonStatusStates: TaskCardButtonStatusState[] = ["ACC Draft", "Progress", "Approve", "Email"];
  const tcButtonStatusTypes: TaskCardButtonStatusType[] = ["Default", "Progress", "Done"];
  const tcCardStates = ["0", "ACC Draft", "Progress Design", "Approval Design", "Kirim Email", "Done"] as const;

  return (
    <div className="flex w-full flex-col gap-6 py-6">
      <div className="border-b border-cu-line pb-5">
        <p className="text-sm font-medium text-cu-muted">Component Library</p>
        <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Components</h1>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-cu-ink">A. Side Menu</h2>
        </div>

        <ol className="divide-y divide-cu-line rounded-lg border border-cu-line bg-cu-surface">
          {sideMenuItems.map((item, index) => (
            <li key={item} className="flex flex-col gap-4 px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cu-panel-soft text-sm font-semibold text-cu-muted">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-cu-ink">{item}</span>
              </div>

              {item === "sidemenu/button" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="grid grid-cols-[38px_194px_216px] gap-x-[19px] gap-y-5">
                    {buttonStates.map((state) =>
                      buttonModels.map((model) => (
                        <SideMenuButton
                          key={`${state}-${model.value}`}
                          model={model.value}
                          status={state}
                          label="Dashboard"
                          icon="apps"
                          badge={10}
                        />
                      )),
                    )}
                  </div>
                </div>
              )}

              {item === "sidemenu/avatar" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="flex items-center gap-[22px]">
                    {avatarVariants.map((variant) => (
                      <SideMenuAvatar
                        key={variant}
                        variant={variant}
                        name="Anjas Kurniawan"
                        role="Root Admin"
                      />
                    ))}
                  </div>
                </div>
              )}

              {item === "sidemenu/iconapp" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="grid grid-cols-[38px_208px] gap-x-[14px] gap-y-5">
                    {iconAppStates.map((state) =>
                      iconAppTypes.map((type) => (
                        <SideMenuIconApp
                          key={`${state}-${type}`}
                          state={state}
                          type={type}
                        />
                      )),
                    )}
                  </div>
                </div>
              )}

              {item === "sidemenu/collaps" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <SideMenuCollaps
                    primaryItems={previewPrimaryItems}
                    secondaryItems={previewSecondaryItems}
                    avatarName="Anjas Kurniawan"
                    avatarRole="Root Admin"
                    className="!static !m-0 !h-[961px] !min-h-0"
                  />
                </div>
              )}

              {item === "sidemenu/expand" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <SideMenuExpand
                    primaryItems={previewPrimaryItems}
                    secondaryItems={previewSecondaryItems}
                    avatarName="Anjas Kurniawan"
                    avatarRole="Root Admin"
                    className="!static !m-0 !h-[961px] !min-h-0"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4 mt-6">
        <div>
          <h2 className="text-xl font-semibold text-cu-ink">B. Task Card</h2>
        </div>

        <ol className="divide-y divide-cu-line rounded-lg border border-cu-line bg-cu-surface">
          {taskCardItems.map((item, index) => (
            <li key={item} className="flex flex-col gap-4 px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cu-panel-soft text-sm font-semibold text-cu-muted">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-cu-ink">{item}</span>
              </div>

              {item === "taskcard/date" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="flex items-center gap-4">
                    {tcDateStates.map((state) => (
                      <TaskCardDate key={state} state={state} />
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/next-button" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="flex items-center gap-4">
                    {tcNextButtonStates.map((state) => (
                      <TaskCardNextButton key={state} state={state} />
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/title-task" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5 bg-gray-50">
                  <TaskCardTitleTask title="KV JETE Pakuwon Solo" />
                </div>
              )}

              {item === "taskcard/loading-bar" && (
                <div className="ml-12 w-full max-w-[500px] rounded-xl border border-cu-line bg-white p-5">
                  <div className="flex flex-col gap-4">
                    {tcLoadingBarPercentages.map((pct) => (
                      <TaskCardLoadingBar key={pct} percentage={pct} />
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/detail-status" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="grid grid-cols-2 gap-4">
                    {tcDetailStatusStates.map((status) => (
                      <div key={status} className="flex flex-col gap-2">
                        <TaskCardDetailStatus status={status} isDone={false} />
                        <TaskCardDetailStatus status={status} isDone={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/detail" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="flex items-center gap-6">
                    {tcDetailVariants.map((variant) => (
                      <TaskCardDetail key={variant} variant={variant} />
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/button-status" && (
                <div className="ml-12 w-fit rounded-xl border border-cu-line bg-white p-5">
                  <div className="grid grid-cols-4 gap-4">
                    {tcButtonStatusStates.map((status) => (
                      <div key={status} className="flex flex-col gap-2">
                        {tcButtonStatusTypes.map((type) => (
                          <TaskCardButtonStatus key={`${status}-${type}`} status={status} type={type} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item === "taskcard/full-card" && (
                <div className="ml-12 rounded-xl border border-cu-line bg-white p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-cu-muted">Active State:</span>
                    <span className="text-xs font-bold text-cu-ink bg-cu-panel-soft px-2 py-0.5 rounded">{cardState}</span>
                    <button 
                      onClick={() => {
                        setCardState("0");
                        setCardTimestamps({});
                      }} 
                      className="text-xs font-medium text-[#6b7280] border border-cu-line px-2 py-0.5 rounded hover:bg-gray-50 cursor-pointer ml-auto"
                    >
                      Reset State
                    </button>
                  </div>
                  <div className="w-full">
                    <TaskCard 
                      state={cardState} 
                      timestamps={cardTimestamps}
                      onStepClick={(step) => {
                        const now = new Date();
                        const pad = (num: number) => String(num).padStart(2, "0");
                        const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
                        
                        setCardTimestamps(prev => ({
                          ...prev,
                          [step]: formatted
                        }));

                        let mappedState: TaskCardState = "0";
                        if (step === "ACC Draft") mappedState = "ACC Draft";
                        else if (step === "Progress") mappedState = "Progress Design";
                        else if (step === "Approve") mappedState = "Approval Design";
                        else if (step === "Email") mappedState = "Kirim Email";
                        setCardState(mappedState);
                      }}
                      onNextClick={(link) => {
                        if (link) {
                          console.log("File link submitted:", link);
                          alert(`File terkirim dengan link: ${link}`);
                        }
                        const states: TaskCardState[] = ["0", "ACC Draft", "Progress Design", "Approval Design", "Kirim Email", "Done"];
                        const currentIndex = states.indexOf(cardState);
                        const nextIndex = (currentIndex + 1) % states.length;
                        setCardState(states[nextIndex]);
                      }}
                      onDetailStatusClick={(status) => {
                        console.log(`Clicked detail status: ${status}`);
                      }}
                      onDeleteConfirm={() => {
                        console.log("Delete confirmed!");
                        setCardState("0");
                        setCardTimestamps({});
                      }}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
