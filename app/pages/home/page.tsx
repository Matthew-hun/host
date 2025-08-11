"use client";
import {
  ConfigProvider,
  Modal,
  Drawer,
  notification,
  Segmented,
  Button,
} from "antd";
import { createContext, useEffect, useMemo, useState } from "react";
import useMatch from "../../hooks/MatchProvider";
import Navbar from "../../components/Navbar";
import usePlayers from "../../hooks/usePlayers";
import GameSetup from "../../components/GameSetup";
import { FiBarChart2 } from "react-icons/fi";
import MatchStats from "../../components/MatchStats";
import { MdSettings } from "react-icons/md";
import { set } from "zod/v4-mini";
import TeamCard from "../../components/TeamCard";
import ScoreInput from "../../components/ScoreInput";
import type { NotificationArgsProps } from "antd";
import LegData from "@/app/components/LegData";
import StopWatch from "@/app/components/StopWatch";

export default function Home() {
  const matchManager = useMatch();
  const { match, isRunning, RemoveScore, CreateMatch, GetCheckOuts2, GetThrownDartsToCheckOut, isCheckOutTryOpen, setIsCheckOutTryOpen, provideCheckoutDarts } =
    matchManager;
  const a = GetCheckOuts2(34);
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOkIsCheckOutTryOpen = (value: number) => {
    GetThrownDartsToCheckOut(value)
    setIsCheckOutTryOpen(false);
  }

  const [isGameSettingsOpen, setIsModalOpen] = useState(false);
  const [nextMatchOpen, setNextMatchOpen] = useState(false);

  const showGameSettings = () => {
    setIsModalOpen(true);
  };

  const handleOkGameSettings = () => {
    setIsModalOpen(false);
  };

  const handleCancelGameSettings = () => {
    setIsModalOpen(false);
  };

  const handleOkNextMatch = () => {
    if (!match) return;
    CreateMatch(
      match?.teams,
      match?.matchSettings.legs,
      match?.matchSettings.mode,
      match?.matchSettings.startingScore,
      match?.matchSettings.randomStartingTeam,
      match?.matchSettings.randomStartingPlayer,
      match?.matchSettings.checkOutMode,
      match?.matchSettings.badgeMode,
    );
    setNextMatchOpen(false);
  };

  const handleCancelNextMatch = () => {
    setNextMatchOpen(false);
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string) => {
    api.info({
      message: message,
      placement: "bottomRight",
      style: { color: "#000" },
      className: "text-black",
      role: "status",
    });
  };

  useEffect(() => {
    if (match?.isOver) {
      setNextMatchOpen(true);
    }
  }, [match]);

  useEffect(() => {
    const localStorageMatch = localStorage.getItem("match");
    if (localStorageMatch !== null) {
      const parsedMatch = JSON.parse(localStorageMatch);
      matchManager.setMatch(parsedMatch);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      if (!isInput && e.key === "Delete") {
        try {
          RemoveScore();
        } catch (error) {
          if (error instanceof Error) {
            openNotification(error.message);
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [RemoveScore, openNotification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCheckOutTryOpen) return;

      const key = e.key;
      if (['0', '1', '2', '3'].includes(key)) {
        e.preventDefault();
        provideCheckoutDarts(parseInt(key));
      }
    };

    if (isCheckOutTryOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckOutTryOpen, provideCheckoutDarts]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "var(--color-background)",
            headerBg: "transparent",
            colorIcon: "white",
          },
          Segmented: {
            itemActiveBg: "var(--color-primary)",
            itemHoverBg: "var(--color-primary-hover)",
            itemColor: "white",
            itemSelectedBg: "var(--color-primary)",
            trackBg: "var(--color-background-light)",
          },
          InputNumber: {
            colorBgContainer: "var(--color-background-light)",
            colorText: "white",
            colorBorder: "transparent",
            colorPrimary: "var(--color-primary)",
            colorPrimaryHover: "var(--color-primary-hover)",
          },
          Input: {
            activeBorderColor: "var(--color-primary)",
          },
          Button: {
            colorPrimary: "var(--color-primary)",
            colorPrimaryHover: "var(--color-primary-hover)",
            colorPrimaryActive: "var(--color-primary-dark)",
            colorTextLightSolid: "white",
            colorBgContainer: "var(--color-background-light)",
            colorBorder: "transparent",
          },
          Select: {
            colorBgContainer: "var(--color-background-light)",
            colorText: "white",
            optionSelectedBg: "var(--color-primary-hover)",
            optionSelectedColor: "black",
            controlOutline: "var(--color-primary)",
            borderRadius: 8,
            clearBg: "var(--color-background-light)",
          },
          Progress: {
            defaultColor: "var(--color-progress)",
          },
        },
        token: {
          colorText: "white",
          colorPrimary: "var(--color-primary)",
          colorPrimaryBorder: "var(--color-primary)",
          colorPrimaryHover: "var(--color-primary-hover)",
          colorBgContainer: "var(--color-background-light)",
          colorTextPlaceholder: "var(--color-placeholder)",
          colorSuccess: "#fff",
          colorBgElevated: "#fff",
          colorBgBase: "var(--color-background-light)",
          colorIcon: "#fff",
          colorIconHover: "var(--color-primary-hover)",
          colorBorder: "transparent",
        },
      }}
    >
      {contextHolder}
      <Drawer
        className="w-full custom-drawer"
        placement="left"
        title="Game settings"
        closable={{ "aria-label": "Custom Close Button" }}
        width="40%"
        open={isGameSettingsOpen}
        onClose={handleCancelGameSettings}
        headerStyle={{ display: "none" }}
      >
        <GameSetup Close={handleOkGameSettings} />
      </Drawer>
      <Modal
        className="w-full"
        title="Next Match"
        closable={{ "aria-label": "Custom Close Button" }}
        open={nextMatchOpen}
        onOk={handleOkNextMatch}
        onCancel={handleCancelNextMatch}
        footer={[
          <Button key="cancle" onClick={handleCancelNextMatch}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleOkNextMatch}>
            Next match
          </Button>,
        ]}
      ></Modal>

      <Modal
        title="Check out tries"
        open={isCheckOutTryOpen}
        footer
        closable={false}
      >
        <div className="w-full h-full flex gap-2 justify-center items-center p-4">
          {Array.from({ length: 4 }, (_, i) => i).map((number) => {
            return (
              <div
                onClick={() => {
                  console.log(`Clicked: ${number}`); // Debug log
                  provideCheckoutDarts(number);
                }}
                key={number}
                className="cursor-pointer w-16 h-16 bg-slate-500 hover:bg-slate-400 rounded-md text-4xl flex justify-center items-center transition-colors duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    provideCheckoutDarts(number);
                  }
                }}
              >
                {number}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-4 text-sm opacity-70">
          Click on the button or press 0-3
        </div>
      </Modal>

      <Drawer
        title="Basic Drawer"
        closable={{ "aria-label": "Close Button" }}
        onClose={onCloseDrawer}
        open={openDrawer}
        size="large"
        width="30%"
      >
        <MatchStats />
      </Drawer>

      <div className="min-h-screen w-screen flex flex-col items-center relative py-4 px-50 overflow-hidden">
        {/* Statikus háttér */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
          {/* Központosított körök */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/15 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-cyan-500/15 rounded-full blur-xl"></div>

          {/* Szimmetrikus vonalak */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"></div>

          {/* Központi geometriai formák */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12 border border-emerald-500/20 rotate-45 rounded-sm"></div>
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-8 h-8 border border-blue-500/15 rotate-12 rounded-sm"></div>

          {/* Finom rácsminta */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Tartalom */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
          <Navbar />

          <div
            id="main"
            className="w-fit h-full flex flex-col items-center gap-4 text-white px-50"
          >
            <div
              id="Other"
              className="relative max-w-screen w-full"
            >
              <MdSettings
                className="absolute z-10 left-10 top-1/2 -translate-y-1/2 text-2xl text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                onClick={showGameSettings}
              />
              <LegData />
              <FiBarChart2
                className="absolute z-10 right-10 top-1/2 -translate-y-1/2 text-2xl text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                onClick={showDrawer}
              />
            </div>

            <div
              id="Teams"
              className={`flex1/${match?.teams.length} w-full h-full flex items-stretch gap-20`}
            >
              {match?.teams.map((team, teamIndex) => {
                return (
                  <TeamCard team={team} teamIndex={teamIndex} key={teamIndex} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}