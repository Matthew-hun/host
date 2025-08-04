"use client";
import { ConfigProvider, Modal, Drawer, notification, Segmented, Button } from "antd";
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
  const { match, isRunning, RemoveScore, CreateMatch } = matchManager;
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

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
    if (localStorageMatch) {
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

      if (!isInput && e.key === "Backspace") {
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
          colorBgContainer: "var(--color-background-light)",
          colorTextPlaceholder: "var(--color-placeholder)",
          colorSuccess: "#fff",
          colorBgElevated: "var(--color-background-light)",
        },
      }}
    >
      {contextHolder}
      <Modal
        className="w-full"
        footer={null}
        title="Game settings"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isGameSettingsOpen}
        onOk={handleOkGameSettings}
        onCancel={handleCancelGameSettings}
        style={{ top: 20 }}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <GameSetup Close={handleOkGameSettings} />
      </Modal>
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

      <Drawer
        title="Basic Drawer"
        closable={{ "aria-label": "Close Button" }}
        onClose={onCloseDrawer}
        open={openDrawer}
        size="large"
        width="80%"
      >
        <MatchStats />
      </Drawer>

      <div className="min-h-screen w-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-black p-4 overflow-hidden">
        <Navbar />

        <div
          id="main"
          className="w-fit h-fit flex flex-col items-center gap-4 text-white"
        >
          <div id="Other" className="w-full flex justify-between items-center">
            <MdSettings
              className="text-2xl text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
              onClick={showGameSettings}
            />
            <LegData />
            <div>
              <FiBarChart2
                className="text-2xl text-emerald-500 mx-auto mb-2 cursor-pointer hover:text-emerald-600 transition-colors duration-200"
                onClick={showDrawer}
              />
            </div>
          </div>

          <div id="Teams" className="flex items-stretch gap-5">
            {match?.teams.map((team, teamIndex) => {
              return <TeamCard team={team} teamIndex={teamIndex} key={teamIndex} />;
            })}
          </div>

          <div className="w-full flex justify-center">
            <ScoreInput />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
